import Debug from 'debug';
const debug = Debug('app:database');
import { MongoClient, ObjectId, Db } from 'mongodb';
import config from 'config';

const newId = (str) => new ObjectId(str);

let _db = null;

/**
 * Connect to the database
 * @returns Promise<Db>
 */

async function connect() {
  if (!_db) {
    const dbUrl = config.get('db.url');
    const dbName = config.get('db.name');
    const client = await MongoClient.connect(dbUrl);
    _db = client.db(dbName);
    debug('Connected to database');
  }
  return _db;
}

async function ping() {
  const db = await connect();
  await db.command({
    ping: 1,
  });
  debug('Ping successful');
}

async function findAllUsers() {
  //throw new Error('Test Error');
  const db = await connect();
  const users = await db.collection('Users').find({}).toArray();
  return users;
}

async function findUserById(userId) {
  const db = await connect();
  const user = await db.collection('Users').findOne({ _id: { $eq: userId } });
  return user;
}

async function findUserByEmail(email) {
  const db = await connect();
  const user = await db.collection('Users').findOne({ email:{ $eq: email } });
  if (user) {
    return true;
  } else {
    return false;
  }
}

async function insertOneUser(user) {
  const db = await connect();
  await db.collection('Users').insertOne({
    ...user,
    createdDate: new Date(),
  });
}

async function updateOnePet(petId, update) {
  const db = await connect();
  await db.collection('pets').updateOne(
    { _id: { $eq: petId } },
    {
      $set: {
        ...update,
        lastUpdated: new Date(),
      },
    }
  );
}

async function deleteOnePet(petId) {
    const db = await connect();
    await db.collection('pets').deleteOne({ _id: { $eq: petId } });
}

ping();

export { newId, connect, ping, findAllUsers, findUserById, findUserByEmail, insertOneUser };
