import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { combineReducers } from "redux";
//reducers
import pickUpReducer from "./pickUp";
import dropOffReducer from "./dropOff";
import { ONLINE, RESET } from "../actionTypes";

export const RESET_ACTION = {
	type: RESET
};

export const SET_ONLINE_STATUS = status => ({
	type: ONLINE,
	status
})

const appReducer = combineReducers({
	onlineStatus: (state=false, action) => {
		switch (action.type){
			case ONLINE:
				return action.status
			default:
				return state;
		}
	},
	pickUp: pickUpReducer,
	dropOff: dropOffReducer,
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
