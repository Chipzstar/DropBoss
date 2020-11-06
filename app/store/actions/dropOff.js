import { CREATE_DROPOFF, REMOVE_DROPOFF, UPDATE_DROPOFF } from "../actionTypes";

/**
 * ACTION CREATORS
 */
export const createDropoffInfo = data => ({
	type: CREATE_DROPOFF,
	data,
});

export const updateDropoffInfo = data => ({
	type: UPDATE_DROPOFF,
	data,
});

export const removeDropoffInfo = () => ({
	type: REMOVE_DROPOFF,
});
