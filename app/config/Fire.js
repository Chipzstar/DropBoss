import firebase from "@react-native-firebase/app";
import '@react-native-firebase/database'

/*export const firebaseConfig = {
	apiKey: "AIzaSyB5wg9Gu6z7LDwvDB9BfV03VycPk-aRFZE",
	authDomain: "ridesdash-13b8a.firebaseapp.com",
	databaseURL: "https://ridesdash-13b8a.firebaseio.com",
	projectId: "ridesdash-13b8a",
	storageBucket: "ridesdash-13b8a.appspot.com",
	messagingSenderId: "222913989504",
	appId: "1:222913989504:web:b832526fde3b167c498f65",
	measurementId: "G-XGS48CHHK2",
};*/

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

/*export default firebase.initializeApp(firebaseConfig);*/
