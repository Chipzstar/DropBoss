import React, { useContext, useEffect, useState } from "react";
import { Alert, Image, ToastAndroid, TouchableOpacity } from "react-native";
import { Block, Button, Text } from "galio-framework";
import { useDispatch, useSelector } from "react-redux";
import AuthContext from "../../context/AuthContext";
import defaultUser from "../../assets/images/user.png";
import styles, { WIDTH } from "./styles";
import { COLOURS } from "../../constants/Theme";
import { updateUserProfile, uploadPhotoAsync } from "../../config/Fire";
import DashIcons from "../../components/DashIcons";
import Loader from "../../components/Modals/Loader";
import Input from "react-native-input-style";
import { UPDATE_DRIVER } from "../../store/actionTypes";
import * as Permissions from "expo-permissions";
import ImagePicker from "react-native-image-picker";
import stripe from "tipsi-stripe";

const EditProfile = ({ navigation }) => {
	const { user } = useContext(AuthContext);
	const { driver } = useSelector(state => state);
	const dispatch = useDispatch();
	const [imageUri, setImageUri] = useState(user ? user.photoURL : null);
	const [isDisabled, setDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [firstname, setFirstName] = useState("");
	const [surname, setLastName] = useState("");
	const [tel, setPhone] = useState("");
	const [email, setEmail] = useState("");

	const pickImage = async () => {
		let { status } = await Permissions.askAsync("cameraRoll", "camera");
		console.log(status);
		if (status !== "granted") {
			Alert.alert("Sorry, we need camera roll permissions to make this work!");
		} else {
			ImagePicker.launchImageLibrary(
				{
					mediaType: "photo",
					quality: 1,
					allowsEditing: true,
				},
				response => {
					if (!response.didCancel) {
						setDisabled(false);
						setImageUri(response.uri);
					}
				}
			);
		}
	};

	async function validateInputs() {
		let inputs = {};
		if (firstname && firstname !== driver.firstname) {
			inputs = { ...inputs, firstname };
		}
		if (surname && surname !== driver.surname) {
			inputs = { ...inputs, surname };
		}
		if (tel && tel !== driver.tel) {
			inputs = { ...inputs, tel };
		}
		if (Object.keys(inputs).length) {
			await updateUserProfile(user.uid, { ...inputs });
			dispatch({ type: UPDATE_DRIVER, data: { ...inputs } });
			ToastAndroid.showWithGravity("Profile updated", ToastAndroid.LONG, ToastAndroid.BOTTOM);
			setDisabled(true)
		}
	}

	useEffect(() => {
		console.log([firstname, surname, tel, email]);
		setDisabled([firstname, surname, tel, email].every(field => !field.length > 0));
	}, [firstname, surname, tel, email]);

	return (
		<Block style={styles.container}>
			<Loader isVisible={loading} />
			<TouchableOpacity
				style={styles.backBtn}
				activeOpacity={0.7}
				onPress={() => {
					!isDisabled
						? Alert.alert("Profile changed", "Do you want to save your changes?", [
								{
									text: "no",
									onPress: () => navigation.goBack(),
								},
								{
									text: "yes",
									onPress: async () => {
										setLoading(true);
										const path = `user/${user.uid}/image/jpg`;
										const { downloadURL } = await uploadPhotoAsync(imageUri, path);
										console.log("image uploaded!");
										await user.updateProfile({ photoURL: downloadURL });
										await validateInputs();
										setLoading(false);
										navigation.pop();
									},
								},
						  ])
						: navigation.goBack();
				}}
			>
				<DashIcons name={"back"} size={25} color={COLOURS.TEXT} />
			</TouchableOpacity>
			<Block row space={"around"} style={styles.header}>
				<Text h2 bold color={COLOURS.HEADING} style={{ fontFamily: "Lato-Regular" }}>
					Edit Profile
				</Text>
				{imageUri ? (
					<TouchableOpacity activeOpacity={0.8} onPress={pickImage} >
						<Image source={{ uri: user.photoURL }} style={styles.avatar} />
						<Block style={styles.icon}>
							<DashIcons name={"edit"} size={18} />
						</Block>
					</TouchableOpacity>
				) : (
					<TouchableOpacity activeOpacity={0.8} onPress={pickImage}>
						<Image source={defaultUser} style={styles.avatar} />
						<Block style={styles.icon}>
							<DashIcons name={"edit"} size={18}/>
						</Block>
					</TouchableOpacity>
				)}
			</Block>
			<Block style={{ flex: 0.55, justifyContent: "flex-start", paddingHorizontal: 10 }}>
				<Block row>
					<Block>
						<Input
							onInputChange={(id, text) => setFirstName(text)}
							id={"firstname"}
							label={"First Name"}
							labelStyle={styles.label}
							inputStyle={[styles.input, { width: WIDTH * 0.4 }]}
							placeholder={driver.firstname}
						/>
					</Block>
					<Block>
						<Input
							onInputChange={(id, text) => setLastName(text)}
							id={"lastname"}
							label={"Last Name"}
							labelStyle={styles.label}
							inputStyle={[styles.input, { width: WIDTH * 0.4 }]}
							placeholder={driver.surname}
						/>
					</Block>
				</Block>
				<Block row center>
					<Input
						keyboardType={"phone-pad"}
						id={"phone"}
						onInputChange={(id, text) => setPhone(text)}
						labelStyle={styles.label}
						label={"Phone Number"}
						inputStyle={[styles.input, { width: WIDTH * 0.85 }]}
						placeholder={driver.tel}
					/>
				</Block>
				<Block row center>
					<Input
						keyboardType={"email-address"}
						errorText={"Invalid email"}
						errorContainerStyle={{ fontFamily: "Lato-Regular" }}
						email
						id={"email"}
						onInputChange={(id, text) => setEmail(text)}
						labelStyle={styles.label}
						label={"Email"}
						inputStyle={[styles.input, { width: WIDTH * 0.85 }]}
						placeholder={driver.email}
					/>
				</Block>
				<Block row>
					<Button
						color={COLOURS.PRIMARY}
						onPress={async () => {
							const token = await stripe.paymentRequestWithCardForm({
								requiredBillingAddressFields: "full",
								prefilledInformation: { email: driver.email, phone: driver.tel },
								theme: {
									primaryBackgroundColor: COLOURS.PRIMARY,
									secondaryBackgroundColor: COLOURS.TEXT,
									primaryForegroundColor: COLOURS.HEADING,
									secondaryForegroundColor: COLOURS.PLACEHOLDER,
									accentColor: COLOURS.SECONDARY,
									errorColor: COLOURS.ERROR,
								},
							})
							console.log(token);
						}}
					>
						<Text bold style={styles.text}>
							Add Card
						</Text>
					</Button>
				</Block>
			</Block>
			<Block center style={{ flex: 0.2, justifyContent: "center" }}>
				<Button
					disabled={isDisabled}
					style={{ height: 60, width: WIDTH * 0.6 }}
					color={isDisabled ? COLOURS.DISABLED : COLOURS.PRIMARY}
					onPress={() => validateInputs()}
				>
					<Text bold style={styles.text}>
						SAVE
					</Text>
				</Button>
			</Block>
		</Block>
	);
};

export default EditProfile;
