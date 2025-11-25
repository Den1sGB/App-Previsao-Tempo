import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Image, 
  Keyboard 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// --- CONFIGURAÇÃO DA API ---
const API_KEY = '2521c8895d64ab8823b1e2c5babb833c'; 

export default function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchWeather = async () => {
    if (city.trim() === '') {
      setErrorMsg('Por favor, digite uma cidade.');
      return;
    }

    setLoading(true);
    setWeatherData(null);
    setErrorMsg(null);
    Keyboard.dismiss(); 

    try {
      // 1. Busca as coordenadas geográficas (Latitude/Longitude)
      // Utilizamos encodeURIComponent para garantir suporte a acentos e espaços
      let searchUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`;
      
      let geoResponse = await fetch(searchUrl);
      let geoData = await geoResponse.json();

      // 2. Lógica de Fallback (Tentativa secundária)
      // Se a busca direta falhar e o usuário não especificou o país, tenta adicionar ", BR" automaticamente.
      // Isso ajuda caso a API precise do país para achar a cidade, mas a dica visual focará no Estado.
      if (!geoData || geoData.length === 0) {
        if (!city.toUpperCase().includes('BR')) {
           const cityWithCountry = `${city}, BR`;
           searchUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityWithCountry)}&limit=1&appid=${API_KEY}`;
           geoResponse = await fetch(searchUrl);
           geoData = await geoResponse.json();
        }
      }

      // Verifica se a cidade foi encontrada após as tentativas
      if (!geoData || geoData.length === 0) {
        setErrorMsg('Cidade não encontrada. Tente: Nome, Estado (ex: Maricá, RJ)');
        setLoading(false);
        return;
      }

      // Extrai os dados da primeira localização encontrada
      const location = geoData[0];
      const { lat, lon, name, state, country } = location;

      // 3. Busca os dados climáticos atuais usando as coordenadas obtidas
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${API_KEY}`
      );
      const weatherJson = await weatherResponse.json();

      if (weatherResponse.ok) {
        setWeatherData({
          ...weatherJson,
          foundName: name, 
          foundState: state, 
          foundCountry: country 
        });
      } else {
        setErrorMsg('Erro ao obter dados meteorológicos.');
      }

    } catch (error) {
      setErrorMsg('Falha na conexão com o servidor.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Previsão do Tempo</Text>
        <MaterialCommunityIcons name="weather-partly-cloudy" size={40} color="#fff" />
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite: Cidade, Estado (ex: Maricá, RJ)"
          placeholderTextColor="#aaa"
          value={city}
          onChangeText={setCity}
        />
        <TouchableOpacity style={styles.button} onPress={fetchWeather}>
          <MaterialCommunityIcons name="magnify" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {errorMsg && (
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle" size={24} color="#ff4444" />
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00Aaff" />
          <Text style={styles.loadingText}>Localizando cidade...</Text>
        </View>
      )}

      {weatherData && (
        <View style={styles.resultContainer}>
          <Text style={styles.cityName}>
            {weatherData.foundName}
          </Text>
          <Text style={styles.stateName}>
            {weatherData.foundState ? `${weatherData.foundState}, ` : ''}{weatherData.foundCountry}
          </Text>
          
          <Image
            style={styles.weatherIcon}
            resizeMode="contain" 
            source={{
              uri: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`,
            }}
          />

          <Text style={styles.temperature}>
            {Math.round(weatherData.main.temp)}°C
          </Text>

          <Text style={styles.description}>
            {weatherData.weather[0].description}
          </Text>

          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="water-percent" size={20} color="#ccc" />
              <Text style={styles.detailText}>Umidade: {weatherData.main.humidity}%</Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="weather-windy" size={20} color="#ccc" />
              <Text style={styles.detailText}>Vento: {weatherData.wind.speed} m/s</Text>
            </View>
          </View>
        </View>
      )}
      
      {!weatherData && !loading && !errorMsg && (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>
            Dica: Se houver cidades com o mesmo nome, diferencie pelo estado. Ex: "Maricá, RJ"
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e', 
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 15, 
  },
  searchContainer: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#333',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 5,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#444',
  },
  input: {
    flex: 1,
    height: 40,
    color: '#fff',
    fontSize: 16,
  },
  button: {
    padding: 10,
    backgroundColor: '#00Aaff',
    borderRadius: 20,
    marginLeft: 10,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 68, 68, 0.2)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  errorText: {
    color: '#ff4444',
    marginLeft: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  loadingContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  loadingText: {
    color: '#ccc',
    marginTop: 10,
  },
  resultContainer: {
    alignItems: 'center',
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    marginTop: 20,
  },
  cityName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  stateName: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 5,
    textAlign: 'center',
  },
  weatherIcon: {
    width: 150,
    height: 150,
  },
  temperature: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#fff',
  },
  description: {
    fontSize: 20,
    color: '#bbb',
    textTransform: 'capitalize', 
    marginBottom: 20,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    color: '#ccc',
    marginLeft: 5,
    fontSize: 14,
  },
  placeholderContainer: {
    marginTop: 50,
    opacity: 0.5,
    paddingHorizontal: 20,
  },
  placeholderText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  }
});