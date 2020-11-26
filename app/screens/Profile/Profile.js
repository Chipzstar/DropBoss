import React, { useContext, useState } from "react";
import { FlatList, Image, TouchableOpacity, View } from "react-native";
import { Block, Button, Text } from "galio-framework";
import { useSelector } from "react-redux";
import { Provider as PaperProvider } from "react-native-paper";
//components
import Card from "../../components/Card";
import MenuItem from "../../components/MenuItem";
import DashIcons from "../../components/DashIcons";
//styles
import styles from "./styles";
import { COLOURS } from "../../constants/Theme";
import { HEIGHT } from "../Dashboard/styles";
import AuthContext from "../../context/AuthContext";
//images
import defaultUser from "../../assets/images/user.png";
//functions

const NAV_OPTIONS = [
	{
		title: "Ride History",
		screen: "RideHistory",
	},
	{
		title: "Earnings",
		screen: "Earnings",
	},
	{
		title: "Ratings",
		screen: "Ratings",
	},
	{
		title: "Settings",
		screen: "Settings",
	},
];

const Profile = ({ navigation }) => {
	const { signOut, user } = useContext(AuthContext);
	const { driver } = useSelector(state => state);
	const [imageUri, setImageUri] = useState(user ? user.photoURL : null);

	return (
		<PaperProvider>
			<View style={styles.container}>
				<Block style={styles.wrapper}>
					{/*<TouchableOpacity
						style={styles.backBtn}
						activeOpacity={0.7}
						onPress={() => {
							hasChanged
								? Alert.alert("Profile changed", "Save recent changes?", [
										{
											text: "no",
											onPress: () => navigation.goBack(),
										},
										{
											text: "yes",
											onPress: async () => {
												setLoading(true)
												const path = `user/${user.uid}/image/jpg`;
												const { downloadURL } = await uploadPhotoAsync(imageUri, path);
												console.log("image uploaded!");
												await user.updateProfile({ photoURL: downloadURL });
												setLoading(false);
												navigation.pop();
											},
										},
								  ])
								: navigation.goBack();
						}}
					>
						<DashIcons name={"back"} size={25} color={COLOURS.TEXT} />
					</TouchableOpacity>*/}
					<TouchableOpacity
						style={styles.editBtn}
						activeOpacity={0.7}
						onPress={() => navigation.navigate("EditProfile")}
					>
						<DashIcons name={"edit"} size={25} color={COLOURS.TEXT} />
					</TouchableOpacity>
					<Card>
						<TouchableOpacity
							activeOpacity={0.7}
							style={styles.avatarContainer}
						>
							{imageUri ? (
								<Image source={{ uri: imageUri }} style={styles.avatar} />
							) : (
								<Image source={defaultUser} style={styles.addAvatar} />
							)}
						</TouchableOpacity>
						<Block>
							<Text size={18} style={styles.text}>
								{driver.firstname}&nbsp;{driver.surname}
							</Text>
							<Text size={18} style={[styles.text, { textTransform: "lowercase", paddingBottom: 10 }]}>
								{user ? user.displayName ? user.displayName : user.email : ""}
							</Text>
						</Block>
					</Card>
				</Block>
				<FlatList
					style={{ flexGrow: 0.5 }}
					ItemSeparatorComponent={() => (
						<View
							style={{
								alignSelf: "center",
								width: "90%",
								borderWidth: 0.5,
								borderColor: "rgba(171,184,195,0.1)",
							}}
						/>
					)}
					contentContainerStyle={{
						flexGrow: 1,
						width: "100%",
					}}
					scrollEnabled={false}
					keyExtractor={(item, index) => String(index)}
					data={NAV_OPTIONS}
					renderItem={({ item }) => <MenuItem title={item.title} screen={item.screen} />}
				/>
				<Block style={{ height: HEIGHT * 0.15, alignItems: "center" }}>
					<Button size={"large"} color={COLOURS.DISABLED} onPress={() => signOut()}>
						Sign Out
					</Button>
				</Block>
			</View>
		</PaperProvider>
	);
};

Profile.propTypes = {};

export default Profile;
