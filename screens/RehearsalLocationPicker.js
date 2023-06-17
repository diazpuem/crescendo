import { Image, KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Text, TextInput } from 'react-native-paper';
import { useContext, useEffect, useRef, useState } from 'react';

import { Button } from 'react-native-paper';
import CustomClickableIcon from '../components/CustomClickableIcon';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Ionicons } from '@expo/vector-icons';
import { MAPS_KEY } from '../api/maps/MapsKey';
import { RehearsalContext } from '../context/RehearsalContext';
import { getAddressWithFetch } from '../api/maps/MapsServer';

export default function RehearsalLocationPicker({ navigation, route}) {
  const rehearsalContext = useContext(RehearsalContext);
  const [lockedMode, setLockedMode] = useState(false);
  const latitudeDelta = 0.025;
  const longitudeDelta = 0.025;
  const mapRef = useRef(null);
  let searchTextRef;
  const [state, setState] = useState({
    region: {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    },
    listViewDisplayed: true,
    address: "",
    showAddress: false,
    search: "",
    currentLat: "",
    currentLng: "",
    forceRefresh: 0,
  })

  useEffect(() => {
    navigation.getParent().setOptions({
      headerRight: () => (
        <CustomClickableIcon
            icon="arrow-back"
            onPress={() => navigation.goBack()}
            size={24}
            style={{ color: "#0041C3" , marginRight: 10 }}
        />
      ),
    });
  });

  useEffect(() => {
    if (route.params?.location){
      updateStateObject({region: route.params.location.coordinates ,address: route.params.location.address});
      setLockedMode(true);
    } else {
      setLockedMode(false);
    }
  }, [route.params?.location])

  const updateStateObject = (vals) => {
    setState({
      ...state,
      ...vals,
    });
  };

  goToInitialLocation = (region) => {
    let initialRegion = Object.assign({}, region);
    initialRegion["latitudeDelta"] = 0.005;
    initialRegion["longitudeDelta"] = 0.005;
    mapRef.current.animateToRegion(initialRegion, 2000);
  };

  onRegionChange = (region) => {
    getCurrentAddress(region);
  };

  getCurrentAddress = (region) => {
    getAddressWithFetch(region.latitude, region.longitude, (response) => {
        updateStateObject({ 
          region: region, 
          forceRefresh: Math.floor(Math.random() * 100),
          address: JSON.stringify(response.results[0].formatted_address).replace(/"/g, "")
        });
    })
  }

  saveLocation = () => {
    rehearsalContext.setRehearsalState({
      location: {
        addressName: state.address,
        coordinates: state.region
      }
    });
    navigation.navigate("AddRehearsal");
  }

   return (
    <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          ref={mapRef}
          onMapReady={() => goToInitialLocation(state.region)}
          style={styles.map}
          initialRegion={state.region}
          onRegionChangeComplete={onRegionChange}
          showsUserLocation={true}
          loadingEnabled={true}
        > 
          <Marker draggable coordinate={state.region}>
            <Image 
              source ={require("../assets/drum-set.png")} 
              style={{width: 50, height: 50}} 
              resizeMode="contain" 
            />
          </Marker>
        
        </MapView>
        <View style={styles.panel}>
          <View style={[styles.panelHeader, state.listViewDisplayed? styles.panelFill:styles.panel]}>  
            <GooglePlacesAutocomplete
              currentLocation={false}
              enableHighAccuracyLocation={true}
              ref={(c) => (searchTextRef = c)}
              placeholder="Search for a location"
              minLength={2}
              autoFocus={false}
              returnKeyType={"search"}
              listViewDisplayed={state.listViewDisplayed}
              fetchDetails={true}
              renderDescription={(row) => row.description}
              enablePoweredByContainer={false}
              listUnderlayColor="lightgrey"
              onPress={(data, details) => {
                const region = {
                  latitudeDelta,
                  longitudeDelta,
                  latitude: details.geometry.location.lat,
                  longitude:details.geometry.location.lng,
                }
                goToInitialLocation(region);
                updateStateObject({
                  listViewDisplayed: false,
                  address: data.description,
                  currentLat: details.geometry.location.lat,
                  currentLng: details.geometry.location.lng,
                  region: region,
                });
                searchTextRef?.setAddressText("");
              }}
              textInputProps={{
                onChangeText: (text) => {
                    updateStateObject({listViewDisplayed: !lockedMode});
                  },
              }}
              getDefaultValue={() => {
                  return ""; // text input default value
              }}
              query={{
                  key: MAPS_KEY,
                  language: "en", // language of the results
                  components: "country:us",
                  }}
              styles={{
                  description: {
                      color: "black",
                      fontSize: 12,
                  },
              predefinedPlacesDescription: {
                  color: "black",
                  },
              listView: {
                  position: "absolute",
                  marginTop: 44,
                  backgroundColor:"white",
                  borderBottomEndRadius: 15,
                  elevation:2,},}}
              nearbyPlacesAPI="GooglePlacesSearch"
              GooglePlacesSearchQuery={{
                  rankby: "distance",
                  types: "building",}}
              filterReverseGeocodingByTypes={[
                  "locality","administrative_area_level_3",]} 
              debounce={200}
            />
          </View>
        </View>
        <KeyboardAvoidingView style={styles.footer}>
          <View style={{ flexDirection: "row", margin: 10 , alignItems: 'center'}}>
            <Ionicons 
              name="ios-home"
              size={24}
              color="#DC2B6B"
              style={{
                  padding: 10,
              }}
            />
            <Text variant="titleMedium" style={styles.addressText}>Address</Text>
          </View>
          <TextInput
            multiline={true}
            style={{
                marginBottom: 5,
                width: "90%",
                minHeight: 70,
                alignSelf: "center",
                borderColor: "lightgrey",
                borderWidth: 1.5,
                fontSize: 12,
                borderRadius: 5,
                flex: 0.5,
                alignContent: "flex-start",
                textAlignVertical: "top",
                }}
            onChangeText={(text) => updateStateObject({ address: text })}
            value={state.address}
            disabled = {lockedMode}
          />
          <Button
            style={styles.button}
            mode="elevated"
            onPress={() => saveLocation()}
            disabled= {lockedMode}
          >
            Save
          </Button>
        </KeyboardAvoidingView>
    </View>
   );
}

const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      flex: 1,
    },
    map: {
      flex:1
    },
    button:{
      margin: 8
    },  
    markerFixed: {
      left: 0.5,
      marginLeft: -24,
      marginTop: -48,
      position: "absolute",
      top: "50%",
    },
    addressText: {
      color: "black",
      margin: 3,
    },
    footer: {
      backgroundColor: "white",
      bottom: 20,
      position: "absolute",
      width: "100%",
      height: "30%",
    },
    panelFill: {
     position: "absolute",
     top: 0,
     alignSelf: "stretch",
     right: 0,
     left: 0,
    },
    panel: {
     position: "absolute",
     top: 0,
     alignSelf: "stretch",
     right: 0,
     left: 0,
     flex: 1,
    },

});