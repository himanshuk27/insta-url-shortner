require("dotenv").config();
import fs from "fs";
import jwt from "jsonwebtoken";

// Generate unique jwt auth token from user object
export const createJwtFromUser = user => {
  try {
    const privateKey = fs.readFileSync("./private.key", "utf8");
    const exp = process.env.JWT_EXP;

    const signOptions = {
      expiresIn: exp,
      algorithm: "RS256"
    };

    return { token: jwt.sign(user, privateKey, signOptions), expire_at: exp };
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
      console.log("TCL: user", user);
      resolve(user);
    } catch (e) {
      reject({
        error: true,
        message: e.message,
        code: 417
      });
    }
  });
};
