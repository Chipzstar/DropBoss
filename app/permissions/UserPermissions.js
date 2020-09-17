import React from "react";
import { ToastAndroid, Alert } from "react-native";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { updateUserFcmToken } from "../config/Fire";

class UserPermissions {
	getLocationPermission = async () => {
		const { status } = await Location.requestPermissionsAsync();
		if (Constants.platform.ios) {
			status !== "granted"
				? Alert.alert(
				"We need permission to access your device's location"
				)
				: console.log("Permission for LOCATION granted!");
		} else {
			status !== "granted"
				? ToastAndroid.show(
				"We need permission to access your device's location!",
				ToastAndroid.SHORT
				)
				: console.log("Permission for LOCATION granted!");
		}
	};
	registerPushNotificationsAsync = async (user) => {
		let token;
		if (Constants.isDevice) {
			const { status: existingStatus } = await Permissions.getAsync(
				Permissions.NOTIFICATIONS
			);
			let finalStatus = existingStatus;
			if (existingStatus !== "granted") {
				const { status } = await Permissions.askAsync(
					Permissions.NOTIFICATIONS
				);
				finalStatus = status;
			}
			if (finalStatus !== "granted") {
				alert("Failed to get push token for push notification!");
				return;
			}
			token = (await Notifications.getDevicePushTokenAsync()).data;
			await updateUserFcmToken(user, token);
			return token;
		} else {
			alert("Must use physical device for Push Notifications");
		}

		if (Platform.OS === "android") {
			await Notifications.setNotificationChannelAsync("default", {
				name: "default",
				importance: Notifications.AndroidImportance.MAX,
				vibrationPattern: [0, 250, 250, 250],
				lightColor: "#FF231F7C",
			});
		}
	};
}

export default new UserPermissions();