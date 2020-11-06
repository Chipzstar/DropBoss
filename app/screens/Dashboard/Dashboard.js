import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Alert, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { GOOGLE_MAPS_DIRECTIONS_API_KEY } from "@env";
import { StatusBar } from "expo-status-bar";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { Block, Text } from "galio-framework";
import * as Location from "expo-location";
//firebase
import firebase from "@react-native-firebase/app";
import "@react-native-firebase/database";
import "@react-native-firebase/messaging";
import { connect, markRideAccepted, updateUserCoordinates } from "../../config/Fire";
//assets
import oscar from "../../assets/images/oscar.jpg";
//components
import NewRequest from "../../components/Ride/NewRequest";
import NewRide from "../../components/Ride/NewRide";
import PickupModal from "../../components/Modals/PickupModal";
import AuthContext from "../../context/AuthContext";
//styles
import { COLOURS, IMAGES } from "../../constants/Theme";
import styles from "./styles";
//redux
import { updatePickupInfo } from "../../store/actions/pickUp";
import { updateDropoffInfo } from "../../store/actions/dropOff";
import { CLEAR_RIDE_STATUS, SET_ONLINE_STATUS } from "../../store/reducers";
import { REMOVE_DROPOFF, REMOVE_PICKUP, RIDE_STATUS } from "../../store/actionTypes";
import DropoffModal from "../../components/Modals/DropoffModal";

const Dashboard = props => {
	//redux
	const { pickUp, rideStatus, dropOff, onlineStatus } = useSelector(state =>  state);
	const dispatch = useDispatch();

	const [isOnline, setOnlineStatus] = useState(onlineStatus);
	const [coords, setCoords] = useState({ latitude: 0, longitude: 0, latitudeDelta: 0.005, longitudeDelta: 0.005 });
	const [markers, setMarkers] = useState(rideStatus.key === 2 ? dropOff.markers : pickUp.markers);
	const [currentTripId, setCurrentTripId] = useState(rideStatus.tripId);
	const [incomingReqs, updateIncoming] = useState([]);
	const [declinedReqs, updateDeclined] = useState([]);
	const [newRequest, setNewRequest] = useState(false);
	const [newRide, setNewRide] = useState(Boolean(rideStatus.tripId)); //changes when driver accepts a new ride request
	const [rideDetails, setRideDetails] = useState(rideStatus.key === 2 ? dropOff.details : pickUp.details);
	const [travelMetrics, setMetrics] = useState({ distance: 0, duration: 0 });
	const [isSourceVisible, setSourceModalVisible] = useState(false);
	const [isDestVisible, setDestModalVisible] = useState(false);

	//CONSTANTS & REFS
	const { user } = useContext(AuthContext);
	const requestRef = firebase.database().ref("trips");
	const mapViewRef = useRef(null);

	//VARIABLES
	let newRegion = false;

	const acceptRequest = useCallback(
		tripId => {
			markRideAccepted(`trips/${tripId}`, user.uid)
				.then(
					({
						pickupCoordinate,
						destinationCoordinate,
						sourcePlaceName,
						sourceAddress,
						destPlaceName,
						destAddress,
						arrivalTime,
						firstname,
					}) => {
						requestRef.off("child_added");
						console.log("ACCEPTED");
						dispatch(
							updatePickupInfo({
								details: {
									coords: pickupCoordinate,
									sourceAddress,
									sourcePlaceName,
									arrivalTime,
								},
								riderInfo: {
									riderName: firstname,
									rating: 0,
								},
								markers: markers.filter(mkr => mkr.id !== "dropoff"),
							})
						);
						dispatch(
							updateDropoffInfo({
								details: {
									coords: destinationCoordinate,
									destAddress,
									destPlaceName,
								},
								riderInfo: {
									riderName: firstname,
									rating: 0,
								},
								markers: markers.filter(mkr => mkr.id !== "pickup"),
							})
						);
						dispatch({ type: RIDE_STATUS.ON_PICKUP, id: tripId });
						setNewRide(true);
					}
				)
				.catch(err => Alert.alert("ERROR", err.message));
		},
		[newRide, markers, travelMetrics]
	);

	const reset = useCallback(
		(reqId, type) => {
			setSourceModalVisible(false);
			setNewRequest(false);
			setRideDetails(false);
			updateIncoming(prevState => {
				prevState.shift();
				return prevState;
			});
			setMarkers(prevState => []); //clear the contents of markers
			updateDeclined(prevState => {
				prevState.push(reqId);
				return [...prevState];
			});
			dispatch({ type: REMOVE_PICKUP });
			if (type === "CANCEL") {
				console.log("CANCELLED");
				dispatch(CLEAR_RIDE_STATUS);
				dispatch({ type: REMOVE_DROPOFF });
				setNewRide(false);
			} else {
				console.log("DECLINED");
			}
			return null;
		},
		[declinedReqs]
	);

	const confirm = useCallback(
		({ latitude, longitude }) => {
			setSourceModalVisible(false);
			dispatch({ type: RIDE_STATUS.ON_DROPOFF, id: currentTripId });
			updateRegion();
			setMarkers(prevState => {
				prevState.splice(1, 1, {
					id: "dropoff",
					latitude,
					longitude,
				});
				console.log("updated markers:", prevState);
				return prevState;
			});
		},
		[currentTripId]
	);

	const complete = useCallback((tripId) => {
		dispatch({ type: RIDE_STATUS.ON_COMPLETE, id: tripId });
	}, [])

	const updateMarkers = useCallback(
		({ latitude, longitude }) => {
			setMarkers(prevState => {
				prevState.splice(0, 1, { id: "current", latitude, longitude });
				console.log("updated markers:", prevState);
				return [...prevState];
			});
		},
		[markers]
	);

	function updateRegion() {
		newRegion = true;
	}

	/**
	 * Re-render checker
	 */
	useEffect(() => {
		//console.log("coords:", coords);
	});
	/**
	 * CONSTRUCTOR - used to get drivers current locations, and register device for
	 *  push notifications. WILL ONLY RUN ONCE!
	 */
	useEffect(() => {
		console.log("New ride:", newRide);
		(async () => {
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
			setCoords({
				...coords,
				latitude,
				longitude,
			});
			//update user coordinates on database
			await updateUserCoordinates(user, { latitude, longitude });
		})();
		return () => dispatch(SET_ONLINE_STATUS(isOnline));
	}, []);

	/**
	 * Lifecycle method to handle online status changes
	 */
	useEffect(() => {
		(async () => {
			//check user status is online
			if (isOnline) {
				//connect app client to firebase database
				await connect();
				//if there is currently NO ride active
				if (!newRide)
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
											!snapshot.val().tripAccepted
										) {
											Location.getLastKnownPositionAsync().then(
												({ coords: { latitude, longitude } }) => {
													//update initial marker to represent driver's current location
													setMarkers(prevState => {
														let [lat1, lng1] = snapshot.val().pickupCoordinate;
														let [lat2, lng2] = snapshot.val().destinationCoordinate;
														prevState.splice(0, 1, { id: "current", latitude, longitude });
														prevState.splice(1, 1, {
															id: "pickup",
															latitude: lat1,
															longitude: lng1,
														});
														prevState.splice(2, 1, {
															id: "dropoff",
															latitude: lat2,
															longitude: lng2,
														});
														console.log("updated markers:", prevState);
														return prevState;
													});
													setCurrentTripId(snapshot.key);
													setRideDetails(snapshot.val());
												}
											);
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
						console.log("NEW COORDS");
						setCoords({ ...region });
					}
				}}
				showsUserLocation={!(markers.length >= 1)}
				followUserLocation={!(markers.length > 1)}
				showsCompass={true}
				style={[styles.mapContainer, { flex: Boolean(rideDetails) ? 0.7 : 1 }]}
			>
				{/*TODO - customize markers for pickup and dropoff locations*/}
				{markers.map(({ id, latitude, longitude }, index) => (
					<Marker
						key={index}
						coordinate={{ latitude, longitude }}
						identifier={id}
						title={`${id} location`}
						description={
							index === 2
								? dropOff.details.destPlaceName
								: index === 1
								? pickUp.details.sourcePlaceName
								: null
						}
					>
						{index === 0 && <Image source={IMAGES.carTop} style={{ width: 25, height: 50 }} />}
						{index !== 0 && <Callout />}
					</Marker>
				))}
				{markers.length >= 2 && rideDetails && (
					<MapViewDirections
						origin={{ latitude: markers[0].latitude, longitude: markers[0].longitude }}
						destination={{ latitude: markers[1].latitude, longitude: markers[1].longitude }}
						apikey={GOOGLE_MAPS_DIRECTIONS_API_KEY}
						strokeWidth={5}
						strokeColor={COLOURS.PRIMARY}
						onStart={params => {
							console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
						}}
						onReady={({ distance, duration }) => {
							console.log(`Distance: ${distance} km`);
							console.log(`Duration: ${duration} min.`);
							if (rideStatus.key === 2) {
								dispatch(updateDropoffInfo({ metrics: { distance, duration } }));
								if (distance < 1 && dropOff.metrics.distance < 1 && newRide) setDestModalVisible(true);
							} else {
								dispatch(updatePickupInfo({ metrics: { distance, duration } }));
								if (distance < 1 && pickUp.metrics.distance < 1 && newRide) setSourceModalVisible(true);
							}
							setMetrics({ distance, duration });
							setNewRequest(true);
						}}
						onError={errorMessage => console.error("ERROR:", errorMessage)}
					/>
				)}
			</MapView>
			<PickupModal
				id={currentTripId}
				showModal={isSourceVisible}
				address={pickUp.details ? pickUp.details["sourcePlaceName"] : ""}
				cancelTrip={reset}
				confirmPickup={confirm}
			/>
			<DropoffModal
				id={currentTripId}
				showModal={isDestVisible}
				placeName={dropOff.details ? dropOff.details["destPlaceName"] : ""}
				completeTrip={complete}
			/>
			{isOnline && newRequest ? (
				newRide ? (
					<NewRide
						tripId={currentTripId}
						onCancel={reset}
						markers={markers}
						updateMarkers={updateMarkers}
						ref={mapViewRef}
					/>
				) : (
					<NewRequest
						reqId={currentTripId}
						details={rideDetails}
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
						onPress={() => {
							dispatch(SET_ONLINE_STATUS(!isOnline));
							setOnlineStatus(!isOnline)
						}}
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
