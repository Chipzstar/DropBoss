import React, { useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import stripe, { PaymentCardTextField } from "tipsi-stripe";
import { COLOURS } from "../../constants/Theme";
import { Block, Text, Button } from "galio-framework";
import { useSelector } from "react-redux";

const Settings = props => {
	const paymentCardInput = useRef(null);
	const { driver } = useSelector(state => state);
	const [params, setParams] = useState({});
	/*const params = {
		// mandatory
		number: "4242424242424242",
		expMonth: 11,
		expYear: 17,
		cvc: "223",
		// optional
		name: driver.firstname,
		currency: "GBP",
		addressLine1: "123 Test Street",
		addressCity: "Test City",
		addressState: "Test State",
		addressCountry: "United Kingdom",
		addressZip: "55555"
	};*/

	const handleFieldParamsChange = (valid, params) => {
		console.log(`
      Valid: ${valid}
      Number: ${params.number || "-"}
      Month: ${params.expMonth || "-"}
      Year: ${params.expYear || "-"}
      CVC: ${params.cvc || "-"}
    `);
		setParams(prevState => params);
	};

	const isPaymentCardTextFieldFocused = () => paymentCardInput.current.isFocused();

	const focusPaymentCardTextField = () => paymentCardInput.current.focus();

	const blurPaymentCardTextField = () => paymentCardInput.current.blur();

	const resetPaymentCardTextField = () => paymentCardInput.current.setParams({});

	async function submit(params) {
		const token = await stripe.createTokenWithCard(params);
		console.log(token);
	}

	return (
		<Block center style={{ flex: 1, justifyContent: "center" }}>
			<Text>Welcome to the Settings screen!</Text>
			<PaymentCardTextField
				ref={paymentCardInput}
				style={styles.field}
				cursorColor={COLOURS.BLACK}
				textErrorColor={COLOURS.ERROR}
				placeholderColor={COLOURS.TEXT}
				numberPlaceholder={"..."}
				expirationPlaceholder={"MM/YY"}
				cvcPlaceholder={"000"}
				disabled={false}
				enabled
				onParamsChange={handleFieldParamsChange}
			/>
		</Block>
	);
};

const styles = StyleSheet.create({
	field: {
		width: 300,
		color: "#449aeb",
		borderColor: "#000",
		borderWidth: 1,
		borderRadius: 5,
	},
});

export default Settings;
