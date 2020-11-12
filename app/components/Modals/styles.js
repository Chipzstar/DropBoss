import React from "react";
import {StyleSheet, Dimensions} from "react-native";
import { COLOURS } from "../../constants/Theme";

export const {width: WIDTH} = Dimensions.get("window"); //Max Width of phone screen
export const {height: HEIGHT} = Dimensions.get("window");

export default (styles = StyleSheet.create({
	reportText: {
		fontFamily: "Lato-Regular"
	},
	modalContainer:{
		borderRadius: 30,
		elevation: 5,
		paddingTop: 20,
		paddingBottom: 15,
		justifyContent: "space-around",
		alignItems: "center",
		height: HEIGHT * 0.55,
		width: WIDTH * 0.85,
		backgroundColor: COLOURS.WHITE,
	},
	reportContainer: {
		flex: 0.8,
		width: WIDTH * 0.7
	},
	journeyContainer: {
		flex: 1,
		justifyContent: "space-around"
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
	}
}));
