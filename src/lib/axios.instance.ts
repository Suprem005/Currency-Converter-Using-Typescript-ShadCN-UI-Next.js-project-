import axios from 'axios';

const $axios = axios.create({
  baseURL: 'https://api.frankfurter.app',
});
export default $axios;
