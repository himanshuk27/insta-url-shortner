import axios from "axios";

/**
 * Send new POST request to backend api
 * @param {*} data
 */
export const postRequest = async (payload, token) => {
  return new Promise((resolve, reject) => {
    axios
      .post(payload.url, payload.data, {
        headers: {
          Authorization: token
        }
      })
      .then(response => {
        if (response.data.error) {
          reject(response.data.message);
        } else {
          resolve(response);
        }
      })
      .catch(response => {
        reject(response);
      });
  });
};

/**
 * Send new GET request to backend api
 * @param {*} data
 */
export const getRequest = async (url, token) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: token
        }
      })
      .then(response => {
        resolve(response);
      })
      .catch(response => {
        reject(response);
      });
  });
};
