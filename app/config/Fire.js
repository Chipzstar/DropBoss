import firebase from "@react-native-firebase/app";
import '@react-native-firebase/database'

export const disconnectDB = () => {
	firebase.database().goOffline();
	console.log("disconnected from DB");
};

export const connectDB = () => {
	firebase.database().goOnline();
	console.log("connected to DB");
};

export const updateUserFcmToken = (driver, fcmToken) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (driver) {
				await firebase.database().ref(`drivers/${driver.uid}`).update({
					fcmToken,
				});
				resolve();
			}
		} catch (err) {
			reject(err);
		}
	});
};

export const markRideAccepted = async (path, userId) => {
	return new Promise(async (resolve, reject) => {
		try {
			let rideRef = firebase.database().ref(path);
			let res = await rideRef.update({
				isAccepted: true,
				driverKey: userId,
			});
			resolve(res);
		} catch (e) {
			reject(e);
		}
	});
};
