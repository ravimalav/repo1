const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

let _db;
const MongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://ravimalav0022:Ravimalav123@cluster0.tvvqc3u.mongodb.net/?retryWrites=true&w=majority"
  )
    .then((client) => {
      console.log("connected");
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database is exist";
};
exports.MongoConnect = MongoConnect;
exports.getDb = getDb;
