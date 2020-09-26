import React, { useEffect, useMemo, useState } from "react";
import { AppLoading } from "expo";
import { createStackNavigator } from "@react-navigation/stack";
import Dashboard from "../screens/Dashboard/Dashboard";
import Profile from "../screens/Profile/Profile";
import Settings from "../screens/Settings/Settings";
import { AuthProvider } from "../context/AuthContext";
//react-native-firebase
import firebase from "@react-native-firebase/app";
import "@react-native-firebase/auth";
import "@react-native-firebase/messaging";

const MainStack = createStackNavigator();

const MainStackScreen = () => (
	<MainStack.Navigator headerMode={"none"}>
		<MainStack.Screen name='Home'>
			{props => <Dashboard {...props}/>}
		</MainStack.Screen>
		<MainStack.Screen name='Profile' component={Profile} />
		<MainStack.Screen name='Settings' component={Settings} />
	</MainStack.Navigator>
);

const AppNavigator = props => {
	const [initializing, setInitializing] = useState(true);
	const [userToken, setUserToken] = useState(null);

	const authContext = useMemo(
		() => ({
			user: userToken ? firebase.auth().currentUser : null,
		}),
		[userToken]
	);

	useEffect(() => {
		/*firebase.messaging().onNotificationOpenedApp(remoteMessage => {
			console.log(
				'Notification caused app to open from background state:',
				remoteMessage.notification,
			);
		});*/
		const unsubscribeAuth = firebase
			.auth()
			.onAuthStateChanged(onAuthStateChanged);
		return unsubscribeAuth();
	}, []);

	async function onAuthStateChanged(user) {
		if (user) {
			console.log("signed in");
			setUserToken(user ? user.uid : null);
			setInitializing(false);
		} else {
			try {
				await firebase
					.auth()
					.signInWithEmailAndPassword(
						"chipzstar.dev@googlemail.com",
						"Chisom11#"
					)
				console.log("new user signed in!");
			} catch (error) {
				console.error(error.code, error.message);
			}
		}
	}

	return !initializing && userToken ? (
		<AuthProvider value={authContext}>
			<MainStackScreen />
		</AuthProvider>
	) : <AppLoading/>;
};

export default AppNavigator;
