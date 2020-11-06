import firebase from "@react-native-firebase/app";
import "@react-native-firebase/database";
import { CREATE_PICKUP, REMOVE_PICKUP, UPDATE_PICKUP } from "../actionTypes";

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
			.ref(`trips/${id}`)
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
