require("dotenv").config();
import MongoClient from "mongodb";

const url = process.env.MONGODB_URL || "127.0.0.1";
const port = process.env.MONGODB_PORT || "27017";
const dbName = process.env.MONGODB_DB || "admin";
const username = process.env.MONGODB_USER || "monodbUser";
const password = encodeURIComponent(process.env.MONGODB_PASSWORD || "");
const authDb = process.env.MONGODB_AUTH_DB || "admin";
let db;
let collection;

/**
 * Connect to a mongodb instance, returns mongodb client
 * @param {*} collectionName
 */
export const dbConnect = async collectionName => {
  return new Promise(async (resolve, reject) => {
    try {
      const connectionUrl = `mongodb://${username}:${password}@${url}:${port}/${authDb}`;
      const client = await MongoClient.connect(connectionUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });

      db = client.db(dbName);
      if (!db) {
        reject("unable to connect mongodb database");
      }
      // set collection object
      collection = db.collection(collectionName);
      resolve(client);
    } catch (e) {
      reject(e.message);
    }
  });
};

/**
 * Insert single row into db collection
 * @param {*} item
 */
export const insertItem = async item => {
  return collection.insertOne(item);
};

export const findOne = async query => {
  return collection.findOne(query);
};

export const find = async query => {
  return new Promise((resolve, reject) => {
    collection.find(query).toArray(function(err, data) {
      err ? reject(err) : resolve(data);
    });
  });
};
