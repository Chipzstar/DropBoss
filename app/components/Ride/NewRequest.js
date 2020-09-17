import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Block, Button, Text } from "galio-framework";
import PropTypes from "prop-types";
import { COLOURS } from "../../constants/Theme";
import DashIcons from "../DashIcons";
import styles from "./styles";

const NewRequest = ({ reqId, details, onDecline, onAccept }) => {
	return (
		<View style={styles.container}>
			<Button
				color={COLOURS.WHITE}
				style={styles.declineBtn}
				onPress={() => onDecline(reqId)}
			>
				<DashIcons
					style={{ marginRight: 10 }}
					name={"close"}
					size={15}
					color={COLOURS.TEXT}
				/>
				<Text size={18} color={COLOURS.TEXT}>
					decline
				</Text>
			</Button>
			<Block style={styles.rideContainer}>
				<Block style={styles.addressContainer}>
					<Text
						color={COLOURS.HEADING}
						size={36}
						style={{ fontFamily: "Lato-Bold", paddingBottom: 10 }}
					>
						3 min . 1.4 mi
					</Text>
					<Text
						color={COLOURS.HEADING}
						size={18}
						style={{ fontFamily: "Lato-Regular" }}
					>
						{details.source["name"]}
					</Text>
				</Block>
				<TouchableOpacity
					activeOpacity={0.7}
					style={styles.acceptBtn}
					onPress={() => onAccept(reqId)}
				>
					<Text
						size={24}
						color={COLOURS.WHITE}
						style={{ fontFamily: "Roboto" }}
					>
						Accept
					</Text>
				</TouchableOpacity>
			</Block>
		</View>
	);
};

NewRequest.propTypes = {
	reqId: PropTypes.string.isRequired,
	details: PropTypes.object.isRequired,
	onDecline: PropTypes.func.isRequired,
	onAccept: PropTypes.func.isRequired
};

export default NewRequest;
