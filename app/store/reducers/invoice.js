import {
	CREATE_INVOICE,
	UPDATE_INVOICE,
	REMOVE_INVOICE
} from "../actionTypes";

const initialState = {
	fare: 0.0,		// (£)
	distance: 0, 	// (km)
	duration: 0,	// (mins)
	departTime: "",
	arrivalTime: "",
	rider: ""
}

const invoiceReducer = (state=initialState, action) => {
	switch (action.type){
		case CREATE_INVOICE:
			return {...action.data};
		case UPDATE_INVOICE:
			return { ...state, ...action.data };
		case REMOVE_INVOICE:
			return initialState;
		default:
			return state;
	}
}

export default invoiceReducer;
