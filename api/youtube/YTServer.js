import { YT_KEY } from "./YTkey";
import axios from "axios";

const YTServer = axios.create({
    baseURL: 'https://www.googleapis.com/youtube/v3/search',
  });
  
// adds token, if we have one to all requests.
YTServer.interceptors.request.use(
  async (config) => {
    // called when request is made.
    config.headers.Accept = 'application/json';
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

export const getVideos = async (query, callback) => {
  await YTServer.get(`?key=${YT_KEY}&part=snippet&q=${query}&maxResults=15&type=video`)
    .then((response) => {
        callback(response.data);
    }).catch((error)=>{
        console.log(error);
        alert(error.message);
    });
};

export default YTServer;
