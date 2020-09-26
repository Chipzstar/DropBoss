import { CREATE_PICKUP, UPDATE_PICKUP, REMOVE_PICKUP, GET_PICKUP } from "../actions/pickUp";

const initialState = {
	id: "",
	destination: [],
	placeName: "",
	arrivalTime: "",
	riderInfo: {
		riderName: "",
		rating: 0.0
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
