import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import { COLOURS } from "../../constants/Theme";

export const { width: WIDTH } = Dimensions.get("window"); //Max Width of phone screen
export const { height: HEIGHT } = Dimensions.get("window"); //Max Height of phone screen

export default styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	signInContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: COLOURS.WHITE,
		paddingHorizontal: 20,
		paddingTop: 100,
	},
	signInHeader: {
		color: COLOURS.BLACK,
		fontFamily: "Lato-Bold",
		paddingBottom: 30,
	},
	input: {
		width: WIDTH * 0.7,
		height: 44,
		marginTop: 5,
		fontFamily: "Lato-Regular",
	},
	inputLine: {
		borderStyle: "solid",
		borderTopWidth: 0,
		borderRightWidth: 0,
		borderLeftWidth: 0,
		borderBottomWidth: 1,
	},
	error: {
		width: WIDTH * 0.7,
		color: COLOURS.ERROR,
		fontSize: 16,
		fontWeight: "bold",
	},
	loginBtn: {
		borderRadius: 50,
		height: 60,
		width: 200,
	},
	text: {
		fontFamily: "Lato-Regular",
		fontSize: 20,
	},
	link: {
		paddingTop: 50,
	},
});
