require("dotenv").config();
import fs from "fs";
import jwt from "jsonwebtoken";
import moment from "moment";

// Generate unique jwt auth token from user object
export const createJwtFromUser = user => {
  try {
    const privateKey = fs.readFileSync("./private.key", "utf8");
    const exp = process.env.JWT_EXP;
    const expireAt = moment()
      .add(exp.replace("h", ""), "hours")
      .toDate();

    const signOptions = {
      expiresIn: exp,
      algorithm: "RS256"
    };

    return { token: jwt.sign(user, privateKey, signOptions), expireAt };
  } catch (e) {
    return {
      error: true,
      message: e.message,
      code: 417
    };
  }
};

export const validateJwt = async req => {
  return new Promise((resolve, reject) => {
    try {
      const publicKey = fs.readFileSync("./public.key", "utf8");
      const token = req.headers["authorization"];
      if (!token || token == "") {
        reject({
          error: true,
          message: "Token not provided",
          code: 417
        });
      }
      const exp = process.env.JWT_EXP;
      const signOptions = {
        expiresIn: exp,
        algorithm: "RS256"
      };
      const user = jwt.verify(token, publicKey, signOptions);
      resolve(user);
    } catch (e) {
      reject({
        error: true,
        message: e.message,
        code: 401
      });
    }
  });
};
