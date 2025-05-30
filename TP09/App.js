import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";

import axios from "axios";

const API_KEY = "46dbf7ec";

const App = () => {
  const [imdbId, setImdbId] = useState("tt0133093");
  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Funcion que simula esperar 'n' milisegundos
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const fetchMovieData = async () => {
    if (!imdbId.trim()) {
      Alert.alert("Error", "Por favor, ingresa un ID de IMDb válido.");
      return;
    }

    setLoading(true);
    setMovieData(null);

    try {
      const response = await axios.get(`http://www.omdbapi.com/`, {
        params: {
          i: imdbId,
          apikey: API_KEY,
        },
        timeout: 5000, // 5 segundos
      });

      await sleep(3000);

      console.log("Status:", response.status);

      if (response.data.Response === "True") {
        setMovieData(response.data);
      } else {
        Alert.alert(
          "No encontrado",
          response.data.Error || "Película no encontrada"
        );
      }
    } catch (error) {
      console.log("Error: ", error);
      if (error.code === "ECONNABORTED") {
        Alert.alert(
          "Timeout",
          "La solicitud ha tardado demasiado en responder."
        );
      } else {
        Alert.alert("Error", "Hubo un problema al consultar la API.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Buscar Película por IMDb ID</Text>

        <TextInput
          style={styles.input}
          placeholder="Ej: tt0111161"
          value={imdbId}
          onChangeText={setImdbId}
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.button} onPress={fetchMovieData}>
          <Text style={styles.buttonText}>Buscar</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator size="large" color="#0000ff" />}

        {movieData && (
          <View style={styles.result}>
            <Image
              source={{ uri: movieData.Poster }}
              style={styles.poster}
              resizeMode="contain"
            />
            <Text style={styles.movieTitle}>{movieData.Title}</Text>
            {movieData.Ratings && (
              <View>
                {movieData.Ratings.map((rating, index) => (
                  <Text key={index} style={styles.ratingItem}>
                    - {rating.Source} : {rating.Value}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    marginTop: 16,
    marginBottom: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  result: {
    alignItems: "center",
    marginTop: 16,
  },
  poster: {
    width: "100%",
    height: 400,
    marginBottom: 12,
    borderRadius: 8,
  },
  movieTitle: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
  },
  ratingItem: {
    fontSize: 16,
    marginVertical: 2,
  },
});

export default App;
