import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import App from './App';
import firebase from "@react-native-firebase/app";
import '@react-native-firebase/messaging';

//register background handler
firebase.messaging().setBackgroundMessageHandler(async remoteMessage => {
	console.log('Message handled in the background!', remoteMessage.data);
});
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
