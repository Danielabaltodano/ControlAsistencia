// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MenuScreen from './src/components/MenuScreen';
import EmployeeList from './src/components/EmployeeList';
import EmployeeDetails from './src/components/EmployeeDetails';
import AddEmployee from './src/components/AddEmployee';
import StatisticsScreen from './src/components/StatisticsScreen'; // Importa la pantalla de estadísticas

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Menu" component={MenuScreen} options={{ title: 'Menú Principal' }} />
        <Stack.Screen name="EmployeeList" component={EmployeeList} options={{ title: 'Lista de Empleados' }} />
        <Stack.Screen name="EmployeeDetails" component={EmployeeDetails} options={{ title: 'Detalles del Empleado' }} />
        <Stack.Screen name="AddEmployee" component={AddEmployee} options={{ title: 'Agregar Empleado' }} />
        <Stack.Screen name="Statistics" component={StatisticsScreen} options={{ title: 'Estadísticas de Asistencia' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
