import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Dashboard from "../screens/Dashboard/Dashboard";
import Profile from "../screens/Profile/Profile";
import Settings from "../screens/Settings/Settings";
import { AuthProvider } from "../context/AuthContext";
//firebase
import * as firebaseApp from "firebase/app";
import "firebase/auth";
//react-native-firebase
import { AppLoading } from "expo";

const MainStack = createStackNavigator();

const MainStackScreen = () => (
	<MainStack.Navigator headerMode={"none"}>
		<MainStack.Screen name='Home' component={Dashboard} />
		<MainStack.Screen name='Profile' component={Profile} />
		<MainStack.Screen name='Settings' component={Settings} />
	</MainStack.Navigator>
);

const AppNavigator = props => {
	const [userToken, setUserToken] = useState(null);
	useEffect(() => {
		return firebaseApp.auth().onAuthStateChanged(onAuthStateChanged);
	}, []);

	function onAuthStateChanged(user) {
		if (user) {
			console.log("signed in");
			setUserToken(user);
		} else {
			firebaseApp
				.auth()
				.signInWithEmailAndPassword(
					"chipzstar.dev@googlemail.com",
					"Chisom11#"
				)
				.then(() => console.log("new user signed in!"))
				.catch(error => console.error(error.code, error.message));
		}
	}

	return (
		<AuthProvider value={{ user: userToken }}>
			<MainStackScreen/>
		</AuthProvider>
	);
};

export default AppNavigator;
