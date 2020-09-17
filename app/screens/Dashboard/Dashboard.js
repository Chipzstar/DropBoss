import React, { useCallback, useContext, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, Alert, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { Block, Text } from "galio-framework";
import * as Location from "expo-location";
import firebase from "firebase/app";
import "firebase/database";
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
	const [coords, setCoords] = useState({ latitude: 0, longitude: 0 });
	const [currentReqId, setCurrentReqId] = useState("");
	const [isOnline, setOnlineStatus] = useState(false);
	const [newRide, setNewRide] = useState(false); //changes when driver accepts a new ride request
	const [riderDetails, setRiderDetails] = useState(false);
	const [incomingReqs, updateIncoming] = useState([]);
	const [declinedReqs, updateDeclined] = useState([]);

	const { user } = useContext(AuthContext);
	const requestRef = firebase.database().ref(`requests`);

	const declineRequest = useCallback(
		reqId => {
			console.log("DECLINED");
			setRiderDetails(false);
			updateIncoming(prevState => {
				prevState.shift();
				return prevState;
			});
			updateDeclined(prevState => {
				prevState.push(reqId);
				return prevState;
			});
		},
		[incomingReqs, declinedReqs]
	);

	const cancelRide = useCallback(
		reqId => {
			console.log("CANCELLED");
			setRiderDetails(false);
			updateIncoming(prevState => {
				prevState.shift();
				return prevState;
			});
			updateDeclined(prevState => {
				prevState.push(reqId);
				return prevState;
			});
			setNewRide(false);
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

	useEffect(() => {
		if (isOnline) {
			connectDB();
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
									setCurrentReqId(snapshot.key);
									setRiderDetails(snapshot.val());
								}
							},
							err => Alert.alert("Error:", err)
						),
				1500
			);
		} else {
			//end firebase db listener
			requestRef.off("child_added");
			disconnectDB();
		}
		return () => clearTimeout();
	}, [isOnline, declineRequest, cancelRide]);

	useEffect(() => {
		setRiderDetails(false);
		(async () => {
			await UserPermissions.getLocationPermission();
			let { coords } = await Location.getCurrentPositionAsync({
				accuracy: Location.Accuracy.BestForNavigation,
				enableHighAccuracy: true,
				timeout: 20000,
				maximumAge: 2000,
			});
			setCoords({
				latitude: coords.latitude,
				longitude: coords.longitude,
			});
			let token = await UserPermissions.registerPushNotificationsAsync(user);
			console.log("fcmToken:",token);
		})();
	}, []);

	return (
		<Block style={{ ...StyleSheet.absoluteFillObject }}>
			<StatusBar hidden />
			<MapView
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
				showsCompass={true}
				showsUserLocation={true}
				style={styles.container}
			/>
			{isOnline && riderDetails ? (
				newRide ? (
					<PickUp
						reqId={currentReqId}
						details={riderDetails}
						onCancel={cancelRide}
					/>
				) : (
					<NewRequest
						reqId={currentReqId}
						details={riderDetails}
						onDecline={declineRequest}
						onAccept={acceptRequest}
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
