import { FlatList, StyleSheet, Text, Image, View, ActivityIndicator, ViewToken } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSharedValue } from 'react-native-reanimated';

const ListItem = () => {
  const [data, setData] = useState<any[]>([]);  // État pour stocker les données JSON
  const [loading, setLoading] = useState<boolean>(true);  // État pour gérer le chargement
  const [error, setError] = useState<string | null>(null);  // État pour gérer les erreurs
  const viewableItems = useSharedValue<ViewToken[]>([]);

  // Utilisation de useEffect pour récupérer les données lors du montage du composant
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.pexels.com/v1/search?query=food&per_page=10', {
          headers: {
            Authorization: 'V09rDPimycG9trmshBDIdwQbcZwzHW6eqwasCEnLI4yYaTBPyqIcRnhK', // Remplacez par votre clé API Pexels
          },
        });
  
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
  
        const json = await response.json();  // Parse la réponse JSON
        console.log("Data received:", json);  // Log des données reçues
        setData(json.photos);  // Mettre les photos dans l'état
      } catch (error) {
        console.error("Error fetching data:", error);  // Log des erreurs
        setError(error.message || 'Failed to fetch data');
      } finally {
        setLoading(false);  // Arrêter le chargement une fois la requête terminée
      }
    };
  
    fetchData();
  }, []);  // Le tableau vide [] signifie que cet effet se déclenche uniquement au montage
  

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }
  
  // Log de données pour voir ce qui est passé à la FlatList
  // console.log("Rendering data:", data);
  
  return (
    <View style={styles.container}>
      <FlatList
        data={data}  // Utilisation des photos récupérées
        keyExtractor={(item) => item.id.toString()}  // Utilisation de l'ID de chaque photo comme clé unique
        contentContainerStyle={{ paddingTop: 40 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Image source={{ uri: item.src.medium }} style={styles.image} />
            <Text style={styles.photographerName}>{item.photographer}</Text>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eb529a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItem: {
    height: 300,
    width: 400,
    backgroundColor: '#fff',
    alignSelf: 'center',
    borderRadius: 15,
    marginTop: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  photographerName: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  }
});

export default ListItem