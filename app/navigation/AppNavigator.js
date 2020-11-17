import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
//screens
import Login from "../screens/Auth/Login";
import ForgotPassword from "../screens/Auth/ForgotPassword";
import Verification from "../screens/Auth/Verification";
import Dashboard from "../screens/Dashboard/Dashboard";
import Profile from "../screens/Profile/Profile";
import Settings from "../screens/Settings/Settings";
//context
import { AuthProvider } from "../context/AuthContext";
//react-native-firebase
import firebase from "@react-native-firebase/app";
import "@react-native-firebase/auth";
import "@react-native-firebase/messaging";
import { useDispatch } from "react-redux";
import { RESET_ACTION } from "../store/reducers";
import UserPermissions from "../permissions/UserPermissions";
import { NEW_DRIVER } from "../store/actionTypes";
import { getDriverDetails } from "../config/Fire";

const RootStack = createStackNavigator();
const MainStack = createStackNavigator();
const AuthStack = createStackNavigator();

const RootStackScreen = ({ userToken }) => (
	<RootStack.Navigator headerMode={"none"}>
		{userToken ? (
			<RootStack.Screen name={"App"} component={MainStackScreen} />
		) : (
			<RootStack.Screen name={"Auth"}>{props => <AuthStackScreen {...props} />}</RootStack.Screen>
		)}
	</RootStack.Navigator>
);

const AuthStackScreen = () => {
	return (
		<AuthStack.Navigator headerMode={"none"} initialRouteName={"SignIn"}>
			<AuthStack.Screen name={"SignIn"} component={Login} />
			<AuthStack.Screen name={"ForgotPassword"} component={ForgotPassword} />
			<AuthStack.Screen name={"Verification"} component={Verification}/>
		</AuthStack.Navigator>
	);
};

const MainStackScreen = () => (
	<MainStack.Navigator headerMode={"none"}>
		<MainStack.Screen name='Home'>{props => <Dashboard {...props} />}</MainStack.Screen>
		<MainStack.Screen name='Profile' component={Profile} />
		<MainStack.Screen name='Settings' component={Settings} />
	</MainStack.Navigator>
);

let unsubscribeAuth;

const AppNavigator = props => {
	const dispatch = useDispatch();
	const [initializing, setInitializing] = useState(true);
	const [userToken, setUserToken] = useState(null);

	const authContext = useMemo(
		() => ({
			signIn: ({ email, password }) => {
				unsubscribeAuth();
				firebase
					.auth()
					.signInWithEmailAndPassword(email.toLowerCase().trim(), password)
					.then(({ user }) => {
						getDriverDetails(user.uid)
							.then((details) => dispatch({type: NEW_DRIVER, data: {...details}}))
						setInitializing(false);
						setUserToken(user.uid);
					})
					.catch(error => {
						switch (error.code) {
							case "auth/invalid-email":
								Alert.alert("That email address is invalid");
								return;
							case "auth/user-disabled":
								Alert.alert("The account with that email address has been disabled");
								return;
							case "auth/wrong-password":
								Alert.alert("Wrong password");
								return;
							case "auth/user-not-found":
								Alert.alert("No user exists with that email address");
								return;
							default:
								Alert.alert("Oops!", error.message);
								console.log(error);
						}
					});
			},
			signOut: () => {
				firebase
					.auth()
					.signOut()
					.then(function () {
						console.log("signed out");
						setInitializing(false);
						setUserToken(null);
					})
					.catch(function (error) {
						console.error(error);
					});
			},
			sendResetEmail: async ({ email }) => {
				try {
					return await firebase.auth().sendPasswordResetEmail(email);
				} catch (err) {
					switch (err.code) {
						case "auth/invalid-email":
							Alert.alert("That email address is invalid");
							return;
						case "auth/user-not-found":
							Alert.alert("No user exists with that email address");
							return;
						default:
							Alert.alert("Oops!", error.message);
							console.log(error);
					}
				}
			},
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
		unsubscribeAuth = firebase.auth().onAuthStateChanged(onAuthStateChanged);
		return unsubscribeAuth;
	}, []);

	useEffect(() => console.log("Loading: ", initializing),[initializing])

	async function onAuthStateChanged(user) {
		if (user) {
			console.log("signed in", user.uid);
			//get location permissions
			await UserPermissions.getLocationPermission();
			//get device/fcm push notification token
			await UserPermissions.registerPushNotificationsAsync(user);
			setUserToken(user ? user.uid : user);
			setInitializing(false);
		} else {
			setInitializing(false);
		}
		/* else {
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
		}*/
	}

	return (
		<AuthProvider value={authContext}>
			{initializing ? (
				<ActivityIndicator style={{ flex: 1, justifyContent: "center", alignItems: "center" }} size={"large"} />
			) : (
				<RootStackScreen userToken={userToken} />
			)}
		</AuthProvider>
	);
};

export default AppNavigator;
