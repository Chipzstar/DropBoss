import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "galio-framework";
import { useDispatch } from "react-redux";
import { RESET_ACTION } from "../../store/reducers";

const Settings = props => {
	const dispatch = useDispatch();
	return (
		<View style={styles.container}>
			<Text size={24}>Welcome to the Settings screen!</Text>
			<Button onPress={() => dispatch(RESET_ACTION)}>RESET</Button>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	}
});
export default Settings;
