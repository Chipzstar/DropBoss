/*
import React, { useRef } from "react";
import { Image, Text, View } from "react-native";
import { GOOGLE_MAPS_DIRECTIONS_API_KEY } from "@env";
import PropTypes from "prop-types";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { COLOURS, IMAGES } from "../constants/Theme";
import styles from "../screens/Dashboard/styles";

function showRouteOnMap(markers){
	let ids = markers.map(marker => marker.id);
	setTimeout(() => {
		ref.current.fitToSuppliedMarkers(ids, {
			edgePadding: EdgePadding,
		});
	}, 1000);
	return () => clearTimeout();
}

const mapViewRef = useRef();

const Map = ({ coords, markers, riderDetails, updateMetrics, onNewRequest }) => (
	<MapView
		ref={mapViewRef}
		provider={PROVIDER_GOOGLE}
		initialRegion={{
			latitude: 0,
			longitude: 0,
			latitudeDelta: 0.005,
			longitudeDelta: 0.005,
		}}
		region={{
			...coords,
			latitudeDelta: 0.005,
			longitudeDelta: 0.005,
		}}
		onMapReady={() => console.count("map ready")}
		showsUserLocation={!(markers.length >= 1)}
		followUserLocation={!(markers.length > 1)}
		showsCompass={true}
		style={[styles.mapContainer, { flex: !riderDetails ? 1 : 0.7 }]}
	>
		{markers.map(({ id, latitude, longitude }, index) => (
			<Marker key={index} coordinate={{ latitude, longitude }} identifier={id}>
				{index === 0 && <Image source={IMAGES.carTop} style={{ width: 25, height: 50 }} />}
			</Marker>
		))}
			<MapViewDirections
				origin={coords}
				destination={{
					latitude: markers[markers.length - 1].latitude,
					longitude: markers[markers.length - 1].longitude,
				}}
				apikey={GOOGLE_MAPS_DIRECTIONS_API_KEY}
				strokeWidth={3}
				strokeColor={COLOURS.PRIMARY}
				onStart={params => {
					console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
				}}
				onReady={({ distance, duration }) => {
					console.log(`Distance: ${distance} km`);
					console.log(`Duration: ${duration} min.`);
					updateMetrics({ distance, duration });
					onNewRequest();
				}}
				onError={errorMessage => console.error("ERROR:", errorMessage)}
			/>

	</MapView>
);

Map.propTypes = {

};

export default Map;
*/
