

const mongodb= require('mongodb');
const mongoClient= mongodb.MongoClient;
const uri = "mongodb://localhost:27017";
let _db;

const mongoConnect=(callback)=>{
    mongoClient.connect(uri)
    .then(client=>{
        // console.log(client);
        _db=client.db('mynodetest');
        callback();
    })
    .catch(err=>{
        console.log(err);
        throw err;
    });
};
const getDb=()=>{
    if(_db){
        return _db;
    }
    throw 'No database found';
};
exports.mongoConnect=mongoConnect;
exports.getDb=getDb;
//const client = new MongoClient(uri);

// async function run() {
//   try {
//     await client.connect();
//     console.log("Connected to local MongoDB!");
//     const database = client.db('mynodetest');
//     const collection = database.collection('master');

//     // Your MongoDB operations here
//   } catch (err) {
//     console.error('MongoDB connection error:', err);
//   } finally {
//     await client.close();
//   }
// }   

// run();