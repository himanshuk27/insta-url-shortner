import { insertItem, dbConnect, findOne } from "./MongoDbClient";
import uuid from "uuid";
import { createJwtFromUser } from "./JWToken";

/**
 * Authenticate user via input email and password
 * @param {*} req
 */
export const authenticateUser = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      const email = req.body.email.toLowerCase();
      const password = req.body.password;
      const dbClient = await dbConnect("users");
      const user = await findOne({ email });

      // return if user not exists
      if (!user) {
        res.send({
          error: true,
          message: "Email id not exists",
          code: 417
        });
        res.end();
        resolve();
      }
      dbClient.close();

      if (password != user.password) {
        res.send({
          error: true,
          message: "Incorrect password",
          code: 403
        });
        res.end();
        resolve();
      }

      // generate jwt web token
      const token = createJwtFromUser(user);

      res.send({
        error: false,
        message: "Auth success",
        token: token.token,
        expireAt: token.expireAt,
        code: 200
      });
      res.end();
      resolve();
    } catch (e) {
      reject(e.message);
    }
  });
};

/**
 * User signup by input email and password
 * @param {*} req
 */
export const registerUser = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      const email = req.body.email.toLowerCase();
      const dbClient = await dbConnect("users");
      const query = await findOne({ email });

      // return if user already exists
      if (query) {
        res.send({
          error: true,
          message: "User already exists",
          code: 417
        });
        res.end();
        resolve();
      }

      // prepare user object
      const user = {
        _id: uuid.v4(),
        email,
        password: req.body.password
      };

      // insert user object
      await insertItem(user);
      // close connection
      dbClient.close();

      res.send({
        error: false,
        message: "Signup complete",
        code: 200
      });
      res.end();
      resolve();
    } catch (e) {
      reject({
        error: true,
        message: e.message,
        code: 417
      });
    }
  });
};
