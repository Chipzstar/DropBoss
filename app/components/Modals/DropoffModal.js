import React from "react";
import { useDispatch } from "react-redux";
import Modal from "react-native-modal";
import { Block, Button, Text } from "galio-framework";
import { HEIGHT, WIDTH } from "../Ride/styles";
import { COLOURS } from "../../constants/Theme";
import PropTypes from 'prop-types'
import styles from './styles';

const DropoffModal = ({ placeName, showModal, id, completeTrip }) => {
	const dispatch = useDispatch();
	return (
		<Modal isVisible={showModal} style={{ alignItems: "center" }}>
			<Block style={styles.modalContainer}>
				<Block>
					<Text h2 center color={COLOURS.HEADING} style={{ fontFamily: "Lato-Bold" }}>
						we've arrived!
					</Text>
				</Block>
				<Block style={styles.reportContainer}>
					<Block>
						<Block style={{ flexDirection: "row", justifyContent: "space-between" }}>
							<Text h3 color={COLOURS.HEADING} style={{ fontFamily: "Lato-Light" }}>
								fare:
							</Text>
							<Text h3 bold color={COLOURS.HEADING} style={styles.reportText}>
								£10.17
							</Text>
						</Block>
						<Block style={{ flexDirection: "row", justifyContent: "space-between" }}>
							<Text h3 color={COLOURS.HEADING} style={{ fontFamily: "Lato-Light" }}>
								distance:
							</Text>
							<Text h3 bold color={COLOURS.HEADING} style={styles.reportText}>
								6.7 mi
							</Text>
						</Block>
						<Block style={{ flexDirection: "row", justifyContent: "space-between" }}>
							<Text h3 color={COLOURS.HEADING} style={{ fontFamily: "Lato-Light" }}>
								duration:
							</Text>
							<Text h3 bold color={COLOURS.HEADING} style={styles.reportText}>
								15 min
							</Text>
						</Block>
					</Block>

					<Block style={styles.journeyContainer}>
						<Block style={{ flexDirection: "row", justifyContent: "space-between"}}>
							<Text h6 muted style={styles.reportText}>depart time:</Text>
							<Text h6 color={COLOURS.HEADING} style={styles.reportText}>10:28</Text>
						</Block>
						<Block style={{ flexDirection: "row", justifyContent: "space-between"  }}>
							<Text h6 muted style={styles.reportText}>arrival time:</Text>
							<Text h6 color={COLOURS.HEADING} style={styles.reportText}>10:43</Text>
						</Block>
						<Block style={{ flexDirection: "row", justifyContent: "space-between"  }}>
							<Text h6 muted style={styles.reportText}>drop off:</Text>
							<Text h6 color={COLOURS.HEADING} style={styles.reportText}>{placeName}</Text>
						</Block>
						<Block style={{ flexDirection: "row", justifyContent: "space-between"  }}>
							<Text h6 muted style={styles.reportText}>rider:</Text>
							<Text h6 bold color={COLOURS.HEADING} style={styles.reportText}>@chipzstar</Text>
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
							completeTrip(id)
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

DropoffModal.propTypes = {
	id: PropTypes.string.isRequired,
	showModal: PropTypes.bool.isRequired,
	placeName: PropTypes.string.isRequired,
	completeTrip: PropTypes.func.isRequired
}


export default DropoffModal;
