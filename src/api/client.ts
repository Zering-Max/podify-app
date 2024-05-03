import {Keys, getToAsyncStorage} from '@utils/asyncStorage';
import axios, {CreateAxiosDefaults} from 'axios';

const baseURL = 'https://podify-server-ulby.onrender.com';

// 'http://10.0.2.2:8887';

const client = axios.create({
  baseURL,
});

type headers = CreateAxiosDefaults<any>['headers'];

export const getClient = async (headers?: headers) => {
  const token = await getToAsyncStorage(Keys.AUTH_TOKEN);

  if (!token) {
    return axios.create({
      baseURL,
    });
  }

  const defaultHeaders = {
    Authorization: 'Bearer ' + token,
    ...headers,
  };

  return axios.create({baseURL, headers: defaultHeaders});
};

export default client;
