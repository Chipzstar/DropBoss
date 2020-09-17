import {StyleSheet, Dimensions} from "react-native";
import {COLOURS} from "../../constants/Theme";

export const WIDTH = Dimensions.get("window").width;
export const HEIGHT = Dimensions.get("window").height;

const BTN_SIZE = 134;

export default (styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	btnContainer: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		alignItems: "center",
		justifyContent: "space-between",
	},
	onlineBtn: {
		position: "absolute",
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		alignSelf: "center",
		height: BTN_SIZE,
		width: BTN_SIZE,
		top: HEIGHT - BTN_SIZE * 1.5,
		borderRadius: BTN_SIZE / 2,
		elevation: 3
	},
	onlineBtnText: {
		textAlign: "center",
		fontFamily: "Roboto",
		fontWeight: "bold",
		fontSize: 24,
		color: COLOURS.WHITE,
	},
	statusContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		width: "100%",
		top: BTN_SIZE*0.5
	},
	incomeStatus: {
		backgroundColor: COLOURS.WHITE,
		elevation: 5,
		justifyContent: "center",
		alignItems: "center",
		alignSelf: "center",
		width: 100,
		height: 50,
		borderRadius: 25,
	},
	profileBtn: {
		backgroundColor: COLOURS.WHITE,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		elevation: 5,
		width: 50,
		height: 50,
		borderRadius: 25
	},
	incomeText: {
		fontSize: 18,
		textAlign: "center"
	},
}));
