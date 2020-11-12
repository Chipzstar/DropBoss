import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { combineReducers } from "redux";
//reducers
import pickUpReducer from "./pickUp";
import dropOffReducer from "./dropOff";
import invoiceReducer from "./invoice";
//actionTypes
import { CLEAR, ONLINE, RESET, RIDE_STATUS } from "../actionTypes";

export const RESET_ACTION = {
	type: RESET
};

export const SET_ONLINE_STATUS = status => ({
	type: ONLINE,
	status
})

export const CLEAR_RIDE_STATUS = ({
	type: CLEAR
})

const appReducer = combineReducers({
	onlineStatus: (state = false, action) => {
		switch (action.type) {
			case ONLINE:
				return action.status;
			default:
				return state;
		}
	},
	rideStatus: (state={key: 0, tripId: null }, action) => {
		switch (action.type) {
			case RIDE_STATUS.ON_PICKUP:
				return { key: 1, tripId: action.id };
			case RIDE_STATUS.ON_DROPOFF:
				return { key: 2, tripId: action.id };
			case RIDE_STATUS.ON_COMPLETE:
				return { key: 3, tripId: action.id };
			case CLEAR:
				return { key: 0, tripId: null };
			default:
				return state;
		}
	},
	pickUp: pickUpReducer,
	dropOff: dropOffReducer,
	rideInvoice: invoiceReducer,
});

const rootReducer = (state, action) => {
	if (action.type === RESET) {
		// for all keys defined in your persistConfig(s)
		console.log("Redux Storage has been reset");
		AsyncStorage.removeItem('persist:root')
		state = undefined;
	}
	return appReducer(state, action);
};

export default rootReducer;
