import React from 'react'
import {StyleSheet, Dimensions} from "react-native";
import { COLOURS } from "../../constants/Theme";

const {width: WIDTH} = Dimensions.get("window"); //Max Width of phone screen
const {height: HEIGHT} = Dimensions.get("window"); //Max Height of phone screen

export default (styles = StyleSheet.create({
	signInContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "flex-start",
		backgroundColor: COLOURS.WHITE,
		paddingHorizontal: 20,
		paddingTop: 100
	},
	signInHeader: {
		color: COLOURS.BLACK,
		fontFamily: "Lato-Bold",
		paddingBottom: 30,
	},
	input: {
		width: WIDTH * 0.7,
		height: 44,
		borderWidth: 1,
		borderColor: "black",
		marginTop: 5
	},
	error: {
		width: WIDTH * 0.7,
		color: COLOURS.ERROR,
		fontSize: 16,
		fontWeight: "bold"
	},
	loginBtn: {
		borderRadius: 50,
		height: 60,
		width: 200
	},
	text: {
		fontFamily: "Lato-Regular",
		fontSize: 20,
	},
	link: {
		paddingTop: 50,
	}
}));
