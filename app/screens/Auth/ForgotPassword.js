import React, { useContext } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { Block, Button, Input, Text } from "galio-framework";
import styles from "./styles";
import { StatusBar } from "expo-status-bar";
import { Formik } from "formik";
import * as Yup from "yup";
import AuthContext from "../../context/AuthContext";
import { COLOURS } from "../../constants/Theme";

const signInSchema = Yup.object({
	email: Yup.string().email("Invalid email!").required("No email entered"),
});

const ForgotPassword = ({ navigation }) => {
	const { sendResetEmail } = useContext(AuthContext);
	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<Block style={styles.signInContainer}>
				<StatusBar hidden />
				<Block>
					<Text h1 center style={styles.signInHeader}>
						Forgot Password
					</Text>
					<Text h6 center style={{ fontFamily: "Lato-Regular", paddingBottom: 30 }}>
						Please enter your email address below and we will send you information to recover your account
					</Text>
				</Block>
				<Formik
					initialValues={{
						email: "",
					}}
					onSubmit={(values, actions) => {
						console.log(values);
						sendResetEmail(values)
							.then(() => navigation.navigate("Verification", { ...values }))
					}}
					validationSchema={signInSchema}
				>
					{props => (
						<Block style={{ flex: 1 }}>
							<Input
								type='email-address'
								value={props.values.email}
								onChangeText={props.handleChange("email")}
								placeholder={"Email"}
								onSubmitEditing={props.handleSubmit}
								bgColor='transparent'
								style={styles.input}
							/>
							<Text style={styles.error} muted>
								{props.touched.email && props.errors.email}
							</Text>
							<Block center style={{ paddingVertical: 30 }}>
								<Button style={styles.loginBtn} color={COLOURS.PRIMARY} onPress={props.handleSubmit}>
									<Text bold color={COLOURS.WHITE} style={styles.text}>
										Reset Password
									</Text>
								</Button>
							</Block>
						</Block>
					)}
				</Formik>
			</Block>
		</TouchableWithoutFeedback>
	);
};

export default ForgotPassword;
