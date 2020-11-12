import React from "react";
import { useSelector } from "react-redux";
import Modal from "react-native-modal";
import { Block, Button, Text } from "galio-framework";
import { WIDTH } from "../Ride/styles";
import { COLOURS } from "../../constants/Theme";
import PropTypes from "prop-types";
import styles from "./styles";

const InvoiceModal = ({ placeName, showModal, id, completeTrip }) => {
	const { fare, distance, duration, departTime, arrivalTime, rider } = useSelector(state => state["rideInvoice"]);
	return (
		<Modal isVisible={showModal} style={{ alignItems: "center" }}>
			<Block style={styles.modalContainer}>
				<Block>
					<Text h3 center color={COLOURS.HEADING} style={{ fontFamily: "Lato-Bold" }}>
						we've arrived!
					</Text>
				</Block>
				<Block style={styles.reportContainer}>
					<Block>
						<Block style={styles.row}>
							<Text h3 color={COLOURS.HEADING} style={{ fontFamily: "Lato-Light" }}>
								fare:
							</Text>
							<Text h3 bold color={COLOURS.HEADING} style={styles.reportText}>
								{fare}
							</Text>
						</Block>
						<Block style={styles.row}>
							<Text h3 color={COLOURS.HEADING} style={{ fontFamily: "Lato-Light" }}>
								distance:
							</Text>
							<Text h3 bold color={COLOURS.HEADING} style={styles.reportText}>
								{`${Number.parseFloat(distance).toFixed(1)} km`}
							</Text>
						</Block>
						<Block style={styles.row}>
							<Text h3 color={COLOURS.HEADING} style={{ fontFamily: "Lato-Light" }}>
								duration:
							</Text>
							<Text h3 bold color={COLOURS.HEADING} style={styles.reportText}>
								{`${Number.parseFloat(duration).toFixed(1)} mins`}
							</Text>
						</Block>
					</Block>

					<Block style={styles.journeyContainer}>
						<Block style={styles.row}>
							<Text h6 muted style={styles.reportText}>
								depart time:
							</Text>
							<Text h6 color={COLOURS.HEADING} style={styles.reportText}>
								{departTime}
							</Text>
						</Block>
						<Block style={styles.row}>
							<Text h6 muted style={styles.reportText}>
								arrival time:
							</Text>
							<Text h6 color={COLOURS.HEADING} style={styles.reportText}>
								{arrivalTime}
							</Text>
						</Block>
						<Block style={styles.row}>
							<Text h6 muted style={styles.reportText}>
								drop off:
							</Text>
							<Text h6 color={COLOURS.HEADING} style={styles.reportText}>
								{placeName}
							</Text>
						</Block>
						<Block style={styles.row}>
							<Text h6 muted style={styles.reportText}>
								rider:
							</Text>
							<Text h6 bold color={COLOURS.HEADING} style={styles.reportText}>
								{rider}
							</Text>
						</Block>
					</Block>
				</Block>
				<Block style={{ flexDirection: "row" }}>
					<Button
						style={{ height: 50, width: WIDTH * 0.7, borderRadius: 10 }}
						color={COLOURS.PRIMARY}
						lowercase
						onPress={() => {
							console.log("Trip completed");
							completeTrip(id);
						}}
					>
						<Text color={COLOURS.WHITE} h5>
							continue
						</Text>
					</Button>
				</Block>
			</Block>
		</Modal>
	);
};

InvoiceModal.propTypes = {
	showModal: PropTypes.bool.isRequired,
	placeName: PropTypes.string.isRequired,
	completeTrip: PropTypes.func.isRequired,
};

export default InvoiceModal;
