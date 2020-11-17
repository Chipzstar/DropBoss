import React from "react";
import Modal from 'react-native-modal';
import { Block, Button, Text } from "galio-framework";
import { ActivityIndicator } from "react-native";

const Loader = ({ isVisible }) => (
	<Modal isVisible={isVisible} style={{alignItems: "center"}} dismissable={false}>
		<ActivityIndicator size={"large"}/>
	</Modal>
)

export default Loader;
