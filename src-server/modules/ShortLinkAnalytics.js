import moment from "moment";
import useragent from "useragent";
import { dbConnect, insertItem } from "./MongoDbClient";

/**
 * Collect basic details on every link redirect
 * @param {*} req
 */
export const logShortLink = async req => {
  return new Promise(async (resolve, reject) => {
    try {
      // collect user ip address
      const ip = req.header("x-forwarded-for") || req.connection.remoteAddress;
      // collect user agent or browser
      const userAgent = useragent.parse(req.headers["user-agent"]).family;
      // connect to db
      const dbClient = await dbConnect("analytics");

      const log = {
        shortLink: req.params.shortLink,
        ipAddress: ip,
        userAgent,
        accessTime: moment().toDate()
      };
      // log into db
      await insertItem(log);
      // close connection
      dbClient.close();
      resolve(log);
    } catch (e) {
      reject(e);
    }
  });
};
