import React from "react";
import PropTypes from 'prop-types';
import Modal from "react-native-modal";
import { Block, Button, Text } from "galio-framework";
import { HEIGHT, WIDTH } from "../Ride/styles";
import { COLOURS } from "../../constants/Theme";

const DropoffModal = ({ id, showModal, placeName, defer, confirm }) => {
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
						Confirm Dropoff
					</Text>
					<Text h4 center color={COLOURS.HEADING}>
						@ {placeName}
					</Text>
				</Block>
				<Block style={{flexDirection: "row"}}>
					<Button
						style={{ height: 50, width: WIDTH * 0.3, borderRadius: 10 }}
						color={COLOURS.PRIMARY}
						lowercase
						onPress={() => confirm(id)}
					>
						<Text color={COLOURS.WHITE} h5>
							Yes
						</Text>
					</Button>
					<Button
						style={{ height: 50, width: WIDTH * 0.3, borderRadius: 10 }}
						color={COLOURS.SECONDARY}
						lowercase
						onPress={defer}
					>
						<Text color={COLOURS.WHITE} h5>
							Not yet
						</Text>
					</Button>
				</Block>
			</Block>
		</Modal>
	);
}

DropoffModal.propTypes = {
	showModal: PropTypes.bool.isRequired,
	placeName: PropTypes.string.isRequired,
	defer: PropTypes.func.isRequired,
	confirm: PropTypes.func.isRequired
}

export default DropoffModal;
