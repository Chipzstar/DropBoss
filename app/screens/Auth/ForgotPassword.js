import React from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { Block, Text } from "galio-framework";
import styles from "./styles";
import { StatusBar } from "expo-status-bar";

const ForgotPassword = (props) => (
	<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
		<Block style={styles.signInContainer}>
			<StatusBar hidden />
			<Block>
				<Text h1 center style={styles.signInHeader}>
					Forgot Password
				</Text>
			</Block>
		</Block>
	</TouchableWithoutFeedback>
);

export default ForgotPassword;
