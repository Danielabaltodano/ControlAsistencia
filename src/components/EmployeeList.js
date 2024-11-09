// src/components/EmployeeList.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet, Image } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, onSnapshot } from "firebase/firestore";

const EmployeeList = ({ navigation }) => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Empleados"), (snapshot) => {
      const employeesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEmployees(employeesData);
    });

    // Limpia la suscripción cuando el componente se desmonta
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={employees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.employeeItem} onPress={() => navigation.navigate('EmployeeDetails', { employeeId: item.id })}>
            {item.fotoPerfil ? (
              <Image source={{ uri: item.fotoPerfil }} style={styles.image} />
            ) : (
              <View style={styles.placeholderImage}>
                <Text>Sin Imagen</Text>
              </View>
            )}
            <View style={styles.textContainer}>
              <Text style={styles.name}>{item.nombre}</Text>
              <Text style={styles.status}>Estado: {item.estadoAsistencia}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <Button title="Agregar Nuevo Empleado" onPress={() => navigation.navigate('AddEmployee')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  employeeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  placeholderImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 14,
    color: '#555',
  },
});

export default EmployeeList;
