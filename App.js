import React, { useEffect } from "react";
import "react-native-console-time-polyfill";
import * as Font from "expo-font";
import AppNavigator from "./app/navigation/AppNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { FONTS } from "./app/constants/Theme";
import SplashScreen from "react-native-splash-screen";
import { PUBLISHABLE_KEY } from "@env";
//redux storage
import { Provider } from "react-redux";
import { persistor, store } from "./app/store/store";
//redux persist
import { PersistGate } from "redux-persist/integration/react";
import { ActivityIndicator } from "react-native";
import stripe from "tipsi-stripe";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
		};
	}

	async componentDidMount() {
		stripe.setOptions({
			publishableKey: PUBLISHABLE_KEY,
			androidPayMode: "test", // Android only
		});
		this.prepareResources().then(() => {
			console.log("All resources have been loaded!");
			SplashScreen.hide();
		});
	}

	prepareResources = async () => {
		//await performAPICalls()
		await downloadAssets();
		this.setState({ loading: false });
	};

	render() {
		const { loading } = this.state;
		if (loading) {
			return (
				<ActivityIndicator style={{ flex: 1, justifyContent: "center", alignItems: "center" }} size={"large"} />
			);
		}
		return (
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<NavigationContainer>
						<AppNavigator />
					</NavigationContainer>
				</PersistGate>
			</Provider>
		);
	}
}

//async function performAPICalls() {}

async function downloadAssets() {
	await Font.loadAsync(FONTS);
}

export default App;
