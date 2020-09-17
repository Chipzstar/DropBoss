import {StyleSheet, Dimensions} from "react-native";
import { COLOURS } from "../../constants/Theme";
import React from "react";

export const {width: WIDTH} = Dimensions.get("window"); //Max Width of phone screen
export const {height: HEIGHT} = Dimensions.get("window"); //Max Height of phone screen

export default (styles = StyleSheet.create({
	container: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		alignItems: "center",
		justifyContent: "space-between",
	},
	declineBtn: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		elevation: 5,
		width: 133,
		height: 52,
	},
	rideContainer: {
		backgroundColor: COLOURS.WHITE,
		display: "flex",
		alignItems: "center",
		justifyContent: "flex-end",
		width: WIDTH,
		height: HEIGHT * 0.3,
		paddingHorizontal: 20,
	},
	addressContainer: {
		display: "flex",
		backgroundColor: COLOURS.WHITE,
		width: WIDTH,
		height: HEIGHT * 0.2,
		alignItems: "flex-start",
		paddingHorizontal: 25,
		justifyContent: "center",
		elevation: 3
	},
	acceptBtn: {
		display: "flex",
		backgroundColor: COLOURS.PRIMARY,
		alignItems: "center",
		justifyContent: "center",
		width: WIDTH,
		height: HEIGHT * 0.1,
		elevation: 3,
	},
	contactContainer: {
		backgroundColor: COLOURS.WHITE,
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
		width: WIDTH,
		height: HEIGHT * 0.1,
		elevation: 3,
		padding: 10
	},
	subText: {
		color: COLOURS.HEADING,
		fontSize: 18,
		fontFamily: "Lato-Regular",
		paddingBottom: 10
	},
	callIcon: {
		width: 50,
		height: 50,
		borderWidth: 1,
		borderRadius: 25,
	},
}));
