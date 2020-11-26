import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import { COLOURS } from "../../constants/Theme";

const { width: WIDTH } = Dimensions.get("window"); //Max Width of phone screen
const { height: HEIGHT } = Dimensions.get("window"); //Max Height of phone screen
const AVATAR_SIZE = 100;

export default styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "space-between",
	},
	wrapper: {
		backgroundColor: COLOURS.WHITE,
		flex: 1,
		width: "100%",
		alignItems: "center",
		elevation: 5,
		shadowOffset: { width: 1, height: 1 },
		shadowRadius: 2,
		shadowOpacity: 0.3,
		shadowColor: "rgba(0, 0, 0, 0.25)",
		paddingBottom: 40,
		paddingTop: HEIGHT * 0.1,
	},
	avatarContainer: {
		backgroundColor: COLOURS.WHITE,
		elevation: 7,
		shadowOffset: { width: 1, height: 1 },
		shadowRadius: 2,
		shadowOpacity: 0.3,
		shadowColor: "rgba(0, 0, 0, 0.25)",
		padding: 5,
		marginBottom: 10,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: AVATAR_SIZE + 10 / 2,
	},
	addAvatar: {
		opacity: 0.6,
		width: AVATAR_SIZE,
		height: AVATAR_SIZE,
		borderRadius: AVATAR_SIZE / 2
	},
	avatar: {
		width: AVATAR_SIZE,
		height: AVATAR_SIZE,
		borderRadius: AVATAR_SIZE / 2,
	},
	text: {
		lineHeight: 25,
		fontFamily: "Lato-Regular",
		color: COLOURS.TEXT,
		textAlign: "center",
	},
	backBtn: {
		backgroundColor: COLOURS.WHITE,
		elevation: 4,
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
		borderRadius: 21
	},
	editBtn: {
		backgroundColor: COLOURS.WHITE,
		elevation: 4,
		position: "absolute",
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		alignSelf: "flex-start",
		top: 30,
		right: 20,
		paddingRight: 2,
		height: 42,
		width: 42,
		borderRadius: 21,
	},
});
