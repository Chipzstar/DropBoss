import React from "react";
import AsyncStorage from "@react-native-community/async-storage";

export const getRideStatus = async (mode) => {
	try {
		return !!(await AsyncStorage.getItem(mode));
	} catch (e) {
		console.error(e);
	}
}

export const setPickUpMode = async () => {
	try {
		await AsyncStorage.setItem("PICK_UP", "true")
		console.log("Pickup Mode: ACTIVE")
	} catch (e) {
		console.error(e)
	}
}

export const setDropOffMode = async () => {
	try {
		await AsyncStorage.setItem("DROP_OFF", "true")
		console.log("Drop-off Mode: ACTIVE")
	} catch (e) {
		console.error(e)
	}
}


