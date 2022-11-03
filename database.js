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
  console.log('\n');

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
    ...bug
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

async function findAllTestCasesByBugId(bugId) {
  
  const db = await connect();

  const cases = await db.collection('Bugs').findOne({ bugId: { $eq: bugId } });
  return cases.bugTestCases;
  
}

async function findAllTestCasesByTestIdAndBugId(testId, bugId) {
 
  const db = await connect();

  const bug = await db.collection('Bugs').findOne( { _id: { $eq: bugId } }, { bugTestCases: {$elemMatch:{testId: testId} }});
  let case1;

  bug.bugTestCases.forEach (async (testCase) => {

    if(testCase.testId.toString() == testId){
      case1 =  testCase;
    } 
  });

  return case1;

}


async function insertOneTestCaseToBug(testCase, bugId) {
  
  const db = await connect();

  await db.collection('Bugs').updateOne(
    { _id: { $eq: bugId } },
    {
      $push: {
        bugTestCases: testCase,
      },
    }
  ); 

}

async function newDbConn() {
  const db = await connect();
  return db;
}

async function newTextIndex(db, collection) {
  db.collection(collection).createIndex( { "$**":"text" }, { name: "fullText" } );
}

async function newDateIndex(db, collection, value, name) {
  db.collection(collection).createIndex( { createdDateTime: value }, { name: name } );
}

async function newDateComboIndex(db, collection, value, name, secondIndexLoc) {
  let obj = {};
  obj['createdDateTime'] = value;
  obj[secondIndexLoc] = -value;
  db.collection(collection).createIndex( obj, { name: name } );
}

let results = [];

async function sortBy(specifier) {

  try {
    
    const db = await connect();

    if (specifier == 'firstName') {

      results[0] = `Sort By: ${specifier} ascending..`;
      results[1] = { firstNameSort: await db.collection('Users').find().sort({ firstName: 1}).toArray() };
      results[2] = { lastNameSort: await db.collection('Users').find().sort({ lastName: 1}).toArray() };
      results[3] = { dateTimeSort: await db.collection('Users').find().sort({ createdDateTime: 1}).toArray() };

      return results;

    } else if (specifier == 'lastName') {

      results[0] = `Sort By: ${specifier} ascending..`;
      results[1] = { lastNameSort: await db.collection('Users').find().sort({ lastName: 1}).toArray()};
      results[2] = { firstNameSort: await db.collection('Users').find().sort({ firstName: 1}).toArray()};
      results[3] = { dateTimeSort: await db.collection('Users').find().sort({ createdDateTime: 1}).toArray()};

      return results;
      
    } else if (specifier == 'role') {

      results[0] = `Sort By: ${specifier} ascending..`;
      results[1] = { roleSort: await db.collection('Users').find().sort({ role: 1}).toArray()};
      results[2] = { firstNameSort: await db.collection('Users').find().sort({ firstName: 1}).toArray()};
      results[3] = { lastNameSort: await db.collection('Users').find().sort({ lastName: 1}).toArray()};
      results[4] = { dateTimeSort: await db.collection('Users').find().sort({ createdDateTime: 1}).toArray()};

      return results;
      
    } else if (specifier == 'newest') {
      
      results[0] = `Sort By: ${specifier} descending..`;
      results[1] = { dateTimeSort: await db.collection('Users').find().sort({ createdDateTime: -1}).toArray()};

      return results;

    } else if (specifier == 'oldest') {
      
      results[0] = `Sort By: ${specifier}`;
      results[1] = { dateTimeSort: await db.collection('Users').find().sort({ createdDateTime: 1}).toArray()};

      return results;

    } else {

      // res.status(400).json({ error: `We're sorry, your sortBy specifier was invalid, please enter a valid specifier..`})

    }

  } catch (err) {
    next(err)
  }

}

let finalArr;

async function dbQuery(arrayQuery, identifier) {

  let db = await connect();

  if (identifier) {
    debug(identifier + ': { Display Current Query String: ' + arrayQuery + ` }`);
    console.log('\n');
  }

  // IMPORTANT: Everyone, everywhere, on the internet will tell you to use, new Function() rather than eval(), however they are
  // both considered dangerous/evil. That being said, I have spent an extraordinary amount of time trying to do this same operation 
  // using new Function(), and have found zero hints on how to make it work correctly, or at all.. As far as I can tell, using 
  // eval() in this manner is relatively safe, because the only strings that can be added to it are a fixed, limited set, which 
  // I have set myself. From what I have read, the JavaScript that the Node.js executes is, for all intents and purposes, interpreted.
  // This means that the performance issues that come along with using eval() will be negligible, because there should be no reason  
  // for the program to need to call a heavy compiler.

  // NOTE: Beyond what has already been said here, the rest of our function is fairly straightforward. On line 324, the result variable 
  // ends up equaling a Promise { <pending> }, which is an object representing the eventual completion or failure of an asynchronous operation.
  // A Promise can either be undefined, pending, fulfilled, or rejected. We are the able to access the returned value of a Promise [object] in 
  // another .then() callback: It should be noted that if you do not return your result here, accessing it outside of the callback function
  // we be impossible.

  // FINALLY: This function can and should be reused for each query that is built to be run. Also remember to export finalArr.

  let result = eval(arrayQuery);

  finalArr = result.then(function(result1) {
    return result1;
  });

  await finalArr;

}

async function insertOneEdit(edit) {
  const db = await connect();
  await db.collection('Edits').insertOne({
    ...edit,
  });
}

async function updateOneTestCaseToBug(bugId, testCaseId, update) {
  const db = await connect();
  return await db.collection('Bugs').updateOne(
    { $and: [ { _id: { $eq: bugId } }, { bugTestCases: { $elemMatch: { testId: { $eq: testCaseId } }}} ]},
    { $set: {"bugTestCases.$[element].testId": "update" }},
    { arrayFilters: [{ element: { $eq: testCaseId } }]}
  );
}

async function deleteOneTestCaseToBug(bugId, testCaseId) {
  const db = await connect();
  await db.collection('Bugs').updateOne(
    { _id: { $eq: bugId } },
    { $pull:  { bugTestCases: { testId: { $eq: testCaseId } } } },
  ); 
}

ping();

export { newId, connect, ping, findAllUsers, findUserById, findUserByEmail, readUserByEmail, 
         insertOneUser, updateOneUser, deleteOneUser, findAllBugs, findBugById, insertOneBug, 
         updateOneBug, deleteOneBug, insertOneCommentToAllComments, findAllCommentsByBugId, 
         findAllCommentsByCommentIdAndBugId, insertOneCommentToBug,findAllTestCasesByBugId,
         findAllTestCasesByTestIdAndBugId, insertOneTestCaseToBug, newDbConn, newTextIndex,
         newDateIndex, newDateComboIndex, sortBy, dbQuery, insertOneEdit, deleteOneTestCaseToBug,
         updateOneTestCaseToBug, finalArr };
