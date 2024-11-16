// src/components/EmployeeDetails.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
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
    <ScrollView contentContainerStyle={styles.container}>
      {employee ? (
        <>
          {imageUri && (
            <TouchableOpacity onPress={isEditing ? seleccionarImagen : null}>
              <Image source={{ uri: imageUri }} style={styles.image} />
            </TouchableOpacity>
          )}

          <Text style={styles.label}>ID del Empleado:</Text>
          <TextInput
            style={[styles.input, { backgroundColor: '#f0f0f0' }]}
            value={employee.empleadoId.toString()}
            editable={false}
          />

          <Text style={styles.label}>Nombre:</Text>
          <TextInput
            style={styles.input}
            value={employee.nombre}
            onChangeText={(text) => setEmployee({ ...employee, nombre: text })}
            editable={isEditing}
          />

          <Text style={styles.label}>Estado de Asistencia:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={employee.estadoAsistencia}
              onValueChange={(itemValue) => setEmployee({ ...employee, estadoAsistencia: itemValue })}
              enabled={isEditing}
              style={styles.picker}
            >
              <Picker.Item label="Ausente" value="Ausente" />
              <Picker.Item label="Presente" value="Presente" />
            </Picker>
          </View>

          <Text style={styles.label}>Horas Trabajadas:</Text>
          <TextInput
            style={styles.input}
            value={employee.horasTrabajadas.toString()}
            onChangeText={(text) => setEmployee({ ...employee, horasTrabajadas: parseInt(text) })}
            editable={isEditing}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Puesto:</Text>
          <TextInput
            style={styles.input}
            value={employee.puesto}
            onChangeText={(text) => setEmployee({ ...employee, puesto: text })}
            editable={isEditing}
          />

          {isEditing ? (
            <TouchableOpacity style={styles.saveButton} onPress={updateEmployee}>
              <Text style={styles.buttonText}>Guardar Cambios</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.editButton} onPress={enableEditing}>
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.deleteButton} onPress={deleteEmployee}>
            <Text style={styles.buttonText}>Eliminar Empleado</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text>Cargando...</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  editButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EmployeeDetails;
