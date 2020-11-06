import { CREATE_DROPOFF, UPDATE_DROPOFF, REMOVE_DROPOFF } from "../actionTypes";

const initialState = {
	details: false,
	riderInfo: {
		riderName: "",
		rating: 0.0
	},
	markers: [],
	metrics: {
		distance: null,
		duration: null
	}
}

const dropOffReducer = (state=initialState, action) => {
	switch (action.type){
		case CREATE_DROPOFF:
			return {...action.data};
		case UPDATE_DROPOFF:
			return { ...state, ...action.data };
		case REMOVE_DROPOFF:
			return initialState;
		default:
			return state;
	}
}

export default dropOffReducer;
