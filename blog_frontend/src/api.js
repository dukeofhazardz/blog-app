import axios from "axios";
import Cookies from 'js-cookie';

// Function to get session ID from cookies
const getCsrfToken = () => {
    return Cookies.get('csrftoken');
  };


axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.headers.common['X-CSRFToken'] = getCsrfToken();
axios.defaults.withCredentials = true;

const api = axios.create({
    baseURL: "http://127.0.0.1:8000"
});

export default api;