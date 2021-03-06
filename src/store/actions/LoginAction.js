import axios from "axios";
import moment from "moment";
/**
 * Send login request to backend api and set auth token
 * @param {*} userCreds
 */
export const authenticateAndSetToken = async userCreds => {
  return new Promise((resolve, reject) => {
    // send login request
    axios
      .post("/auth", {
        email: userCreds.email,
        password: userCreds.password
      })
      .then(response => {
        const authToken = response.data.token;
        const expireAt = response.data.expireAt;
        // set expiration date
        // return with error message if no token
        if (authToken && authToken != "") {
          // set axios authorization token
          resolve({
            authToken,
            expireAt
          });
        } else {
          reject(response.data.message);
        }
      })
      .catch(response => {
        reject(response);
      });
  });
};

/**
 * Register user using email and password
 * @param {*} userCreds
 */
export const registerUser = async userCreds => {
  return new Promise((resolve, reject) => {
    // send login request
    axios
      .post("/auth/signup", {
        email: userCreds.email,
        password: userCreds.password
      })
      .then(response => {
        if (response.error) {
          reject(response.data.message);
        } else {
          resolve(response.data.message);
        }
      })
      .catch(response => {
        reject(response);
      });
  });
};
