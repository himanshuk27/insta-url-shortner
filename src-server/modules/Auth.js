import { insertItem, dbConnect, findOne } from "./MongoDbClient";
import uuid from "uuid";

/**
 * Authenticate user via input email and password
 * @param {*} req
 */
export const authenticateUser = async req => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const dbClient = await dbConnect("users");
    const user = await findOne({ email });

    // return if user not exists
    if (!user) {
      return {
        error: true,
        message: "Email id not exists",
        code: 401
      };
    }

    if (password != user.password) {
      return {
        error: true,
        message: "Incorrect password",
        code: 401
      };
    }

    dbClient.close();

    return {
      error: false,
      message: "Auth success",
      code: 200
    };
  } catch (e) {
    return {
      error: true,
      message: e,
      code: 417
    };
  }
};

/**
 * User signup by input email and password
 * @param {*} req
 */
export const registerUser = async req => {
  try {
    const email = req.body.email;
    const dbClient = await dbConnect("users");
    const query = await findOne({ email });

    // return if user already exists
    if (query) {
      return {
        error: true,
        message: "User already exists",
        code: 417
      };
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

    return {
      error: false,
      message: "Signup complete",
      code: 200
    };
  } catch (e) {
    return {
      error: true,
      message: e.message,
      code: 417
    };
  }
};
