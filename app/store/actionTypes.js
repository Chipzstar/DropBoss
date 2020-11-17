/**
 * ACTION TYPES
 * @type {string}
 */
//RESET REDUX
export const RESET = 'RESET';
export const NEW_DRIVER = 'NEW_DRIVER';
//pickup actions
export const CREATE_PICKUP = "CREATE_PICKUP";
export const UPDATE_PICKUP = "UPDATE_PICKUP";
export const REMOVE_PICKUP = "REMOVE_PICKUP";
//dropoff actions
export const CREATE_DROPOFF = "CREATE_DROPOFF";
export const UPDATE_DROPOFF = "UPDATE_DROPOFF";
export const REMOVE_DROPOFF = "REMOVE_DROPOFF";
//invoice actions
export const CREATE_INVOICE = "CREATE_INVOICE";
export const UPDATE_INVOICE=  "UPDATE_INVOICE";
export const REMOVE_INVOICE = "REMOVE_INVOICE";

//online status
export const ONLINE = 'ONLINE';
//ride status
export const CLEAR = "CLEAR_RIDE_STATUS";
export const RIDE_STATUS = Object.freeze({
	ON_PICKUP: "PICKUP",
	ON_DROPOFF: "DROPOFF",
	ON_COMPLETE: "COMPLETE"
})
