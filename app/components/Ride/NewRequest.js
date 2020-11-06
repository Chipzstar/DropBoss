import React, { useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import { Block, Button, Text } from "galio-framework";
import PropTypes from "prop-types";
import { COLOURS } from "../../constants/Theme";
import DashIcons from "../DashIcons";
import styles from "./styles";
import EdgePadding from "../../helpers/EdgePadding";

const NewRequest = React.memo(
	React.forwardRef(({ reqId, details, onDecline, onAccept, markers, metrics, onAnimation }, ref) => {
		/**
		 * CONSTRUCTOR
		 */
		useEffect(() => {
			let ids = markers.map(marker => marker.id);
			setTimeout(() => {
				ref["current"].fitToSuppliedMarkers(ids, {
					edgePadding: EdgePadding,
					animated: true
				});
				onAnimation();
			}, 1000);
			return () => clearTimeout();
		}, []);

		return (
			<View style={styles.pickUpContainer}>
				<Button color={COLOURS.WHITE} style={styles.declineBtn} onPress={() => onDecline(reqId, "DECLINE")}>
					<DashIcons style={{ marginRight: 10 }} name={"close"} size={15} color={COLOURS.TEXT} />
					<Text size={18} color={COLOURS.TEXT}>
						decline
					</Text>
				</Button>
				<Block style={styles.rideContainer}>
					<Block style={styles.pickupAddressContainer}>
						<Text
							color={COLOURS.HEADING}
							size={36}
							style={{
								fontFamily: "Lato-Bold",
								paddingBottom: 10,
							}}
						>
							{`${Math.round(metrics.duration)} min . ${Math.round(metrics.distance)} km`}
						</Text>
						<Text color={COLOURS.HEADING} size={18} style={{ fontFamily: "Lato-Regular" }}>
							{details.sourceAddress}
						</Text>
					</Block>
					<TouchableOpacity activeOpacity={0.7} style={styles.acceptBtn} onPress={() => onAccept(reqId)}>
						<Text size={24} color={COLOURS.WHITE} style={{ fontFamily: "Roboto" }}>
							Accept
						</Text>
					</TouchableOpacity>
				</Block>
			</View>
		);
	})
);

NewRequest.propTypes = {
	reqId: PropTypes.string.isRequired,
	details: PropTypes.object.isRequired,
	onDecline: PropTypes.func.isRequired,
	onAccept: PropTypes.func.isRequired,
	markers: PropTypes.array.isRequired,
	metrics: PropTypes.object.isRequired,
	onAnimation: PropTypes.func.isRequired
};

export default NewRequest;
