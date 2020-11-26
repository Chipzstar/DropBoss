import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import { theme } from "galio-framework";
import { COLOURS } from "../../constants/Theme";

export const { width: WIDTH } = Dimensions.get("window"); //Max Width of phone screen
export const { height: HEIGHT } = Dimensions.get("window"); //Max Height of phone screen

export default styles = StyleSheet.create({
	container: {
		backgroundColor: COLOURS.WHITE,
		flex: 1,
		paddingVertical: theme.SIZES.BASE * 2,
		justifyContent: "flex-start"
	},
	header: {
		flex: 0.2,
		alignItems: "center",
		width: WIDTH,
		paddingTop: theme.SIZES.BASE,
		paddingHorizontal: theme.SIZES.BASE
	},
	avatar: {
		height: theme.SIZES.BASE * 4,
		width: theme.SIZES.BASE * 4,
		borderRadius: (theme.SIZES.BASE * 4) / 2,
	},
	icon: {
		backgroundColor: COLOURS.AVATAR_EDIT,
		position: 'absolute',
		display: 'flex',
		justifyContent: "center",
		alignItems: "center",
		right: 0,
		bottom: 0,
		height: theme.SIZES.BASE * 1.5,
		width: theme.SIZES.BASE * 1.5,
		borderRadius: 20
	},
	input: {
		height: 44,
		marginBottom: 5,
		fontFamily: "Lato-Regular",
		color: COLOURS.TEXT,
		fontWeight: "bold"
	},
	inputLine: {
		borderStyle: "solid",
		borderTopWidth: 0,
		borderRightWidth: 0,
		borderLeftWidth: 0,
		borderBottomWidth: 1,
	},
	backBtn: {
		position: "absolute",
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		alignSelf: "flex-start",
		top: 30,
		left: 20,
		paddingRight: 2,
		height: 42,
		width: 42,
		borderRadius: 21,
	},
	label:{
		fontSize: 18,
		fontFamily: "Lato-Regular",
		color: COLOURS.DISABLED
	},
	text: {
		fontFamily: "Lato-Regular",
		fontSize: 20,
		color: COLOURS.WHITE
	},
});
