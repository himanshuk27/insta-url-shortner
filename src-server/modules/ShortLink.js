require("dotenv").config();
import uuidv5 from "uuid/v5";
import { dbConnect, insertItem, findOne, find } from "./MongoDbClient";
import moment from "moment";
import randomstring from "randomstring";
import { redisClient } from "../server";

/**
 * Generate short link from url function
 * @param {*} req
 */
export const generateShortLink = async (req, res, user) => {
  return new Promise(async (resolve, reject) => {
    try {
      // user input url
      const url = new URL(req.body.url).toString();
      const userId = user["_id"];
      const customShortLink = req.body.customShortLink;
      const expirationDate = req.body.expirationDate;

      // return if not url provided
      if (!url || url == "") {
        res.send({
          error: true,
          message: "url parameter is required",
          code: 417
        });
        res.end();
        resolve();
      }

      // initialize mongodb connection
      const dbClient = await dbConnect("shortlinks");
      const shortlinkExists = await findOne({ userId, url });

      // return if short link already generated
      if (shortlinkExists) {
        dbClient.close();
        res.send({
          error: true,
          message: "Shortlink already exists",
          shortLink: shortlinkExists,
          code: 200
        });
        res.end();
        resolve();
      }

      const expireAt =
        expirationDate && expirationDate != ""
          ? moment(req.body.expirationDate, "DD-MMM-YYYY HH:mm").toDate()
          : null;

      const uniqueIdentifier = randomstring.generate(6);

      const shortLink = {
        _id: uuidv5(uniqueIdentifier, process.env.APP_UUID),
        url,
        userId,
        shortLink:
          customShortLink && customShortLink != ""
            ? customShortLink
            : uniqueIdentifier,
        expireAt,
        createdAt: moment().toDate()
      };

      // insert into db
      await insertItem(shortLink);
      // close connection
      dbClient.close();

      // save shortlink to redis cache
      redisClient.set(uniqueIdentifier, url);

      res.send({
        error: false,
        message: "shortlink generated",
        shortLink,
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
 * Fetch user past links
 * @param {*} req
 */
export const fetchUserGeneratedLinks = async (req, res, user) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userId = user["_id"];
      // initialize mongodb connection
      await dbConnect("shortlinks");
      // fetch user generated links
      const shortlinks = await find({ userId });

      res.send({
        error: false,
        message: "query executed",
        shortlinks,
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
 * Check if user custom link is available
 * @param {*} req
 */
export const checkShortLinkAvailability = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      const shortLink = req.body.customShortLink;
      // initialize mongodb connection
      await dbConnect("shortlinks");
      // fetch user generated links
      const query = await findOne({ shortLink });

      res.send({
        error: false,
        message: "request complete",
        match: query ? true : false,
        code: 200
      });
      res.end();
      resolve();
    } catch (e) {
      reject(e.message);
    }
  });
};
