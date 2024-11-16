import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, addDoc, Timestamp, query, where, getDocs } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import InputField from '../components/InputField';
import { Picker } from '@react-native-picker/picker';

const AddEmployeeScreen = ({ navigation }) => {
  const [empleadoId, setEmpleadoId] = useState('');
  const [estadoAsistencia, setEstadoAsistencia] = useState('Ausente');
  const [horasTrabajadas, setHorasTrabajadas] = useState('');
  const [nombre, setNombre] = useState('');
  const [puesto, setPuesto] = useState('');
  const [imageUri, setImageUri] = useState(null);

  // Función para seleccionar imagen
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

  // Verificación de ID único
  const verificarIdUnico = async () => {
    const empleadoQuery = query(collection(db, "Empleados"), where("empleadoId", "==", Number(empleadoId)));
    const querySnapshot = await getDocs(empleadoQuery);
    return querySnapshot.empty;
  };

  // Función para guardar datos en Firestore con URI local de la imagen
  const handleAddEmployee = async () => {
    if (!empleadoId || !nombre || !puesto) {
      Alert.alert("Error", "Por favor, complete todos los campos requeridos.");
      return;
    }

    const idUnico = await verificarIdUnico();
    if (!idUnico) {
      Alert.alert("Error", "El ID del empleado ya existe. Por favor, use un ID diferente.");
      return;
    }

    try {
      await addDoc(collection(db, "Empleados"), {
        empleadoId: Number(empleadoId),
        estadoAsistencia,
        horasTrabajadas: Number(horasTrabajadas),
        nombre,
        puesto,
        fotoPerfil: imageUri,
        fechaRegistro: Timestamp.now(),
      });

      Alert.alert("Éxito", "Empleado guardado exitosamente");
      navigation.goBack();
    } catch (error) {
      console.error("Error al guardar empleado: ", error);
      Alert.alert("Error", "Hubo un problema al guardar el empleado.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Agregar Nuevo Empleado</Text>

        <TouchableOpacity onPress={seleccionarImagen} style={styles.imageContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : (
            <Text style={styles.imageText}>Seleccionar Imagen</Text>
          )}
        </TouchableOpacity>

        <InputField label="ID del Empleado" value={empleadoId} onChangeText={setEmpleadoId} keyboardType="numeric" />

        <Text style={styles.label}>Estado de Asistencia:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={estadoAsistencia}
            onValueChange={(itemValue) => setEstadoAsistencia(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Ausente" value="Ausente" />
            <Picker.Item label="Presente" value="Presente" />
          </Picker>
        </View>

        <InputField label="Horas Trabajadas" value={horasTrabajadas} onChangeText={setHorasTrabajadas} keyboardType="numeric" />
        <InputField label="Nombre" value={nombre} onChangeText={setNombre} />
        <InputField label="Puesto" value={puesto} onChangeText={setPuesto} />

        <TouchableOpacity style={styles.addButton} onPress={handleAddEmployee}>
          <Text style={styles.addButtonText}>Guardar Empleado</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: {
    padding: 20,
    backgroundColor: '#F5F7FA',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  imageContainer: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 60,
    borderColor: '#9CA3AF',
    borderWidth: 1,
  },
  imageText: {
    color: '#6B7280',
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 15,
    backgroundColor: '#FFF',
    height: 55, // Ajusta la altura del contenedor para centrar el Picker
    justifyContent: 'center', // Centra verticalmente el Picker
  },
  picker: {
    height: '100%', // Asegura que el Picker ocupe toda la altura del contenedor
    color: '#374151',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#4B5563',
    marginTop: 10,
  },
});

export default AddEmployeeScreen;
