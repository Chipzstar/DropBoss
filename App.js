import React from "react";
import "react-native-console-time-polyfill";
import { StyleSheet } from "react-native";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { AppLoading } from "expo";
import AppNavigator from "./app/navigation/AppNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { FONTS } from "./app/constants/Theme";

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
	await Font.loadAsync(FONTS);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
