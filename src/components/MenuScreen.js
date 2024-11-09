// src/components/MenuScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const MenuScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menú Principal</Text>
      <Button title="Ver Lista de Empleados" onPress={() => navigation.navigate('EmployeeList')} />
      <Button title="Agregar Nuevo Empleado" onPress={() => navigation.navigate('AddEmployee')} />
      <Button title="Ver Estadísticas" onPress={() => navigation.navigate('Statistics')} /> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default MenuScreen;
