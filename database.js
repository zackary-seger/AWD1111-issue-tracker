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

async function findAllBugs() {
  const db = await connect();
  const bugs = await db.collection('Bugs').find({}).toArray();
  return bugs;
}

async function findUserById(userId) {
  const db = await connect();
  const user = await db.collection('Users').findOne({ _id: { $eq: userId } });
  return user;
}

async function findBugById(bugId) {
  const db = await connect();
  const bug = await db.collection('Bugs').findOne({ _id: { $eq: bugId } });
  return bug;
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

async function readUserByEmail(email) {
  const db = await connect();
  const user = await db.collection('Users').findOne({ email:{ $eq: email } });
  if (user) {
    return user;
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

async function updateOneUser(userId, update) {
  const db = await connect();
  await db.collection('Users').updateOne(
    { _id: { $eq: userId } },
    {
      $set: {
        ...update,
        lastUpdated: new Date(),
      },
    }
  );
}

async function deleteOneUser(userId) {
    const db = await connect();
    await db.collection('Users').deleteOne({ _id: { $eq: userId } });
}

async function insertOneBug(bug) {
  const db = await connect();
  await db.collection('Bugs').insertOne({
    ...bug,
    createdDate: new Date(),
  });
}

async function updateOneBug(bugId, update) {
  const db = await connect();
  await db.collection('Bugs').updateOne(
    { _id: { $eq: bugId } },
    {
      $set: {
        ...update,
        lastUpdated: new Date(),
      },
    }
  );
}

async function deleteOneBug(bugId) {
    const db = await connect();
    await db.collection('Bugs').deleteOne({ _id: { $eq: bugId } });
}

async function findAllCommentsByBugId(bugId) {
  
  const db = await connect();

  const comment = await db.collection('AllComments').findOne({ bugId: { $eq: bugId } });
  return comment;
  
}

async function findAllCommentsByCommentIdAndBugId(commentId, bugId) {
 
  const db = await connect();

  const comment = await db.collection('AllComments').findOne( { _id: { $eq: commentId } }, { bugId: { $eq: bugId } });
  return comment;

}

async function insertOneCommentToAllComments(comment) {
  
  const db = await connect();

  await db.collection('AllComments').insertOne({
    ...comment,
    createdDateTime: new Date(),
  });

}

async function insertOneCommentToBug(comment, bugId) {
  
  const db = await connect();

  await db.collection('Bugs').updateOne(
    { _id: { $eq: bugId } },
    {
      $push: {
        bugComments: comment,
      },
    }
  );

}

ping();

export { newId, connect, ping, findAllUsers, findUserById, findUserByEmail, readUserByEmail, 
         insertOneUser, updateOneUser, deleteOneUser, findAllBugs, findBugById, insertOneBug, 
         updateOneBug, deleteOneBug, insertOneCommentToAllComments, findAllCommentsByBugId, 
         findAllCommentsByCommentIdAndBugId, insertOneCommentToBug };
