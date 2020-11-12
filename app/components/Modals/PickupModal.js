import React from "react";
import PropTypes from "prop-types";
import Modal from "react-native-modal";
import { Block, Button, Text } from "galio-framework";
import { HEIGHT, WIDTH } from "../Ride/styles";
import { useDispatch, useSelector } from "react-redux";
import { COLOURS } from "../../constants/Theme";

const PickupModal = ({ placeName, showModal, id, cancelTrip, confirm }) => {
	const dispatch = useDispatch();
	const { details: { coords } } = useSelector(state => state["dropOff"]);
	return (
		<Modal isVisible={showModal} style={{ alignItems: "center" }}>
			<Block
				style={{
					borderRadius: 30,
					elevation: 5,
					justifyContent: "space-around",
					alignItems: "center",
					height: HEIGHT * 0.5,
					width: WIDTH * 0.8,
					backgroundColor: COLOURS.WHITE,
				}}
			>
				<Block>
					<Text h3 center color={COLOURS.TEXT} bold>
						Confirm pickup
					</Text>
					<Text h4 center color={COLOURS.HEADING}>
						@ {placeName}
					</Text>
				</Block>
				<Block style={{flexDirection: "row"}}>
					<Button
						style={{ height: 50, width: WIDTH * 0.3, borderRadius: 10 }}
						color={COLOURS.PRIMARY}
						uppercase
						onPress={() => confirm(coords)}
					>
						<Text color={COLOURS.WHITE} h5>
							Confirm
						</Text>
					</Button>
					<Button
						style={{ height: 50, width: WIDTH * 0.3, borderRadius: 10 }}
						color={COLOURS.DISABLED}
						uppercase
						onPress={() => {
							console.log("Trip aborted")
							cancelTrip(id, "CANCEL")
						}}
					>
						<Text color={COLOURS.WHITE} h5>
							Abort
						</Text>
					</Button>
				</Block>
			</Block>
		</Modal>
	);
};

PickupModal.propTypes = {
	placeName: PropTypes.string.isRequired,
	showModal: PropTypes.bool.isRequired,
	cancelTrip: PropTypes.func.isRequired,
	confirm: PropTypes.func.isRequired,
};

export default PickupModal;
