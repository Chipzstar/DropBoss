import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, Alert, Image } from "react-native";
import { GOOGLE_MAPS_DIRECTIONS_API_KEY } from "@env";
import { StatusBar } from "expo-status-bar";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { Block, Text } from "galio-framework";
import * as Location from "expo-location";
import firebase from "@react-native-firebase/app";
import "@react-native-firebase/database";
//assets
import oscar from "../../assets/images/oscar.jpg";
//components
import NewRequest from "../../components/Ride/NewRequest";
import PickUp from "../../components/Ride/PickUp";
import AuthContext from "../../context/AuthContext";
//styles
import { COLOURS, IMAGES } from "../../constants/Theme";
import styles from "./styles";
//functions
import UserPermissions from "../../permissions/UserPermissions";
import { connect, disconnect, markRideAccepted } from "../../config/Fire";

const Dashboard = props => {
	const [coords, setInitialCoords] = useState({ latitude: 0, longitude: 0 });
	const [markers, updateMarkers] = useState([]);
	const [currentReqId, setCurrentReqId] = useState("");
	const [isOnline, setOnlineStatus] = useState(false);
	const [newRequest, setNewRequest] = useState(false);
	const [newRide, setNewRide] = useState(false); //changes when driver accepts a new ride request
	const [riderDetails, setRiderDetails] = useState(false);
	const [incomingReqs, updateIncoming] = useState([]);
	const [declinedReqs, updateDeclined] = useState([]);
	const [travelMetrics, setMetrics] = useState({});

	//CONSTANTS & REFS
	const { user } = useContext(AuthContext);
	const requestRef = firebase.database().ref(`requests`);
	const mapViewRef = useRef(null);

	const reset = useCallback(
		(reqId, type) => {
			setNewRequest(false);
			setRiderDetails(false);
			updateIncoming(prevState => {
				prevState.shift();
				return prevState;
			});
			updateMarkers(prevState => {
				prevState.pop(); // removes element at front of STACK
				return prevState;
			});
			updateDeclined(prevState => {
				prevState.push(reqId);
				return prevState;
			});
			if (type === "CANCEL") {
				console.log("CANCELLED");
				setNewRide(false);
			} else {
				console.log("DECLINED");
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
	 * CONSTRUCTOR - used to get drivers current locations, and register device for
	 *  push notifications
	 */
	useEffect(() => {
		setOnlineStatus(false)
		setNewRequest(false);
		setRiderDetails(false);
		updateMarkers(prevState => []);
		setMetrics({distance: 0, duration: 0});
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
		console.table(markers);
	}, [markers]);

	/**
	 * Lifecycle method to handle online status changes
	 */
	useEffect(() => {
		if (isOnline) {
			connect();
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
									lastReq = prevState.length ? prevState[0] : null;
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
										let { lat: latitude, lng: longitude } = snapshot.val().source[
											"geometry"
										].location;
										prevState.push({
											id: "pickup",
											latitude,
											longitude,
										});
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
			disconnect();
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
				followUserLocation={!markers.length}
				showsCompass={true}
				showsUserLocation={!markers.length}
				style={[styles.mapContainer, { flex: !riderDetails ? 1 : 0.7 }]}
			>
				{markers.map(({ id, latitude, longitude }, index) => (
					<Marker key={index} coordinate={{ latitude, longitude }} identifier={id}>
						{index === 0 && <Image source={IMAGES.carTop} style={{ width: 25, height: 50 }} />}
					</Marker>
				))}
				{riderDetails && (
					<MapViewDirections
						origin={coords}
						destination={{
							latitude: markers[markers.length - 1].latitude,
							longitude: markers[markers.length - 1].longitude,
						}}
						apikey={GOOGLE_MAPS_DIRECTIONS_API_KEY}
						strokeWidth={3}
						strokeColor={COLOURS.PRIMARY}
						onStart={params => {
							console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
						}}
						onReady={({ distance, duration }) => {
							console.log(`Distance: ${distance} km`);
							console.log(`Duration: ${duration} min.`);
							setMetrics({ distance, duration });
							setNewRequest(true);
						}}
						onError={errorMessage => console.error("ERROR:", errorMessage)}
					/>
				)}
			</MapView>
			{isOnline && newRequest ? (
				newRide ? (
					<PickUp
						reqId={currentReqId}
						details={riderDetails}
						onCancel={reset}
						markers={markers}
						metrics={travelMetrics}
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
						metrics={travelMetrics}
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
									backgroundColor: isOnline ? COLOURS.ONLINE_ON : COLOURS.ONLINE_OFF,
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
								backgroundColor: isOnline ? COLOURS.ONLINE_ON : COLOURS.ONLINE_OFF,
							},
						]}
					>
						<Text style={styles.onlineBtnText}>{isOnline ? "go\noffline" : "go\nonline"}</Text>
					</TouchableOpacity>
				</Block>
			)}
		</Block>
	);
};

export default Dashboard;
