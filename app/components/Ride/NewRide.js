import React, { useContext, useEffect, useState } from "react";
import { ToastAndroid, TouchableOpacity, View } from "react-native";
import * as Location from "expo-location";
import PropTypes from "prop-types";
import { Block, Button, Input, Text } from "galio-framework";
//styles
import { COLOURS } from "../../constants/Theme";
import styles, { HEIGHT, WIDTH } from "./styles";
//assets
import DashIcons from "../DashIcons";
import call from "../../assets/images/btn_call.png";
//context
import AuthContext from "../../context/AuthContext";
//functions
import { updateArrivalTime, updateUserCoordinates } from "../../config/Fire";
import { useDispatch, useSelector } from "react-redux";
import EdgePadding from "../../helpers/EdgePadding";
import { updatePickupInfo } from "../../store/actions/pickUp";
import { updateDropoffInfo } from "../../store/actions/dropOff";
//firebase
import iid from "@react-native-firebase/iid";
import axios from "axios";

const NewRide = React.memo(
	React.forwardRef((props, ref) => {
		const dispatch = useDispatch();
		const { user } = useContext(AuthContext);
		const {
			rideStatus: { key, tripId },
			pickUp,
			dropOff,
		} = useSelector(state => state);
		const { onCancel, updateMarkers, markers } = props;
		const [message, setMessage] = useState("");
		let ids = markers
			.filter(marker => (key === 2 ? marker.id !== "pickup" : marker.id !== "dropoff"))
			.map(marker => marker.id);

		useEffect(() => {
			const interval = setInterval(async () => {
				let { coords } = await Location.getCurrentPositionAsync({
					accuracy: Location.Accuracy.BestForNavigation,
					enableHighAccuracy: true,
					timeout: 20000,
					maximumAge: 2000,
				});
				console.log("COORDS:", coords.latitude, coords.longitude);
				updateMarkers(coords);
				await updateUserCoordinates(user, coords);
			}, 20 * 1000);
			return () => {
				key === 2
					? dispatch(updateDropoffInfo({ markers: markers.slice(0, 2) }))
					: key === 1
					? dispatch(updatePickupInfo({ markers: markers.slice(0, 2) }))
					: null;
				clearInterval(interval);
			};
		}, []);

		useEffect(() => {
			//console.count("markers change");
			const timeout = setTimeout(() => {
				ref["current"].fitToSuppliedMarkers(ids, {
					edgePadding: EdgePadding,
					animated: true,
				});
			}, 1000);
			return () => clearTimeout(timeout);
		}, [markers]);

		useEffect(() => {
			(async () => {
				let arrivalTime = await updateArrivalTime(user, tripId, pickUp.metrics.duration);
				if (key === 1)
					dispatch(
						updatePickupInfo({
							details: {
								...pickUp.details,
								arrivalTime,
							},
						})
					);
			})();
		}, [pickUp.metrics]);

		useEffect(() => {
			(async () => {
				let arrivalTime = await updateArrivalTime(user, tripId, dropOff.metrics.duration);
				if (key === 2)
					dispatch(
						updateDropoffInfo({
							details: {
								...dropOff.details,
								arrivalTime,
							},
						})
					);
			})();
		}, [dropOff.metrics]);

		async function sendMessage() {
			console.log("MESSAGE:", message);
			const url = "https://europe-west2-ridesdash-13b8a.cloudfunctions.net/sendPickupMessage";
			const id = await iid().get();
			console.log("ID", id);
			try {
				await axios.post(
					url,
					{ data: { message, riderId: pickUp.riderInfo.id, driverId: user.uid} },
					{
						headers: {
							"Content-Type": "application/json; charset=utf-8"
						},
					}
				);
				ToastAndroid.showWithGravityAndOffset(
					"Message Sent",
					ToastAndroid.LONG,
					ToastAndroid.BOTTOM,
					0,
					100
				);
			} catch (e) {
				console.log({ Error: e });
			}
			/*firebase
				.functions().on("sendMessage")({ payload })
				.then(res => console.log(res))
				.catch(err => console.error(err));*/
		}

		const dropoffView = (
			<View style={styles.dropOffContainer}>
				<Block style={styles.rideContainer}>
					<Block style={styles.dropoffAddressContainer}>
						<Block
							style={{
								flex: 0.4,
								justifyContent: "center",
							}}
						>
							<Text
								color={COLOURS.HEADING}
								size={34}
								style={{ fontFamily: "Lato-Bold", paddingBottom: 10 }}
							>
								{`${Math.round(dropOff.metrics.duration)} min . ${Math.round(
									dropOff.metrics.distance
								)} km`}
							</Text>
						</Block>
						<Block style={{ flex: 0.6 }}>
							<Text style={styles.subText}>{dropOff.details.arrivalTime}</Text>
							<Text style={styles.subText}>{dropOff.details["destAddress"]}</Text>
							<Text style={styles.subText}>dropping off {dropOff.riderInfo.riderName}</Text>
						</Block>
					</Block>
				</Block>
			</View>
		);
		const pickupView = (
			<View style={styles.pickUpContainer}>
				<Button color={COLOURS.WHITE} style={styles.declineBtn} onPress={() => onCancel(tripId, "CANCEL")}>
					<DashIcons style={{ marginRight: 10 }} name={"close"} size={15} color={COLOURS.TEXT} />
					<Text size={18} color={COLOURS.TEXT}>
						end ride
					</Text>
				</Button>
				<Block style={styles.rideContainer}>
					<Block style={styles.pickupAddressContainer}>
						<Text color={COLOURS.HEADING} size={34} style={{ fontFamily: "Lato-Bold", paddingBottom: 10 }}>
							{`${Math.round(pickUp.metrics.duration)} min . ${Math.round(pickUp.metrics.distance)} km`}
						</Text>
						<Block
							style={{
								display: "flex",
								justifyContent: "flex-end",
							}}
						>
							<Text style={styles.subText}>{pickUp.details.arrivalTime}</Text>
							<Text style={styles.subText}>{pickUp.details["sourceAddress"]}</Text>
						</Block>
					</Block>
					<Block style={styles.contactContainer}>
						<Input
							bgColor={COLOURS.MSG_FIELD}
							style={{ height: HEIGHT * 0.075, width: WIDTH * 0.75 }}
							placeholder='send a message...'
							value={message}
							onChangeText={text => setMessage(text)}
							onSubmitEditing={() => sendMessage()}
						/>
						<TouchableOpacity activeOpacity={0.5} onPress={() => sendMessage()}>
							<DashIcons name={"send"} size={30} />
						</TouchableOpacity>
					</Block>
				</Block>
			</View>
		);
		return key === 2 ? dropoffView : pickupView;
	}),
	(prevProps, nextProps) => {
		return prevProps.markers[0] !== nextProps.markers[0];
	}
);

NewRide.propTypes = {
	tripId: PropTypes.string.isRequired,
	onCancel: PropTypes.func.isRequired,
	markers: PropTypes.array.isRequired,
	updateMarkers: PropTypes.func.isRequired,
};

export default NewRide;
