import { MAPS_KEY } from "./MapsKey";
import axios from "axios";

const MapsServer = axios.create({
    baseURL: 'https://maps.googleapis.com/maps/api/geocode/json',
  });

// AXIOS HAS SOME ISSUES WITH THIS URL AND SHOWED ME 404 
// AFTER DEEP RESEARCH, IT WAS AN AXIOS ISSUE SO I HAD TO USE ANOTHER LIBRARY
// I USED THE NATIVE ONE FETCH API
// adds token, if we have one to all requests.
MapsServer.interceptors.request.use(
  async (config) => {
    // called when request is made.
    config.headers.Accept = '*/*, application/json, text/plain';
    // const token = await AsyncStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (err) => {
    // called when error
    return Promise.reject(err);
  }
);

export const getAddressWithFetch = async (lat, lon, callback) => {
  fetch(`https://maps.googleapis.com/maps/api/geocode/json?key=${MAPS_KEY}&address=${lat},${lon}`, 
  {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then((response) => response.json())
  .then((response) => {
    callback(response);
  }).catch((error) => {
    console.error(error)
    });
  };


export default MapsServer;
