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
export const generateShortLink = async req => {
  try {
    // user input url
    const url = req.body.url;
    const userId = "asfd";
    const customShortLink = req.body.customShortLink;
    const expirationDate = req.body.expirationDate;

    // return if not url provided
    if (!url || url == "") {
      return {
        error: true,
        message: "url parameter is required",
        code: 417
      };
    }

    // initialize mongodb connection
    const dbClient = await dbConnect("shortlinks");
    const shortlinkExists = await findOne({ userId, url });

    // return if short link already generated
    if (shortlinkExists) {
      dbClient.close();
      return {
        error: true,
        message: "Shortlink already exists",
        shortLink: shortlinkExists,
        code: 200
      };
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

    return {
      error: false,
      message: "shortlink generated",
      shortLink,
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

/**
 * Fetch user past links
 * @param {*} req
 */
export const fetchUserGeneratedLinks = async req => {
  try {
    const userId = req.body.userId;
    // initialize mongodb connection
    await dbConnect("shortlinks");
    // fetch user generated links
    const shortlinks = await find({ userId });

    return {
      error: false,
      message: "query executed",
      shortlinks,
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

/**
 * Check if user custom link is available
 * @param {*} req
 */
export const checkShortLinkAvailability = async req => {
  try {
    const shortLink = req.body.customShortLink;
    // initialize mongodb connection
    await dbConnect("shortlinks");
    // fetch user generated links
    const query = await findOne({ shortLink });

    return {
      error: false,
      message: "request complete",
      match: query ? true : false,
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

/**
 * Fetch original link and redirect user
 * @param {*} req
 */
export const redirectFromShortlink = async (req, res) => {
  await dbConnect("shortlinks");
  return new Promise(async (resolve, reject) => {
    try {
      const shortLink = req.params.shortLink;
      // initialize mongodb connection

      // check redis cache for original url
      redisClient.get(shortLink, (error, value) => {
        if (value) {
          res.redirect(value);
          resolve(value);
        }
      });

      // query in db
      const query = await findOne({ shortLink });
      if (!query) {
        reject({
          error: true,
          message: "Invalid link",
          code: 417
        });
      }
      // check date if expiration is set
      if (query.expireAt && query.expireAt != "") {
        const linkExpired = !moment().isSameOrBefore(query.expireAt);
        if (linkExpired) {
          reject({
            error: true,
            message: "Link expired",
            code: 417
          });
        }
      }
      res.redirect(query.url);
      resolve(query.url);
    } catch (e) {
      reject(e);
    }
  });
};
