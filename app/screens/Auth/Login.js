import React, { Component, useContext } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { Block, Button, Input, Text } from "galio-framework";
import { COLOURS } from "../../constants/Theme";
import AuthContext from "../../context/AuthContext";
import { Formik } from "formik";
import * as Yup from "yup";
import styles from "./styles";
import { StatusBar } from "expo-status-bar";

const Login = ({ navigation }) => {
	const { signIn } = useContext(AuthContext);

	const signInSchema = Yup.object({
		email: Yup.string().email("Invalid email!").required("No email entered"),
		password: Yup.string().required("No password entered"),
	});

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<Block style={styles.signInContainer}>
				<StatusBar hidden />
				<Block>
					<Text h1 style={styles.signInHeader}>
						Log in
					</Text>
				</Block>
				<Formik
					initialValues={{
						email: "",
						password: "",
					}}
					onSubmit={(values, actions) => {
						console.log(values);
						signIn(values);
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
								onSubmitEditing={Keyboard.dismiss}
								bgColor='transparent'
								style={styles.input}
							/>
							<Text style={styles.error} muted>
								{props.touched.email && props.errors.email}
							</Text>
							<Input
								placeholder='Password'
								style={styles.input}
								value={props.values.password}
								onChangeText={props.handleChange("password")}
								onSubmitEditing={Keyboard.dismiss}
								bgColor='transparent'
								password
								viewPass
							/>
							<Text style={styles.error} muted>
								{props.touched.password && props.errors.password}
							</Text>
							<Block style={{ flex: 1, justifyContent: "center" }}>
								<Block center>
									<Button
										style={styles.loginBtn}
										color={COLOURS.PRIMARY}
										onPress={props.handleSubmit}
									>
										<Text bold color={COLOURS.WHITE} style={styles.text}>
											Log In
										</Text>
									</Button>
								</Block>
								<Block center style={styles.link}>
									<Text style={styles.text}>
										Forgot Password?&nbsp;
										<Text
											color={COLOURS.SECONDARY}
											onPress={() => navigation.navigate("ForgotPassword")}
										>
											Reset here
										</Text>
									</Text>
								</Block>
							</Block>
						</Block>
					)}
				</Formik>
			</Block>
		</TouchableWithoutFeedback>
	);
};

export default Login;
