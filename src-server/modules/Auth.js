import { insertItem, dbConnect, findOne } from "./MongoDbClient";
import randomstring from "randomstring";
import bcrypt from "bcrypt";
import { createJwtFromUser } from "./JWToken";
import uuidv5 from "uuid/v5";

/**
 * Authenticate user via input email and password
 * @param {*} req
 */
export const authenticateUser = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      const email = req.body.email.toLowerCase();
      const password = req.body.password;
      const dbClient = await dbConnect("users").catch(e => {
        reject(e);
      });
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

      // very password hash
      const auth = await checkPassword(password, user.password);

      if (!auth) {
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
      const password = await generatePasswordHash(req.body.password);
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

      const randomString = randomstring.generate(8);
      // prepare user object
      const user = {
        _id: uuidv5(randomString, process.env.APP_UUID),
        email,
        password
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

// generate secure password hash
const generatePasswordHash = async password => {
  return new Promise(async (resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    });
  });
};

// verify given password
const checkPassword = async (password, hash) => {
  return new Promise(async (resolve, reject) => {
    bcrypt.compare(password, hash, (err, result) => {
      if (err) reject(false);
      resolve(result);
    });
  });
};
