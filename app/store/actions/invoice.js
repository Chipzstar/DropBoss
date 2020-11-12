import { CREATE_INVOICE, UPDATE_INVOICE, REMOVE_INVOICE } from "../actionTypes";

/**
 * ACTION CREATORS
 */
export const createInvoice = data => ({
	type: CREATE_INVOICE,
	data,
});

export const updateInvoice = data => ({
	type: UPDATE_INVOICE,
	data,
});

export const removeInvoice = () => ({
	type: REMOVE_INVOICE,
});
