import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, Alert, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Block, Text } from "galio-framework";
import * as Location from "expo-location";
import firebase from "@react-native-firebase/app";
import "@react-native-firebase/database";
import { IMAGES } from "../../constants/Theme";
//assets
import oscar from "../../assets/images/oscar.jpg";
//components
import NewRequest from "../../components/Ride/NewRequest";
import PickUp from "../../components/Ride/PickUp";
import AuthContext from "../../context/AuthContext";
//styles
import { COLOURS } from "../../constants/Theme";
import styles from "./styles";
//functions
import UserPermissions from "../../permissions/UserPermissions";
import { connectDB, disconnectDB, markRideAccepted } from "../../config/Fire";

const Dashboard = props => {
	const [coords, setInitialCoords] = useState({ latitude: 0, longitude: 0 });
	const [markers, updateMarkers] = useState([]);
	const [currentReqId, setCurrentReqId] = useState("");
	const [isOnline, setOnlineStatus] = useState(false);
	const [newRide, setNewRide] = useState(false); //changes when driver accepts a new ride request
	const [riderDetails, setRiderDetails] = useState(false);
	const [incomingReqs, updateIncoming] = useState([]);
	const [declinedReqs, updateDeclined] = useState([]);

	//CONSTANTS & REFS
	const { user } = useContext(AuthContext);
	const topic = "ride_requests";
	const requestRef = firebase.database().ref(`requests`);
	const mapViewRef = useRef(null);

	const reset = useCallback(
		(reqId, type) => {
			setRiderDetails(false);
			updateIncoming(prevState => {
				prevState.shift();
				return prevState;
			});
			updateMarkers(prevState => {
				prevState.pop()		// removes element at front of STACK
				return prevState;
			})
			updateDeclined(prevState => {
				prevState.push(reqId);
				return prevState;
			});
			if(type === "CANCEL"){
				console.log("CANCELLED");
				setNewRide(false);
			} else {
				console.log("DECLINED")
			}
		},
		[incomingReqs, declinedReqs]
	);

	function acceptRequest(requestId) {
		markRideAccepted(`requests/${requestId}`, user.uid)
			.then(() => {
				requestRef.off("child_added");
				console.log("ACCEPTED");
				setNewRide(true);
			})
			.catch(err => Alert.alert("ERROR", err.message));
	}

	/**
	 * CONSTRUCTOR
	 */
	useEffect(() => {
		setRiderDetails(false);
		(async () => {
			await UserPermissions.getLocationPermission();
			let {
				coords: { latitude, longitude },
			} = await Location.getCurrentPositionAsync({
				accuracy: Location.Accuracy.BestForNavigation,
				enableHighAccuracy: true,
				timeout: 20000,
				maximumAge: 2000,
			});
			setInitialCoords({
				latitude,
				longitude,
			});
			updateMarkers(prevState => {
				prevState.push({ id: "home", latitude, longitude });
				return prevState;
			});
			await UserPermissions.registerPushNotificationsAsync(user);
		})();
	}, []);

	// updates on new markers
	useEffect(() => {
		console.table(markers)
	}, [markers]);

	useEffect(() => {
		if (isOnline) {
			connectDB();
			//subscribe to `ride_requests` topic messages
			firebase
				.messaging()
				.subscribeToTopic(topic)
				.then(() => console.log("subscribed to ride requests"))
				.catch(err => console.error(err));
			//init firebase database event listener
			setTimeout(
				() =>
					requestRef
						.orderByKey()
						.limitToLast(1)
						.on(
							"child_added",
							snapshot => {
								let lastReq = undefined;
								updateIncoming(prevState => {
									lastReq = prevState.length
										? prevState[0]
										: null;
									console.log("initial queue:", prevState);
									prevState.push(snapshot.key);
									console.log("updated queue:", prevState);
									return prevState;
								});
								console.log("Key:", snapshot.key);
								console.log("Last request:", lastReq);
								if (
									snapshot.key !== undefined &&
									!declinedReqs.includes(snapshot.key) &&
									snapshot.val().isAccepted !== true
								) {
									updateMarkers(prevState => {
										let {
											lat: latitude,
											lng: longitude,
										} = snapshot.val().source[
											"geometry"
										].location;
										prevState.push({ id: "pickup", latitude, longitude });
										return prevState;
									});
									setCurrentReqId(snapshot.key);
									setRiderDetails(snapshot.val());
								}
							},
							err => Alert.alert("Error:", err.message)
						),
				1500
			);
		} else {
			//end firebase db listener
			requestRef.off("child_added");
			firebase
				.messaging()
				.unsubscribeFromTopic(topic)
				.then(() => {
					console.log("unsubscribed from ride requests");
					disconnectDB();
				})
				.catch(err => console.error(err));
		}
		return () => clearTimeout();
	}, [isOnline, reset]);

	return (
		<Block style={{ ...StyleSheet.absoluteFillObject }}>
			<StatusBar hidden />
			<MapView
				ref={mapViewRef}
				provider={PROVIDER_GOOGLE}
				initialRegion={{
					latitude: 51.54399,
					longitude: 0.15706,
					latitudeDelta: 0.005,
					longitudeDelta: 0.005,
				}}
				region={{
					...coords,
					latitudeDelta: 0.005,
					longitudeDelta: 0.005,
				}}
				followUserLocation={!riderDetails}
				showsCompass={true}
				showsUserLocation={!riderDetails}
				style={[styles.mapContainer, {flex: !riderDetails ? 1 : 0.7}]}
			>
				{riderDetails &&
					markers.map(({ id, latitude, longitude }, index) => (
						<Marker key={index} coordinate={{ latitude, longitude }} identifier={id}>
							{index === 0 && (
								<Image
									source={IMAGES.carTop}
									style={{ width: 25, height: 50 }}
								/>
							)}
						</Marker>
					))}
			</MapView>
			{isOnline && riderDetails ? (
				newRide ? (
					<PickUp
						reqId={currentReqId}
						details={riderDetails}
						onCancel={reset}
						markers={markers}
						ref={mapViewRef}
					/>
				) : (
					<NewRequest
						reqId={currentReqId}
						details={riderDetails}
						onDecline={reset}
						onAccept={acceptRequest}
						markers={markers}
						ref={mapViewRef}
					/>
				)
			) : (
				<Block style={styles.btnContainer}>
					<Block style={styles.statusContainer}>
						<Block style={styles.profileBtn}>
							<Block
								height={20}
								width={20}
								style={{
									backgroundColor: isOnline
										? COLOURS.ONLINE_ON
										: COLOURS.ONLINE_OFF,
									borderRadius: 10,
								}}
							/>
						</Block>
						<Block style={styles.incomeStatus}>
							<Text style={styles.incomeText}>{"£107.19"}</Text>
						</Block>
						<TouchableOpacity
							activeOpacity={0.7}
							style={styles.profileBtn}
							onPress={() => props.navigation.navigate("Profile")}
						>
							<Image
								source={oscar}
								style={{
									width: 40,
									height: 40,
									borderRadius: 20,
								}}
							/>
						</TouchableOpacity>
					</Block>
					<TouchableOpacity
						activeOpacity={0.7}
						onPress={() => setOnlineStatus(!isOnline)}
						style={[
							styles.onlineBtn,
							{
								backgroundColor: isOnline
									? COLOURS.ONLINE_ON
									: COLOURS.ONLINE_OFF,
							},
						]}
					>
						<Text style={styles.onlineBtnText}>
							{isOnline ? "go\noffline" : "go\nonline"}
						</Text>
					</TouchableOpacity>
				</Block>
			)}
		</Block>
	);
};

export default Dashboard;
