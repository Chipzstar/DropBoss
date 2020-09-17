import React from "react";
import "react-native-console-time-polyfill";
import { StyleSheet } from "react-native";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { AppLoading } from "expo";
import AppNavigator from "./app/navigation/AppNavigator";
import { NavigationContainer } from "@react-navigation/native";

let customFonts = {
	"Lato-Regular": require("./app/assets/fonts/lato/Lato-Regular.ttf"),
	"Lato-Bold": require("./app/assets/fonts/lato/Lato-Bold.ttf"),
	"Lato-Italic": require("./app/assets/fonts/lato/Lato-Italic.ttf"),
	"Lato-Light": require("./app/assets/fonts/lato/Lato-Light.ttf"),
	"Lato-Black": require("./app/assets/fonts/lato/Lato-Black.ttf"),
	"Lato-Thin": require("./app/assets/fonts/lato/Lato-Thin.ttf"),
	DashIcons: require("./app/assets/icons/general/fonts/icomoon.ttf"),
	Emojis: require('./app/assets/icons/emojis/fonts/icomoon.ttf')
};

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
		};
	}

	async componentDidMount() {
		try {
			await SplashScreen.preventAutoHideAsync();
		} catch (e) {
			console.warn(e);
		}
		this.prepareResources().then(() =>
			console.log("All resources have been loaded!")
		);
	}

	prepareResources = async () => {
		//await performAPICalls()
		await downloadAssets();
		this.setState({ loading: false }, async () => {
			await SplashScreen.hideAsync();
		});
	};

	render() {
		const { loading } = this.state;
		if (loading) {
			return <AppLoading />;
		}
		return (
			<NavigationContainer>
				<AppNavigator/>
			</NavigationContainer>
		);
	}
}

//async function performAPICalls() {}

async function downloadAssets() {
	await Font.loadAsync(customFonts);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
