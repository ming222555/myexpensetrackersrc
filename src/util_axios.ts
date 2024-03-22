import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function axiosGet<T>(url: string, payload?: any): Promise<T> {
  return axios
    .get<T>(url, payload)
    .then(response => response.data)
    .catch(function (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        /* console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        console.log("has error.response", error.message); */
        error.status = error.response.status;

        switch (error.status) {
          case 404:
            error.message = 'Url not found';
            break;
          case 401:
            error.message = 'Authentication error';
            break;
          case 403:
            error.message = 'Authorisation error';
            break;
          case 500:
            error.message = 'Internal server error';
            break;
          default:
            error.message =
              error.response.data.error || error.response.data.message || error.message || JSON.stringify(error.response.data);
            if (error.status === 400) {
              error.message = 'Application error. ' + error.message;
            }
        }
        console.log(
          'error',
          error.response.data.error || error.response.data.message || error.message || JSON.stringify(error.response.data),
        );
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
        error.message = 'The request was made but no response was received. Please check internet connection.';
        error.status = null;
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        error.status = null;
      }
      // console.log(error.config);
      throw error;
    });
}
