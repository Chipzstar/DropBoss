import AsyncStorage from "@react-native-community/async-storage";
import rootReducer from "./reducers";
import { applyMiddleware, createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";

//Middleware: Redux Persist Config
const persistConfig = {
	key: "root",
	storage: AsyncStorage,
	whitelist: ['onlineStatus', 'pickUp', 'dropOff', "rideStatus"],
	//blacklist: ['onlineStatus', 'pickUp', 'dropOff', 'rideStatus']
};

//Middleware: Redux Persist Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(
	persistedReducer,
	applyMiddleware(createLogger(), thunk)
);

let persistor = persistStore(store);

export { store, persistor };
