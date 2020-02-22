import uuidv5 from "uuid/v5";
import { dbConnect, insertItem, findOne, find } from "./MongoDbClient";
import moment from "moment";
import randomstring from "randomstring";

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

    const shortLink = {
      _id: uuidv5(url, uuidv5.URL),
      url,
      userId,
      shortLink:
        customShortLink && customShortLink != ""
          ? customShortLink
          : randomstring.generate(6),
      expireAt: moment(req.body.expirationDate, "DD-MMM-YYYY HH:mm").toDate(),
      createdAt: moment().toDate()
    };

    // insert into db
    await insertItem(shortLink);
    // close connection
    dbClient.close();

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

export const checkShortLinkAvailability = async req => {
  try {
    const shortLink = req.body.customShortLink;
    console.log("TCL: shortLink", shortLink);
    // initialize mongodb connection
    await dbConnect("shortlinks");
    // fetch user generated links
    const query = await findOne({ shortLink });
    console.log("TCL: query", query);

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
