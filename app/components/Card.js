import React from "react";
import { StyleSheet, View } from "react-native";
import { Block } from "galio-framework";

const Card = props => (
	<View style={styles.card}>
		<Block style={styles.cardContent}>{props.children}</Block>
	</View>
);

const styles = StyleSheet.create({
	card: {
		flex: 1,
		width: "100%"
	},
	cardContent: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginHorizontal: 20
	}
});

export default Card;
