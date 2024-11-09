// src/components/EmployeeDetails.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';

const EmployeeDetails = ({ route, navigation }) => {
  const { employeeId } = route.params;
  const [employee, setEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      const docRef = doc(db, "Empleados", employeeId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setEmployee(docSnap.data());
        setImageUri(docSnap.data().fotoPerfil);
      }
    };
    fetchEmployee();
  }, []);

  const enableEditing = () => {
    setIsEditing(true);
  };

  const seleccionarImagen = async () => {
    let resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!resultado.canceled && resultado.assets && resultado.assets.length > 0) {
      setImageUri(resultado.assets[0].uri);
    }
  };

  const updateEmployee = async () => {
    try {
      const docRef = doc(db, "Empleados", employeeId);
      await updateDoc(docRef, {
        ...employee,
        fotoPerfil: imageUri,
      });

      Alert.alert("Éxito", "Empleado actualizado exitosamente");
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar empleado: ", error);
      Alert.alert("Error", "Hubo un problema al actualizar el empleado.");
    }
  };

  const deleteEmployee = async () => {
    try {
      const docRef = doc(db, "Empleados", employeeId);
      await deleteDoc(docRef);
      Alert.alert("Empleado Eliminado", "El empleado ha sido eliminado exitosamente.");
      navigation.goBack();
    } catch (error) {
      console.error("Error al eliminar empleado: ", error);
      Alert.alert("Error", "Hubo un problema al eliminar el empleado.");
    }
  };

  return (
    employee ? (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {imageUri && (
            <TouchableOpacity onPress={isEditing ? seleccionarImagen : null}>
              <Image source={{ uri: imageUri }} style={styles.image} />
            </TouchableOpacity>
          )}
          
          <Text style={styles.label}>ID del Empleado:</Text>
          <TextInput
            style={[styles.input, { backgroundColor: isEditing ? '#fff' : '#f0f0f0' }]}
            value={employee.empleadoId.toString()}
            editable={false}
          />
          
          <Text style={styles.label}>Nombre:</Text>
          <TextInput
            style={[styles.input, { backgroundColor: isEditing ? '#fff' : '#f0f0f0' }]}
            value={employee.nombre}
            onChangeText={(text) => setEmployee({ ...employee, nombre: text })}
            editable={isEditing}
          />
          
          <Text style={styles.label}>Estado de Asistencia:</Text>
          {isEditing ? (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={employee.estadoAsistencia}
                onValueChange={(itemValue) => setEmployee({ ...employee, estadoAsistencia: itemValue })}
                style={styles.picker}
              >
                <Picker.Item label="Ausente" value="Ausente" />
                <Picker.Item label="Presente" value="Presente" />
              </Picker>
            </View>
          ) : (
            <TextInput
              style={[styles.input, { backgroundColor: '#f0f0f0' }]}
              value={employee.estadoAsistencia}
              editable={false}
            />
          )}

          <Text style={styles.label}>Horas Trabajadas:</Text>
          <TextInput
            style={[styles.input, { backgroundColor: isEditing ? '#fff' : '#f0f0f0' }]}
            value={employee.horasTrabajadas ? employee.horasTrabajadas.toString() : ""}
            onChangeText={(text) => setEmployee({ ...employee, horasTrabajadas: text ? parseInt(text) : "" })}
            editable={isEditing}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Puesto:</Text>
          <TextInput
            style={[styles.input, { backgroundColor: isEditing ? '#fff' : '#f0f0f0' }]}
            value={employee.puesto}
            onChangeText={(text) => setEmployee({ ...employee, puesto: text })}
            editable={isEditing}
          />

          {isEditing ? (
            <Button title="Guardar Cambios" onPress={updateEmployee} />
          ) : (
            <Button title="Editar" onPress={enableEditing} />
          )}
          
          <Button title="Eliminar Empleado" onPress={deleteEmployee} color="red" />
        </View>
      </ScrollView>
    ) : <Text>Cargando...</Text>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 15,
  },
  picker: {
    height: 40,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 20,
  },
});

export default EmployeeDetails;
