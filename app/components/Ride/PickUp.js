import React, { useContext, useEffect, useState } from "react";
import { Image, View } from "react-native";
import * as Location from "expo-location";
import PropTypes from "prop-types";
import { Block, Button, Input, Text } from "galio-framework";
import { COLOURS } from "../../constants/Theme";
import DashIcons from "../DashIcons";
import styles, { HEIGHT, WIDTH } from "./styles";
import call from "../../assets/images/btn_call.png";
import EdgePadding from "../../helpers/EdgePadding";
import AuthContext from "../../context/AuthContext";
import { updateUserCoordinates } from "../../config/Fire";

const PickUp = React.memo(React.forwardRef(({ reqId, details, onCancel, markers, metrics, updateMarkers }, ref) => {
	const [message, setMessage] = useState("");
	const { user } = useContext(AuthContext);
	let ids = markers.map(marker => marker.id);

	useEffect(() => {
		setInterval(async () => {
			console.log("Last known location:", await Location.getLastKnownPositionAsync());
			let {coords} = await Location.getCurrentPositionAsync({
				accuracy: Location.Accuracy.BestForNavigation,
				enableHighAccuracy: true,
				timeout: 20000,
				maximumAge: 2000,
			});
			await updateUserCoordinates(user, coords)
			updateMarkers(coords);
		}, 20*1000)
		return clearInterval()
	}, []);

	useEffect(() => {
		//TODO - optimize
		setTimeout(
			() => {
				ref.current.fitToSuppliedMarkers(ids, {
					edgePadding: EdgePadding,
					animated: true
				})
			}, 100);
		return clearTimeout()
	}, [markers])

	return (
		<View style={styles.container}>
			<Button
				color={COLOURS.WHITE}
				style={styles.declineBtn}
				onPress={() => onCancel(reqId, "CANCEL")}
			>
				<DashIcons
					style={{ marginRight: 10 }}
					name={"close"}
					size={15}
					color={COLOURS.TEXT}
				/>
				<Text size={18} color={COLOURS.TEXT}>
					end ride
				</Text>
			</Button>
			<Block style={styles.rideContainer}>
				<Block style={styles.addressContainer}>
					<Text
						color={COLOURS.HEADING}
						size={34}
						style={{ fontFamily: "Lato-Bold", paddingBottom: 10 }}
					>
						{`${Math.round(metrics.duration)} min . ${Math.round(metrics.distance)} km`}
					</Text>
					<Block
						style={{
							display: "flex",
							justifyContent: "flex-end"
						}}
					>
						<Text style={styles.subText}>
							{details.arrivalTime}
						</Text>
						<Text style={styles.subText}>
							{details["sourceAddress"]}
						</Text>
					</Block>
				</Block>
				<Block style={styles.contactContainer}>
					<Input
						bgColor={COLOURS.MSG_FIELD}
						style={{ height: HEIGHT * 0.075, width: WIDTH * 0.7 }}
						placeholder='send a message...'
						value={message}
						onChangeText={(text) => setMessage(text)}
					/>
					<Image source={call} style={styles.callIcon} />
				</Block>
			</Block>
		</View>
	);
}));

PickUp.propTypes = {
	reqId: PropTypes.string.isRequired,
	details: PropTypes.object.isRequired,
	onCancel: PropTypes.func.isRequired,
	markers: PropTypes.array.isRequired,
	updateMarkers: PropTypes.func.isRequired,
	metrics: PropTypes.object.isRequired
};

export default PickUp;
