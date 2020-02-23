require("dotenv").config();
import moment from "moment";
import useragent from "useragent";
import { dbConnect, insertItem, find, findOne } from "./MongoDbClient";

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
      const shortLink = req.params.shortLink;
      // connect to db
      let dbClient = await dbConnect("shortlinks");
      // fetch link owner user
      const shortLinkObject = await findOne({
        shortLink
      });
      // close current connection
      dbClient.close();
      // connect to new collection
      dbClient = await dbConnect("analytics");

      const log = {
        shortLink,
        ownerId: shortLinkObject.userId,
        url: shortLinkObject.url,
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
      reject(e.message);
    }
  });
};

export const getShortlinkBrowserAnalytics = async (req, res, user) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userId = user["_id"];
      let data = [];
      // connect to db
      let dbClient = await dbConnect("analytics");
      // fetch user generated links
      const analytics = await find({ ownerId: userId });
      dbClient.close();
      analytics.forEach(element => {
        data.push({
          shortLink: element.shortLink,
          url: element.url,
          browser: element.userAgent
        });
      });
      res.send({
        error: false,
        message: "query complete",
        analytics: data,
        code: 200
      });
      res.end();
      resolve();
    } catch (e) {
      reject(e.message);
    }
  });
};
