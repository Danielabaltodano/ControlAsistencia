import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Button, Alert } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, getDocs } from "firebase/firestore";
import { BarChart, PieChart } from 'react-native-chart-kit';
import { captureRef } from 'react-native-view-shot';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const screenWidth = Dimensions.get("window").width;

const StatisticsScreen = () => {
  const [totalEmpleados, setTotalEmpleados] = useState(0);
  const [presentes, setPresentes] = useState(0);
  const [ausentes, setAusentes] = useState(0);
  const [horasPromedio, setHorasPromedio] = useState(0);

  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);

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

  const generateTextPDF = async (title, content) => {
    try {
      const htmlContent = `
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; text-align: center; }
            h1 { font-size: 24px; margin-bottom: 20px; }
            p { font-size: 18px; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <p>${content}</p>
        </body>
        </html>
      `;

      const { uri: pdfUri } = await Print.printToFileAsync({ html: htmlContent });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(pdfUri);
      } else {
        Alert.alert('PDF Generado', `Archivo PDF creado en ${pdfUri}`);
      }
    } catch (error) {
      console.error('Error al generar PDF:', error);
      Alert.alert('Error', 'No se pudo generar el PDF.');
    }
  };

  const generatePDF = async (chartRef, title) => {
    try {
      const uri = await captureRef(chartRef.current, {
        format: 'png',
        quality: 1,
        result: 'data-uri',
      });

      const htmlContent = `
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; text-align: center; }
            img { max-width: 100%; height: auto; }
            h1 { font-size: 24px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <img src="${uri}" />
        </body>
        </html>
      `;

      const { uri: pdfUri } = await Print.printToFileAsync({ html: htmlContent });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(pdfUri);
      } else {
        Alert.alert('PDF Generado', `Archivo PDF creado en ${pdfUri}`);
      }
    } catch (error) {
      console.error('Error al generar PDF:', error);
      Alert.alert('Error', 'No se pudo generar el PDF.');
    }
  };

  const buttonColor = "#547ed5"; // Define el color celeste clarito

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Estadísticas de Asistencia</Text>
  
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Asistencia General</Text>
        <View ref={barChartRef} collapsable={false}>
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
        <View style={styles.buttonContainer}>
          <Button
            title="Generar PDF del Gráfico de Asistencia"
            onPress={() => generatePDF(barChartRef, "Gráfico de Asistencia General")}
            color={buttonColor} // Usa el color celeste claro
          />
        </View>
      </View>
  
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Distribución de Asistencia</Text>
        <View ref={pieChartRef} collapsable={false}>
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
        <View style={styles.buttonContainer}>
          <Button
            title="Generar PDF del Gráfico de Distribución"
            onPress={() => generatePDF(pieChartRef, "Gráfico de Distribución de Asistencia")}
            color={buttonColor} // Usa el color celeste claro
          />
        </View>
      </View>
  
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Horas Promedio Trabajadas</Text>
        <Text style={styles.statsValue}>{horasPromedio} hrs</Text>
        <View style={styles.buttonContainer}>
          <Button
            title="Generar PDF de Horas Promedio"
            onPress={() => generateTextPDF("Horas Promedio Trabajadas", `${horasPromedio} hrs`)}
            color={buttonColor} // Usa el color celeste claro
          />
        </View>
      </View>
  
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Total de Empleados</Text>
        <Text style={styles.statsValue}>{totalEmpleados}</Text>
        <View style={styles.buttonContainer}>
          <Button
            title="Generar PDF de Total de Empleados"
            onPress={() => generateTextPDF("Total de Empleados", `Total: ${totalEmpleados} empleados`)}
            color={buttonColor} // Usa el color celeste claro
          />
        </View>
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
  buttonContainer: {
    marginTop: 15,
    alignSelf: 'stretch',
    paddingHorizontal: 20,
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
