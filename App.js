import React, { useReducer, useEffect } from 'react';
import Amplify from 'aws-amplify';
import config from './aws-exports';
import { SafeAreaView, View, StyleSheet, Text } from 'react-native';

import { withAuthenticator } from 'aws-amplify-react-native';
import { API, graphqlOperation } from 'aws-amplify';

import { listRestaurants } from './src/graphql/queries';

Amplify.configure(config);

const reducer = (currentState, newState) => {
  return { ...currentState, ...newState };
};

const App = () => {
  const [state, setState] = useReducer(reducer, {
    restaurants: []
  });

  useEffect(() => {
    const getRestaurants = async () => {
      try {
        const restaurantData = await API.graphql(
          graphqlOperation(listRestaurants)
        );
        console.log(restaurantData);

        setState({ restaurants: restaurantData.data.listRestaurants.items });
      } catch (err) {
        console.log(err);
      }
    };

    getRestaurants();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {state.restaurants.map((restaurant, index) => (
        <View key={index} style={styles.item}>
          <Text style={styles.name}>{restaurant.name}</Text>
          <Text style={styles.description}>{restaurant.description}</Text>
          <Text style={styles.city}>{restaurant.city}</Text>
        </View>
      ))}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  item: { padding: 10 },
  name: { fontSize: 20 },
  description: { fontWeight: '600', marginTop: 4, color: 'rgba(0, 0, 0, .5)' },
  city: { marginTop: 4 }
});

export default withAuthenticator(App, { includeGreetings: true });
