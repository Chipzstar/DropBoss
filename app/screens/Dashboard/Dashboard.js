import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, Alert, Image } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { GOOGLE_MAPS_DIRECTIONS_API_KEY } from "@env";
import { StatusBar } from "expo-status-bar";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { Block, Text } from "galio-framework";
import * as Location from "expo-location";
//firebase
import firebase from "@react-native-firebase/app";
import "@react-native-firebase/database";
import "@react-native-firebase/messaging";
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
import { connect, markRideAccepted, updateUserCoordinates } from "../../config/Fire";
import { createPickupInfo } from "../../store/actions/pickUp";

const Dashboard = props => {
	//redux
	const pickUp = useSelector(state => state.pickUp);
	const dropOff = useSelector(state => state.dropOff);
	const dispatch = useDispatch();

	const [isOnline, setOnlineStatus] = useState(false);
	const [coords, setCoords] = useState({ latitude: 0, longitude: 0, latitudeDelta: 0.005, longitudeDelta: 0.005 });
	const [markers, setMarkers] = useState([]);
	const [currentReqId, setCurrentReqId] = useState(pickUp.id);
	const [incomingReqs, updateIncoming] = useState([]);
	const [declinedReqs, updateDeclined] = useState([]);
	const [newRequest, setNewRequest] = useState(false);
	const [newRide, setNewRide] = useState(false); //changes when driver accepts a new ride request
	const [riderDetails, setRiderDetails] = useState(false);
	const [travelMetrics, setMetrics] = useState({ distance: 0, duration: 0 });

	//CONSTANTS & REFS
	const { user } = useContext(AuthContext);
	const requestRef = firebase.database().ref(`requests`);
	const mapViewRef = useRef(null);

	//VARIABLES
	let newRegion = false;

	const acceptRequest = useCallback(
		requestId => {
			markRideAccepted(`requests/${requestId}`, user.uid)
				.then(({ pickupCoordinate, sourcePlaceName, arrivalTime, firstname }) => {
					requestRef.off("child_added");
					dispatch(
						createPickupInfo({
							id: requestId,
							destination: pickupCoordinate,
							placeName: sourcePlaceName,
							arrivalTime,
							riderInfo: {
								riderName: firstname,
								rating: 0,
							},
						})
					);
					console.log("ACCEPTED");
					setNewRide(true);
				})
				.catch(err => Alert.alert("ERROR", err.message));
		},
		[newRide]
	);

	const reset = useCallback(
		(reqId, type) => {
			setNewRequest(false);
			setRiderDetails(false);
			updateIncoming(prevState => {
				prevState.shift();
				return prevState;
			});
			setMarkers(prevState => {
				prevState.pop(); // removes element at front of STACK
				return prevState;
			});
			updateDeclined(prevState => {
				prevState.push(reqId);
				return [...prevState];
			});
			if (type === "CANCEL") {
				console.log("CANCELLED");
				setNewRide(false);
			} else {
				console.log("DECLINED");
			}
			return null;
		},
		[declinedReqs]
	);

	function updateMarkers({ latitude, longitude }) {
		setMarkers(prevState => {
			prevState.splice(0, 1, { id: "home", latitude, longitude });
			console.log("updated markers:", prevState);
			return [...prevState];
		});
	}

	function updateRegion() {
		newRegion = true;
	}

	/**
	 * Re-render checker
	 */
	useEffect(() => {
		console.log("coords:", coords);
	});
	/**
	 * CONSTRUCTOR - used to get drivers current locations, and register device for
	 *  push notifications. WILL ONLY RUN ONCE!
	 */
	useEffect(() => {
		console.log("PickUp state:", pickUp);
		(async () => {
			await UserPermissions.getLocationPermission();
			//retrieve driver's current location
			let {
				coords: { latitude, longitude },
			} = await Location.getCurrentPositionAsync({
				accuracy: Location.Accuracy.BestForNavigation,
				enableHighAccuracy: true,
				timeout: 20000,
				maximumAge: 2000,
			});
			//set driver's current location
			setCoords(prevState => {
				let { latitudeDelta, longitudeDelta } = prevState;
				return {
					latitude: 51.5447594,
					latitudeDelta: 0.004999828111856175,
					longitude: 0.1603327,
					longitudeDelta: 0.0054747238755226135,
				};
			});
			//update initial marker to represent driver's current location
			setMarkers(prevState => {
				prevState.splice(0, 1, { id: "home", latitude, longitude });
				console.log("updated markers", prevState);
				return prevState;
			});
			//get device/fcm push notification token
			await UserPermissions.registerPushNotificationsAsync(user);
			//update user coordinates on database
			await updateUserCoordinates(user, { latitude, longitude });
		})();
	}, []);

	/**
	 * Lifecycle method to handle online status changes
	 */
	useEffect(() => {
		(async () => {
			if (isOnline) {
				await connect();
				//init firebase database event listener
				setTimeout(
					() =>
						requestRef
							.orderByKey()
							.limitToLast(1)
							.on(
								"child_added",
								snapshot => {
									updateIncoming(prevState => {
										console.log("initial queue:", prevState);
										prevState.push(snapshot.key);
										console.log("updated queue:", prevState);
										return prevState;
									});
									console.log("Key:", snapshot.key);
									if (
										snapshot.key !== undefined &&
										!declinedReqs.includes(snapshot.key) &&
										snapshot.val().isAccepted !== true
									) {
										setMarkers(prevState => {
											let coords = snapshot.val().pickupCoordinate;
											prevState.push({
												id: "pickup",
												latitude: coords[0],
												longitude: coords[1],
											});
											console.log("updated markers:", prevState);
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
				await firebase.messaging().unsubscribeFromTopic("ride_requests");
				console.log("unsubscribed from ride requests");
			}
		})();
	}, [isOnline, reset]);

	return (
		<Block style={{ ...StyleSheet.absoluteFillObject }}>
			<StatusBar hidden />
			<MapView
				ref={mapViewRef}
				provider={PROVIDER_GOOGLE}
				initialRegion={{
					latitude: 0,
					longitude: 0,
					latitudeDelta: 0.005,
					longitudeDelta: 0.005,
				}}
				region={{ ...coords }}
				onRegionChangeComplete={region => {
					if (newRegion) {
						console.log("NEW REGION SET!", region);
						setCoords({ ...region });
					}
				}}
				showsUserLocation={!(markers.length >= 1)}
				followUserLocation={!(markers.length > 1)}
				showsCompass={true}
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
						updateMarkers={updateMarkers}
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
						onAnimation={updateRegion}
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
