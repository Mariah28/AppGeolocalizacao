// useState: é um hook utilizado para gerenciar o estado em componentes funcionais
// do React.Ele permite que você adicione estado local a um componente, permitindo
// que o componente mantenha e atualize dinamicamente dados ao longo do tempo.

// useEffect: é um hook que permite realizar efeitos colaterais em componentes
// funcionais.Efeitos colaterais podem incluir, por exemplo, buscar dados de uma API,
// atualizar o DOM, ou inscrever / desinscrever eventos.

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';

const App = () => {
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão de localização não concedida', 'Por favor, conceda permissão de localização para obter a localização.');
        return;
      }

      let locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData);
    })();
  }, []);

  const buscarEndereco = async () => {
    if (cep.length !== 8) {
      Alert.alert('CEP inválido', 'Por favor, insira um CEP válido com 8 dígitos.');
      return;
    }

    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      setAddress(response.data);
    } catch (error) {
      Alert.alert('Erro ao buscar endereço', 'Por favor, verifique o CEP digitado.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Geolocalização</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.title}>Endereço</Text>
        <TextInput
          placeholder="Digite o CEP"
          placeholderTextColor="#ccc"
          value={cep}
          onChangeText={setCep}
          style={styles.input}
          keyboardType="numeric"
          maxLength={8}
        />
      </View>
      <Button title="Buscar Endereço" onPress={buscarEndereco} />
      {address && (
        <View style={styles.addressContainer}>
          <Text style={styles.text}>CEP: {address.cep}</Text>
          <Text style={styles.text}>Logradouro: {address.logradouro}</Text>
          <Text style={styles.text}>Bairro: {address.bairro}</Text>
          <Text style={styles.text}>Cidade: {address.localidade}</Text>
          <Text style={styles.text}>Estado: {address.uf}</Text>
        </View>
      )}
      {location && (
        <View style={styles.mapContainer}>
          <Text style={styles.title}>Sua Localização</Text>
          <Text style={styles.text}>Latitude: {location.coords.latitude}</Text>
          <Text style={styles.text}>Longitude: {location.coords.longitude}</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Sua Localização"
            />
          </MapView>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#07ac8b',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#fff',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    width: '100%',
    color: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20, 
    textAlign: 'center',
    color: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 20, 
  },
  text: {
    color: '#fff', 
    textAlign:'center',
  },
  addressContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  mapContainer: {
    width: '100%',
    height: 200, 
    marginTop: 20,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default App;
