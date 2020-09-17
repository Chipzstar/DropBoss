import React from "react";
import {
	Dimensions,
	FlatList,
	Image,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import Card from "../../components/Card";
import { Block, Text } from "galio-framework";
import oscar from "../../assets/images/oscar.jpg";
import Emojis from "../../components/Emojis";
import { COLOURS } from "../../constants/Theme";
import MenuItem from "../../components/MenuItem";
import DashIcons from "../../components/DashIcons";

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

const Profile = ({ navigation }) => (
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
					<Text
						size={18}
						style={[
							styles.text,
							{ textTransform: "lowercase", paddingBottom: 10 },
						]}
					>
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
			renderItem={({ item }) => (
				<MenuItem title={item.title} screen={item.screen} />
			)}
		/>
	</View>
);

const HEIGHT = Dimensions.get("window").height;
const AVATAR_SIZE = 100;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "space-between",
	},
	wrapper: {
		backgroundColor: COLOURS.WHITE,
		flex: 0.5,
		width: "100%",
		alignItems: "center",
		elevation: 5,
		shadowOffset: { width: 1, height: 1 },
		shadowRadius: 2,
		shadowOpacity: 0.3,
		shadowColor: "rgba(0, 0, 0, 0.25)",
		paddingBottom: 40,
		paddingTop: HEIGHT * 0.1,
	},
	avatarContainer: {
		backgroundColor: COLOURS.WHITE,
		elevation: 7,
		shadowOffset: { width: 1, height: 1 },
		shadowRadius: 2,
		shadowOpacity: 0.3,
		shadowColor: "rgba(0, 0, 0, 0.25)",
		padding: 5,
		marginBottom: 10,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: AVATAR_SIZE + 10 / 2,
	},
	cardAvatar: {
		width: AVATAR_SIZE,
		height: AVATAR_SIZE,
		borderRadius: AVATAR_SIZE / 2,
	},
	text: {
		lineHeight: 25,
		fontFamily: "Lato-Regular",
		color: COLOURS.TEXT,
		textAlign: "center",
	},
	backBtn: {
		backgroundColor: COLOURS.WHITE,
		elevation: 4,
		position: "absolute",
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		alignSelf: "flex-start",
		top: 30,
		left: 20,
		paddingRight: 2,
		height: 42,
		width: 42,
		borderRadius: 21
	},
});

Profile.propTypes = {};

export default Profile;
