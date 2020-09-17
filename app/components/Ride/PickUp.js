import React from "react";
import { Image, View } from "react-native";
import PropTypes from "prop-types";
import { Block, Button, Input, Text } from "galio-framework";
import { COLOURS } from "../../constants/Theme";
import DashIcons from "../DashIcons";
import styles, { HEIGHT, WIDTH } from "./styles";
import call from "../../assets/images/btn_call.png";

const PickUp = ({ reqId, details, onCancel }) => {
	return (
		<View style={styles.container}>
			<Button
				color={COLOURS.WHITE}
				style={styles.declineBtn}
				onPress={() => onCancel(reqId)}
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
						3 min . 1.4 mi
					</Text>
					<Block
						style={{
							display: "flex",
							justifyContent: "flex-end",
						}}
					>
						<Text style={styles.subText}>
							{details["arrivalTime"]}
						</Text>
						<Text style={styles.subText}>
							{details.source["name"]}
						</Text>
					</Block>
				</Block>
				<Block style={styles.contactContainer}>
					<Input
						bgColor={COLOURS.MSG_FIELD}
						style={{ height: HEIGHT * 0.075, width: WIDTH * 0.7 }}
						placeholder='send a message...'
					/>
					<Image source={call} style={styles.callIcon} />
				</Block>
			</Block>
		</View>
	);
};

PickUp.propTypes = {
	reqId: PropTypes.string.isRequired,
	details: PropTypes.object.isRequired,
	onCancel: PropTypes.func.isRequired,
};

export default PickUp;