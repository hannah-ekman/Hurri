import React from 'react';
import { StyleSheet, Platform, Image, Text, Button, View, ScrollView, YellowBox } from 'react-native';
import { GoogleSignin } from 'react-native-google-signin';
import firebase from 'react-native-firebase';
import { withNavigationFocus } from "react-navigation";

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            loggedIn: false
        };
    }

    async componentDidMount() {
        GoogleSignin.configure();
        this.getCurrentUser();
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.navigation.state.params !== prevProps.navigation.state.params) {
            this.setState(this.props.navigation.state.params);
        }
        if (prevProps.isFocused !== this.props.isFocused) {
            this.getCurrentUser();
        }
    }

    getCurrentUser = async () => {
        const currentUser = await GoogleSignin.getCurrentUser();
        const isUserSignedIn = await GoogleSignin.isSignedIn();
        this.setState({ user: currentUser, loggedIn: isUserSignedIn });
        if (currentUser == null && isUserSignedIn) {
            try {
                const currentUser = await GoogleSignin.signInSilently();
                this.setState({ user: currentUser });
            } catch (error) {
                this.setState({ user: null });
            }
        }
    };

    signOut = async () => {
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            this.setState({ user: null, loggedIn: false }); // Remember to remove the user from your app's state as well
            this.props.navigation.setParams({ tabBarVisible: false });
            this.props.navigation.navigate('Home', this.state);
        } catch (error) {
            console.error(error);
        }
    };

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                {"user" in this.state && this.state.user !== null &&
                    <View>
                        <Text>{this.state.user.user.name}</Text>
                        <Button
                            onPress={this.signOut}
                            title="Sign Out"
                            color="#a5e6d1"
                            accessibilityLabel="Sign Out"
                        />
                    </View>
                }

                <Button
                    title="Home"
                    color="#a5e6d1"
                    onPress={() => navigate('Home')}
                />
            </View>
        );
    }
}

export default withNavigationFocus(Profile);