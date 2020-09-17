import React from "react";
import { TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { Block, Text } from "galio-framework";
import DashIcons from "./DashIcons";
import { COLOURS } from "../constants/Theme";

const MenuItem = ({ title, screen }) => (
	<TouchableOpacity
		activeOpacity={0.8}
		style={{
			flex: 1,
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-around',
			backgroundColor: COLOURS.WHITE,
			paddingHorizontal: 20,
			paddingVertical: 25,
		}}
		onPress={() => console.log(`${title} nav option pressed`)}
	>
		<Block style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
			<Text style={{ fontSize: 20, paddingLeft: 20, fontFamily: 'Roboto' }}>{title}</Text>
		</Block>
		<DashIcons name={'goto'} size={24} color={COLOURS.SECONDARY} />
	</TouchableOpacity>
);

MenuItem.propTypes = {
	title: PropTypes.string.isRequired,
	screen: PropTypes.string.isRequired
};

export default MenuItem;
