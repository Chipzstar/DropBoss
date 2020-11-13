import React from "react";
import loveLetter from "../../assets/images/love-letter.png";
import { Block, Text } from "galio-framework";
import { Image, TouchableOpacity } from "react-native";
import styles, { HEIGHT, WIDTH } from "./styles";
import { COLOURS } from "../../constants/Theme";


const Verification = ({ route, navigation }) => {
	const { email } = route.params;
	return (
		<Block style={styles.container}>
			<Image source={loveLetter} style={{ height: WIDTH * 0.75 , width: WIDTH * 0.75 }} />
			<Block
				style={{
					flex: 0.4,
					justifyContent: "space-around",
					alignItems: "center",
					paddingHorizontal: 15
				}}
			>
				<Text color={COLOURS.HEADING} center style={styles.text}>
					We have just sent a password reset email to <Text bold>{email}</Text>
				</Text>
				<Text color={COLOURS.HEADING} style={styles.text}>
					Not received an email?
					<Text h6 muted bold style={{ textDecorationLine: "underline" }}>
						&nbsp;Send again
					</Text>
				</Text>
				<TouchableOpacity onPress={() => navigation.popToTop()}>
					<Text h6 muted bold style={{...styles.text, textDecorationLine: "underline"}}>
						Use a different email
					</Text>
				</TouchableOpacity>
			</Block>
		</Block>
	);
};

export default Verification;
