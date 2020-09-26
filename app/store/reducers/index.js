import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { combineReducers } from "redux";
//reducers
const RESET = 'RESET';
import pickUpReducer from "./pickUp";
import dropOffReducer from "./dropOff";

export const RESET_ACTION = {
	type: RESET
};

const appReducer = combineReducers({
	pickUp: pickUpReducer,
	dropOff: dropOffReducer
})

const rootReducer = (state, action) => {
	//if (action.type === RESET) {
		// for all keys defined in your persistConfig(s)
		console.log("Redux Storage has been reset");
		AsyncStorage.removeItem('persist:root').then(() => state = undefined);
	//}
	return appReducer(state, action);
};

export default rootReducer;
