import { dbConnect, findOne } from "./MongoDbClient";
import { redisClient } from "../server";
import moment from "moment";

/**
 * Fetch original link and redirect user
 * @param {*} req
 */
export const redirectFromShortlink = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      const shortLink = req.params.shortLink;
      // initialize mongodb connection
      await dbConnect("shortlinks");

      // check redis cache for original url
      redisClient.get(shortLink, (error, value) => {
        if (value) {
          res.redirect(value);
          resolve();
        }
      });

      // query in db if redis cache is not there
      const query = await findOne({ shortLink });
      if (!query) {
        reject("Invalid link");
      }
      // check date if expiration is set
      if (query.expireAt && query.expireAt != "") {
        const linkExpired = !moment().isSameOrBefore(query.expireAt);
        if (linkExpired) {
          reject("Link expired");
        }
      }
      res.redirect(query.url);
      resolve();
    } catch (e) {
      reject(e.message);
    }
  });
};
