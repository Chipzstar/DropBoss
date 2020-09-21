import firebase from "@react-native-firebase/app";
import "@react-native-firebase/database";
import "@react-native-firebase/messaging";

const topic = "ride_requests";

export const disconnect = () => {
	firebase
		.messaging()
		.unsubscribeFromTopic(topic)
		.then(() => {
			console.log("unsubscribed from ride requests");
			firebase
				.database()
				.goOffline()
				.then(() => console.log("disconnected from DB"));
		})
		.catch(err => console.error(err));
};

export const connect = () => {
	//subscribe to `ride_requests` topic messages
	firebase
		.database()
		.goOnline()
		.then(() => {
			console.log("connected to DB");
			firebase
				.messaging()
				.subscribeToTopic(topic)
				.then(() => {
					console.log("subscribed to ride requests");
				});
		})
		.catch(err => console.error(err));
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
