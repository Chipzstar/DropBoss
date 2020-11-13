import React from "react";
import "react-native-console-time-polyfill";
import * as Font from "expo-font";
import AppNavigator from "./app/navigation/AppNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { FONTS } from "./app/constants/Theme";
//redux storage
import { Provider } from "react-redux";
import { persistor, store } from "./app/store/store";
//redux persist
import { PersistGate } from "redux-persist/integration/react";
import { ActivityIndicator } from "react-native";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
		};
	}

	async componentDidMount() {
		this.prepareResources().then(() => console.log("All resources have been loaded!"));
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
