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
      }
    ]
  };

  const pieChartData = [
    {
      name: "Presentes",
      population: presentes,
      color: "rgba(0, 128, 0, 0.8)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Ausentes",
      population: ausentes,
      color: "rgba(255, 0, 0, 0.8)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    }
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Estadísticas de Asistencia</Text>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Asistencia de Empleados</Text>
        <BarChart
          data={barChartData}
          width={screenWidth * 0.9}
          height={220}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#6a11cb",
            backgroundGradientTo: "#2575fc",
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

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Horas Promedio Trabajadas</Text>
        <Text style={styles.statValue}>{horasPromedio} hrs</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  chartContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  chart: {
    borderRadius: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default StatisticsScreen;
