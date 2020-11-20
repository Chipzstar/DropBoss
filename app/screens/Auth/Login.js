import React, { useContext, useState } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { Block, Button, Text } from "galio-framework";
import { COLOURS } from "../../constants/Theme";
import AuthContext from "../../context/AuthContext";
import { StatusBar } from "expo-status-bar";
import Input from "react-native-input-style";
//styles
import styles from "./styles";

const Login = ({ navigation }) => {
	const { signIn } = useContext(AuthContext);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	/*const signInSchema = Yup.object({
		email: Yup.string().email("Invalid email!").required("No email entered"),
		password: Yup.string().required("No password entered"),
	});*/

	const handleSubmit = () => {
		console.log(email, password);
		signIn({ email, password });
	};

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<Block style={styles.signInContainer}>
				<StatusBar hidden />
				<Block>
					<Text h1 style={styles.signInHeader}>
						Log in
					</Text>
				</Block>
				<Block style={{flex: 1, justifyContent: "center"}}>
					<Input
						id={"email"}
						label={"Email"}
						required={true}
						email={true}
						keyboardType={"email-address"}
						errorText={email.length <= 0 ? "No email entered!" : "Invalid email!"}
						inputStyle={styles.input}
						outlined={false}
						onInputChange={(id, text) => setEmail(text)}
						value={email}
						errorContainerStyle={{ fontFamily: "Lato-Regular" }}
						labelStyle={{ fontSize: 18, fontFamily: "Lato-Regular" }}
					/>
					<Input
						id={"password"}
						label={"Password"}
						required={true}
						keyboardType='default'
						minLength={8}
						errorText={password.length <= 0 ? "No password entered!" : "Password is too short!"}
						inputStyle={styles.input}
						onInputChange={(id, text) => setPassword(text)}
						secureTextEntry={true}
						outlined={false}
						value={password}
						errorContainerStyle={{ fontFamily: "Lato-Regular" }}
						labelStyle={{ fontSize: 18, fontFamily: "Lato-Regular" }}
					/>
				</Block>
				<Block style={{ flex: 1, justifyContent: "center" }}>
					<Block center>
						<Button style={styles.loginBtn} color={COLOURS.PRIMARY} onPress={handleSubmit}>
							<Text bold color={COLOURS.WHITE} style={styles.text}>
								Log In
							</Text>
						</Button>
					</Block>
					<Block center style={styles.link}>
						<Text style={styles.text}>
							Forgot Password?&nbsp;
							<Text color={COLOURS.SECONDARY} onPress={() => navigation.navigate("ForgotPassword")}>
								Reset here
							</Text>
						</Text>
					</Block>
				</Block>
			</Block>
		</TouchableWithoutFeedback>
	);
};

export default Login;
