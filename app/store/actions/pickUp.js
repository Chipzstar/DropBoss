import firebase from "@react-native-firebase/app";
import "@react-native-firebase/database";

/**
 * ACTION TYPES
 * @type {string}
 */
export const GET_PICKUP = "GET_PICKUP";
export const CREATE_PICKUP = "CREATE_PICKUP";
export const UPDATE_PICKUP = "UPDATE_PICKUP";
export const REMOVE_PICKUP = "REMOVE_PICKUP";

/**
 * ACTION CREATORS
 */
export const createPickupInfo = data => ({
	type: CREATE_PICKUP,
	data,
});

export const updatePickupInfo = data => ({
	type: UPDATE_PICKUP,
	data,
});

export const removePickupInfo = id => ({
	type: REMOVE_PICKUP,
	id,
});

/**
 * THUNKS
 * @param id
 * @returns {function(*, *): void}
 */
export const updatePickupThunk = id => {
	return (dispatch, getState) => {
		console.log("GET STATE:", getState());
		firebase
			.database()
			.ref(`requests/${id}`)
			.once("value")
			.then(snap => {
				console.log(snap.val());
				let { arrivalTime } = snap.val();
				dispatch(
					updatePickupInfo({
						arrivalTime,
					})
				);
			});
	};
};

/*export const newTrip = (data) => {
	return (dispatch, getState) => {
		firebase.database().ref(`trips`).push({
			...data
		}).then(() => dispatch(createPickupInfo(data)))
	}
}*/
