import { CREATE_PICKUP, UPDATE_PICKUP, REMOVE_PICKUP } from "../actionTypes";

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

const pickUpReducer = (state=initialState, action) => {
	switch (action.type){
		case CREATE_PICKUP:
			return {...action.data};
		case UPDATE_PICKUP:
			return { ...state, ...action.data };
		case REMOVE_PICKUP:
			return initialState;
		default:
			return state;
	}
}

export default pickUpReducer;
