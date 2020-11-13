import React, { useContext } from "react";
import { FlatList, Image, TouchableOpacity, View } from "react-native";
import Card from "../../components/Card";
import { Button, Block, Text } from "galio-framework";
import oscar from "../../assets/images/oscar.jpg";
import Emojis from "../../components/Emojis";
import { COLOURS } from "../../constants/Theme";
import MenuItem from "../../components/MenuItem";
import DashIcons from "../../components/DashIcons";
import styles from "./styles";
import { HEIGHT } from "../Dashboard/styles";
import AuthContext from "../../context/AuthContext";

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
	const { signOut } = useContext(AuthContext);
	return (
		<View style={styles.container}>
			<Block style={styles.wrapper}>
				<TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={() => navigation.goBack()}>
					<DashIcons name={"back"} size={25} color={COLOURS.TEXT} />
				</TouchableOpacity>
				<Card>
					<Block style={styles.avatarContainer}>
						<Image source={oscar} style={styles.cardAvatar} />
					</Block>
					<Block style={{}}>
						<Text size={18} style={styles.text}>
							Oscar Sanz
						</Text>
						<Text size={18} style={[styles.text, { textTransform: "lowercase", paddingBottom: 10 }]}>
							@Snazzy Snaz
						</Text>
						<Text size={24} style={styles.text}>
							4.7&nbsp;&nbsp;
							<Emojis name={"fist-pump"} color={"orange"} size={20} />
							<Emojis name={"fist-pump"} color={"orange"} size={20} />
							<Emojis name={"fist-pump"} color={"orange"} size={20} />
							<Emojis name={"fist-pump"} color={"orange"} size={20} />
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
			<Block style={{ height: HEIGHT * 0.1, alignItems: "center" }}>
				<Button size={"large"} color={COLOURS.DISABLED} onPress={() => signOut()}>
					Sign Out
				</Button>
			</Block>
		</View>
	)
};

Profile.propTypes = {};

export default Profile;
