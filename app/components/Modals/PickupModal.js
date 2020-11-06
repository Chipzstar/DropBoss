import React from "react";
import PropTypes from "prop-types";
import Modal from "react-native-modal";
import { Text, Button, Block } from "galio-framework";
import { WIDTH, HEIGHT } from "../Ride/styles";
import { useDispatch, useSelector } from "react-redux";
import { RIDE_STATUS } from "../../store/actionTypes";
import { COLOURS } from "../../constants/Theme";

const PickupModal = ({ address, showModal, id, cancelTrip, confirmPickup }) => {
	const dispatch = useDispatch();
	const { details } = useSelector(state => state.dropOff)
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
						@ {address}
					</Text>
				</Block>
				<Block style={{flexDirection: "row"}}>
					<Button
						style={{ height: 50, width: WIDTH * 0.3, borderRadius: 10 }}
						color={COLOURS.PRIMARY}
						uppercase
						onPress={() => confirmPickup(details.coords)}
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
	address: PropTypes.string.isRequired,
	showModal: PropTypes.bool.isRequired,
	cancelTrip: PropTypes.func.isRequired,
	confirmPickup: PropTypes.func.isRequired,
};

export default PickupModal;
