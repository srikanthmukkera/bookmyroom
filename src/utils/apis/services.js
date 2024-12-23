import axios from 'axios';
import API_URL from '../data';

export const apiCallService = (url = '', token = '', method = '', inpobj) => {
  const data = inpobj;
  const header = {
    'content-type': 'application/json',
    mode: 'no-cors',
    Authorization: `bearer ${token}`,
    device: 'mobile',
  };
  let baseURL = API_URL + url;
  // console.log('url hit at : ', baseURL, data);
  return new Promise((resolve, reject) => {
    let axiosInp = {
      method: method,
      url: baseURL,
      data: data,
      headers: header,
    };
    axios(axiosInp)
      .then(resp => {
        resolve(resp);
      })
      .catch(error => {
        // reject(error);
        console.log('ERROR at : ', baseURL, data, error);
      });
  });
};

export const generateImageUrls = async setImageUrls => {
  const accessKey = 'MHZtRDyWtM0sunjDGB4A3dz4_cj_wa4EEhfuQL9Rf1s'; // Replace with your Unsplash access key
  const url = 'https://api.unsplash.com/search/photos?page=3&query=hotel,room';

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
      },
    });

    const images = response.data.results.map(item => item.urls.small);
    setImageUrls(images);
  } catch (error) {
    console.error('Error fetching images:', error);
  } finally {
  }
};
