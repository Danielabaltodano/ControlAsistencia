// src/components/StatisticsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, getDocs } from "firebase/firestore";
import { BarChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get("window").width;

const StatisticsScreen = () => {
  const [totalEmpleados, setTotalEmpleados] = useState(0);
  const [presentes, setPresentes] = useState(0);
  const [ausentes, setAusentes] = useState(0);
  const [horasPromedio, setHorasPromedio] = useState(0);

  useEffect(() => {
    const fetchStatistics = async () => {
      const querySnapshot = await getDocs(collection(db, "Empleados"));
      const empleados = querySnapshot.docs.map(doc => doc.data());

      const total = empleados.length;
      const presentesCount = empleados.filter(emp => emp.estadoAsistencia === "Presente").length;
      const ausentesCount = empleados.filter(emp => emp.estadoAsistencia === "Ausente").length;
      const totalHoras = empleados.reduce((sum, emp) => sum + (emp.horasTrabajadas || 0), 0);
      const promedioHoras = total > 0 ? totalHoras / total : 0;

      setTotalEmpleados(total);
      setPresentes(presentesCount);
      setAusentes(ausentesCount);
      setHorasPromedio(promedioHoras.toFixed(2));
    };

    fetchStatistics();
  }, []);

  const barChartData = {
    labels: ["Presentes", "Ausentes"],
    datasets: [
      {
        data: [presentes, ausentes],
      },
    ],
  };

  const pieChartData = [
    {
      name: "Presentes",
      population: presentes,
      color: "rgba(40, 167, 69, 0.8)", // Verde
      legendFontColor: "#333",
      legendFontSize: 14,
    },
    {
      name: "Ausentes",
      population: ausentes,
      color: "rgba(220, 53, 69, 0.8)", // Rojo
      legendFontColor: "#333",
      legendFontSize: 14,
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Estadísticas de Asistencia</Text>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Asistencia General</Text>
        <BarChart
          data={barChartData}
          width={screenWidth * 0.9}
          height={220}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#3b82f6", // Azul suave
            backgroundGradientTo: "#2563eb",   // Azul profundo
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          style={styles.chart}
        />
      </View>


      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Distribución de Asistencia</Text>
        <PieChart
          data={pieChartData}
          width={screenWidth * 0.9}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Horas Promedio Trabajadas</Text>
        <Text style={styles.statsValue}>{horasPromedio} hrs</Text>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Total de Empleados</Text>
        <Text style={styles.statsValue}>{totalEmpleados}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  chartContainer: {
    marginVertical: 15,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  chart: {
    borderRadius: 8,
  },
  statsContainer: {
    marginVertical: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },
  statsTitle: {
    fontSize: 16,
    color: '#555',
    fontWeight: 'bold',
  },
  statsValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
});

export default StatisticsScreen;
