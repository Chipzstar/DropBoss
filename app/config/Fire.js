import moment from "moment";
import firebase from "@react-native-firebase/app";
import "@react-native-firebase/database";
import "@react-native-firebase/messaging";

const topic = "ride_requests";

export const disconnect = async () => {
	try {
		await firebase.messaging().unsubscribeFromTopic(topic);
		console.log("unsubscribed from ride requests");
		await firebase.database().goOffline();
		console.log("disconnected from DB");
		return true;
	} catch (err) {
		throw err;
	}
};

export const connect = async () => {
	try {
		//connect to database
		await firebase.database().goOnline();
		console.log("connected to DB");
		//subscribe to `ride_requests` topic messages
		await firebase.messaging().subscribeToTopic(topic);
		console.log("subscribed to ride requests");
		return true;
	} catch (err) {
		throw err;
	}
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

export const markRideAccepted = async (path, driverId) => {
	return new Promise(async (resolve, reject) => {
		try {
			let tripRef = firebase.database().ref(path);
			let { pickupCoordinate, destinationCoordinate, sourceAddress, sourcePlaceName, destPlaceName, arrivalTime, riderKey } = (await tripRef.once("value")).val();
			let userRef = firebase.database().ref();
			let firstname = (await userRef.child("users").child(riderKey).child("firstname").once("value")).val()
			await tripRef.update({
				tripAccepted: true,
				driverKey: driverId,
			});
			resolve({ pickupCoordinate, destinationCoordinate, sourceAddress, sourcePlaceName, destPlaceName, arrivalTime, firstname });
		} catch (e) {
			console.log(e);
			reject(e);
		}
	});
};

export const updateUserCoordinates = async (user, { latitude, longitude }) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (user) {
				await firebase
					.database()
					.ref(`drivers/${user.uid}`)
					.update({
						coordinate: [latitude, longitude],
					});
				console.log("New coordinates have been set!");
				resolve("New coordinates have been set!");
			}
		} catch (err) {
			console.error(err);
			reject(err);
		}
	});
};

export const updateArrivalTime = async (user, tripId, duration) => {
	function getNewArrivalTime() {
		let val = moment().add(duration, 'm')
		return val.format("HH:mm");
	}
	return new Promise(async (resolve, reject) => {
		try {
			if(user){
				await firebase
					.database()
					.ref(`trips/${tripId}`)
					.update({
						arrivalTime: `${getNewArrivalTime()} arrival`,
					});
			}
			resolve(`${getNewArrivalTime()} arrival`)
		} catch (err) {
			console.error(err)
			reject(err)
		}
	})
}
