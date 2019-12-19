import React, { useEffect, useReducer } from 'react';
import Amplify from 'aws-amplify';
import config from './aws-exports';
import { StyleSheet, Text, View } from 'react-native';
import { withAuthenticator } from 'aws-amplify-react-native';
import { Auth } from 'aws-amplify';
import { API, graphqlOperation } from 'aws-amplify';
// import the GraphQL query
import { listRestaurants } from './src/graphql/queries';

Amplify.configure(config);

const reducer = (currentState, newState) => {
  return { ...currentState, ...newState };
};

function App(props) {
  const [{ username, password, email, restaurants }, setState] = useReducer(
    reducer,
    {
      username: '',
      password: '',
      email: '',
      restaurants: []
    }
  );

  useEffect(() => {
    const getRestaurants = async () => {
      const restaurantData = await API.graphql(
        graphqlOperation(listRestaurants)
      );

      setState({ restaurants: restaurantData.data.listRestaurants.items });
    };

    getRestaurants();
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const user = await Auth.currentAuthenticatedUser();
      console.log('user: ', user);
    };

    getUser();
  }, []);

  const onChangeText = (key, value) => {
    setState({ [key]: value });
  };

  const signUp = async () => {
    try {
      await Auth.signUp({ username, password, attributes: { email } });
    } catch (err) {
      console.log('error signing up...', err);
    }
  };

  const signOut = () => {
    Auth.signOut()
      .then(() => props.onStateChange('signedOut'))
      .catch(err => console.log('err: ', err));
  };

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Text onPress={signOut}>Sign Out</Text>
      {restaurants.map((restaurant, index) => (
        <View key={index} style={styles.item}>
          <Text style={styles.name}>{restaurant.name}</Text>
          <Text style={styles.description}>{restaurant.description}</Text>
          <Text style={styles.city}>{restaurant.city}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  item: { padding: 10 },
  name: { fontSize: 20 },
  description: { fontWeight: '600', marginTop: 4, color: 'rgba(0, 0, 0, .5)' },
  city: { marginTop: 4 }
});

export default withAuthenticator(App, {
  includeGreetings: true
});
