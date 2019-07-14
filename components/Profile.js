import React from 'react';
import { StyleSheet, Platform, Image, Text, Button, View, ScrollView, YellowBox } from 'react-native';
import { GoogleSignin } from 'react-native-google-signin';
import firebase from 'react-native-firebase';
export default class Profile extends React.Component {
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
    }

    getCurrentUser = async () => {
        const currentUser = await GoogleSignin.getCurrentUser();
        console.warn(currentUser);
        this.setState({ user: currentUser });
        if (currentUser == null) {
            this.setState({ loggedIn: false });
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
                    onPress={() => navigate('Home', this.state)}
                />
            </View>
        );
    }
}