import React from 'react';
import { StyleSheet, Platform, Image, Text, Button, View, ScrollView, YellowBox, PermissionsAndroid } from 'react-native';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import firebase from 'react-native-firebase';
import UserLocationMarker from './UserLocationMarker';

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            loggedIn: false,
            showUserLocation: false,
            region: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0.0462,
                longitudeDelta: 0.0261,
            },
        };
    }


    async componentDidMount() {
        GoogleSignin.configure();
        this.isSignedIn();
        this.getCurrentUser();
        hasPermission = this.getLocationPermissions();
        this.props.navigation.setParams({ tabBarVisible: this.state.loggedIn });
        if (hasPermission) {
            Geolocation.getCurrentPosition(
                (position) => {
                    this.setState({
                        region: {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            latitudeDelta: 0.0462,
                            longitudeDelta: 0.0261,
                        },
                    });
                    console.log(position);
                },
                (error) => {
                    // See error code charts below.
                    console.log(error.code, error.message);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        }
    }

    componentDidUpdate(prevProps) {
        let navState = this.props.navigation.state.params;
        let prevState = prevProps.navigation.state.params;
        //check to prevent infinite looping
        if ("loggedIn" in navState && navState.loggedIn !== prevState.loggedIn) {
            this.setState({ loggedIn: navState.loggedIn, user: navState.user });
        }
    }

    getLocationPermissions = async () =>{
        setTimeout(() => {
            const requestLocationPermission = async () => {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                    );
                    this.setState({ showUserLocation: granted === 'granted' });
                    return true;
                } catch (error) {
                    console.log("Request location permission error: ", error)
                    return false;
                }
            }
            if (Platform.OS == 'android') {
                requestLocationPermission();
            }
            if (Platform.OS == 'ios') {
                this.setState({ showUserLocation: true });
                return true;
            }
        }, 1000)
    }

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        return params;
    };

    signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            this.setState({ user: userInfo, loggedIn: true });
            this.props.navigation.setParams({ tabBarVisible: true });
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.warn("Cancelled");
            } else if (error.code === statusCodes.IN_PROGRESS) {
                console.warn("In Progress");
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                console.warn("Play Services Unavailable");
            } else {
                console.warn("Error", error);
            }
        }
    };

    isSignedIn = async () => {
        const isSignedIn = await GoogleSignin.isSignedIn();
        this.setState({ loggedIn: isSignedIn });
        if (isSignedIn){
            this.props.navigation.setParams({ tabBarVisible: true });
        }
    };

    getCurrentUser = async () => {
        const currentUser = await GoogleSignin.getCurrentUser();
        this.setState({ user: currentUser });
    };

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                {(this.state.loggedIn && this.state.user !== null) ? (
                    <View style={styles.container}>
                        <MapView
                            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                            style={styles.map}
                            region={this.state.region}
                        >
                            <UserLocationMarker showUserLocation={this.state.showUserLocation} />
                        </MapView>
                    </View>) :
                    (
                        <GoogleSigninButton
                            style={{ width: 192, height: 48 }}
                            size={GoogleSigninButton.Size.Wide}
                            color={GoogleSigninButton.Color.Light}
                            onPress={this.signIn}
                            disabled={this.state.isSigninInProgress}
                        />
                    )
                }
            </View>
        );
    }
}