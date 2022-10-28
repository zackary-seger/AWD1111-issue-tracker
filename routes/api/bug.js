import Debug from 'debug';
const debugMain = Debug('app:routes:bug');
import * as dbModule from '../../database.js';
import express from 'express';
import _ from 'lodash';
import Joi from 'joi';
import { validId } from '../../middleware/validId.js';
import { validBody } from '../../middleware/validBody.js';

// Create Router
const router = express.Router();

// Define joi validation schemas
const newBugSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  reproductionSteps: Joi.string().min(1).trim().required(),
  classification: Joi.string().min(1).trim().required(),
  closed: Joi.bool().required(),
});

const updateBugSchema = Joi.object({
  title: Joi.string().trim(),
  description: Joi.string().trim(),
  reproductionSteps: Joi.string().min(1).trim(),
  classification: Joi.string().min(1).trim(),
  closed: Joi.bool(),
}).min(1);

const classifySchema = Joi.object({
  classification: Joi.string().trim().required(),
});

const assignSchema = Joi.object({
  assignedToUserId: Joi.string().trim(),
});

const newTestCaseSchema = Joi.object({
  bugTestCase: Joi.string().required()
});

// Register Routes
router.get('/list', async (req, res, next) => {

  try {

    const bugs = await dbModule.findAllBugs();
    const db = await dbModule.newDbConn();

    // We only need to use lines 47-52 once for our database, so they are now commented out..

    // await dbModule.newTextIndex(db, 'Users');
    // await dbModule.newDateIndex(db, 'Users', -1, 'Date');
    // await dbModule.newDateComboIndex(db, 'Users', -1, 'DateTitle', 'title');
    // await dbModule.newDateComboIndex(db, 'Users', -1, 'DateClassification', 'classification');
    // await dbModule.newDateComboIndex(db, 'Bugs', -1, 'DateAssignedToUser', 'assignedToUserId');
    // await dbModule.newDateComboIndex(db, 'Bugs', -1, 'DateCreatedByUser', 'createdByUserId');

    // SCOPE...

    let keyword = req.query.keyword;
    let sortBy = req.query.sortBy;
    let classification = req.query.classification;
    let maxAge = req.query.maxAge;
    let minAge = req.query.minAge; 
    let open = req.query.open;
    let closed = req.query.closed;
    let pageSize = req.query.pageSize;
    let pageNumber = req.query.pageNumber;

    let keywordArray;
    let classificationArray;
    let maxAgeArray;
    let minAgeArray;
    let openArray;
    let closedArray;
    let sortByArray;

    let n = 0;
    let specifier = '';
    let finalArray = [];     
    
    const todaysDate = new Date();
    let calcDateMin = new Date();
    let calcDate = new Date();

    dbModule.newTextIndex(db, 'Bugs');

    // Form JSON Response Array Queries Based On Query Parameters

    // NOTE: As you can see below, I spent an outrageous amount of time figuring this ridiculous thing out,
    // but I'm glad to be learning about async and promises. I spent an amount of time 
    // methodically debugging every last piece here until it all worked out that I'm not going to admit to. 
    // All this being said I now know how to access and send data back and forth between async functions, 
    // callbacks, and files so, I think the effort was worth it in the end.

    // NOTE: The idea below here is to only create the smallest version of our js code, 
    // and only if the Query Parameter actually exists, this way any kind of 
    // limiter can be added to the command, and if there is no command, we can easily
    // verify that later on when necessary.

    if (keyword) {

      keywordArray = `db.collection('Bugs').find({ $text: { $search: '${keyword}' } })`;

    } 

    if (classification) {

      classificationArray = `db.collection('Bugs').find( { classification: '${classification}' } )`;

    }

    if (maxAge) {

      // NOTE: Here, and in the conditional beginning on line 123, we have to do this weird math equation that somehow
      // magically converts n days into a number I don't understand. If you convert the the second half of the
      // equation below,with a max age value of 100, as seconds into days, the answer is exactly 100,000 days. 

      // UPDATE:  I found the following on stackoverflow: 

      //          Basically, 1000 is used here just for converting seconds
      //          to milliseconds. Number of seconds in a day = 24 * 60 * 60 = 86400 seconds.
      //          1 second = 1000 milliseconds.
      //          So after calculating the expression, the result is in milliseconds.
      //          days * 24 * 60 * 60 * 1000 = days * 86400000 ms

      // Now with all this information, some quick testing proved my current code situation works like a charm! 
      // This is the equation I had written: 
      //                                        calcDate.setTime( todaysDate.getTime() - ( (24*6*60*1000) * parseInt(maxAge)) );
      
      // The lab instructions ask for an input of days since userCreatedDate, and using .getTime() on a Date() object
      // will return the number of milliseconds of time in-between the given date and the UNIX epoch,  which is defined as 
      // January 1, 1970, UTC. So, when you subtract our two values you end up with a time in ms, which is equivalent 
      // to the time from the UNIX epoch to the date which is the correct amount of days before today, based on the query
      // parameter.

      calcDate = new Date();
      calcDate.setTime( todaysDate.getTime() - ( (24*60*60*1000) * parseInt(maxAge)) );

      maxAgeArray = `db.collection('Bugs').find( { createdDateTime: { $gte: new Date("${calcDate.toISOString()}") } } )`;
      
    }

    if (minAge) {

      calcDateMin = new Date();
      calcDateMin.setTime( todaysDate.getTime() - ((24*60*60*1000) * parseInt(minAge)) );
      minAgeArray = `db.collection('Bugs').find({ createdDateTime: { $lte: new Date("${calcDateMin.toISOString()}") } })`;

    }

    if (open) {
      if(open === 'true') {
        openArray = `db.collection('Bugs').find( { closed: false } )`;

      } else if (open === 'false') {
        openArray = `db.collection('Bugs').find( { closed: true } )`;
      }
    } else {
      openArray = `db.collection('Bugs').find( { closed: false } )`;
    }

    if (closed) {
      if(closed === 'true') {
        closedArray = `db.collection('Bugs').find( { closed: true } )`;

      } else if (open === 'false') {
        closedArray = `db.collection('Bugs').find( { closed: false } )`;
      }
    } else {
      closedArray = `db.collection('Bugs').find( { closed: true } )`;
    }
    let results = [];

    // NOTE: This function is different because I originally wrote it as a dbModule function that was called here. This, as 
    // you surely understand, it caused a lot of fun problems, none of which could easily be worked around. I ended up just
    // directly inserting the function code here instead. Here also, instead of creating strings for our queries, I have
    // simply created nested array structures to be set for each possible sortBy specifier. That array is subsequently 
    // transferred into our empty sortByArray array variable, so that it the end, the sortBy array can be added to the 
    // larger, finalArray, which will contain each of our query arrays together and a nested array. The nested array is what
    // we will use as our JSON post.

    if (sortBy) {

      specifier = sortBy;

      try {
    
        if (specifier == 'title') {
    
          results[0] = { titleSort: await db.collection('Bugs').find().sort({ title: 1}).toArray() };
          results[1] = { dateTimeSort: await db.collection('Bugs').find().sort({ createdDateTime: -1}).toArray() };
          sortByArray = results;
    
        } else if (specifier == 'assignedTo') {
    
          results[0] = { assignedToNameSort: await db.collection('Bugs').find().sort({ assignedToUserName: 1}).toArray()};
          results[1] = { dateTimeSort: await db.collection('Bugs').find().sort({ createdDateTime: -1}).toArray()};
          sortByArray = results;
          
        } else if (specifier == 'classification') {
    
          results[0] = { classificationSort: await db.collection('Bugs').find().sort({ classification: 1}).toArray()};
          results[1] = { dateTimeSort: await db.collection('Bugs').find().sort({ createdDateTime: -1}).toArray()};
          sortByArray = results;
          
        } else if (specifier == 'newest') {
          
          results[0] = { dateTimeSort: await db.collection('Bugs').find().sort({ createdDateTime: -1}).toArray()};
          sortByArray = results;
    
        } else if (specifier == 'oldest') {
          
          results[0] = { dateTimeSort: await db.collection('Bugs').find().sort({ createdDateTime: 1}).toArray()};
          sortByArray = results;
    
        } else if (specifier == 'createdBy') {
          
          results[0] = { createdBySort: await db.collection('Bugs').find().sort({ createdById: 1}).toArray()};
          results[1] = { dateTimeSort: await db.collection('Bugs').find().sort({ createdDateTime: -1}).toArray()};
          sortByArray = results;
    
        }else {
    
          res.status(400).json({ error: `We're sorry, your sortBy specifier was invalid, please enter a valid specifier..`})
    
        }

        if (sortByArray) {
          finalArray[n] = { sortByArray: sortByArray };
          n++;
        }
    
      } catch (err) {
        next(err)
      }

    }

    // NOTE: pageSize .limit() and pageNumber .skip() have to go here at the end, because they are meant to be optional add 
    // add ons for each of the rest of the find().args.. operations being called. The thing to pay attention to here is
    // that you cannot add .limit() to anything other than a db.collection.find() operation, which is why I decided to
    // build my final commands as strings as the program moves forward. Lastly, you'll see that for our sortBy() array, we
    // use the .slice() operation to complete the same function as .limit() would. The difference here is that we have already
    // populated sortByArray at this point. We do this because db.collection.find() is needed 12 times, which would have made 
    // writing out each of the necessary async functions essentially into a unnecessarily ridiculous amount of code, so I chose
    // to use it the way it was already written. ALSO: there is a default pageSize of 5 if a pageSize is not included as a query 
    // parameter, and a default pageNumber of 1 if pageNumber is not included as a query parameter.

    if (pageSize) {    
      const size = parseInt(pageSize);
      if (keywordArray != undefined) {
        keywordArray += `.limit(${size})`;
      }
      if (classificationArray != undefined) {
        classificationArray += `.limit(${size})`;
      }
      if (maxAgeArray != undefined) {
        maxAgeArray += `.limit(${pageSize})`;
      }
      if (minAgeArray != undefined) {
        minAgeArray += `.limit(${pageSize})`;
      }
      if (openArray != undefined) {
        openArray += `.limit(${pageSize})`;
      }
      if (closedArray != undefined) {
        closedArray += `.limit(${pageSize})`;
      }
      if (sortByArray != undefined) {
        sortByArray.slice(pageSize);
      }

    } else {
     
      if (keywordArray != undefined) {
        keywordArray += `.limit(5)`;
      }
      if (classificationArray != undefined) {
        classificationArray += `.limit(5)`;
      }
      if (maxAgeArray != undefined) {
        maxAgeArray += `.limit(5)`;
      }
      if (minAgeArray != undefined) {
        minAgeArray += `.limit(5)`;
      }
      if (openArray != undefined) {
        openArray += `.limit(5)`;
      }
      if (closedArray != undefined) {
        closedArray += `.limit(5)`;
      }
      if (sortByArray != undefined) {
        sortByArray.slice(5);
      }

    }

    if (pageNumber) {
      if (pageSize && pageNumber == 1) {  
        } else if (pageSize) {

          if (keywordArray != undefined) {
            keywordArray += `.skip( (pageNumber - 1) * pageSize )`;
          }
          if (classificationArray != undefined) {
            classificationArray += `.skip( (pageNumber - 1) * pageSize )`;
          }
          if (maxAgeArray != undefined) {
            maxAgeArray += `.skip( (pageNumber - 1) * pageSize )`;
          }
          if (minAgeArray != undefined) {
            minAgeArray += `.skip( (pageNumber - 1) * pageSize )`;
          }
          if (openArray != undefined) {
            openArray += `.skip( (pageNumber - 1) * pageSize )`;
          }
          if (closedArray != undefined) {
            closedArray += `.skip( (pageNumber - 1) * pageSize )`;
          }
          if (sortByArray != undefined) {
            for (let x = 0; x < ( (pageNumber - 1) * pageSize ); x++) {
              sortByArray.shift();
            }
          }
          
        } else if (!pageSize && pageNumber == 1) {
        } else if (!pageSize && pageNumber != 1) {
          
          if (keywordArray != undefined) {
            keywordArray += `.skip( (pageNumber - 1) * 5 )`;
          }
          if (classificationArray != undefined) {
            classificationArray += `.skip( (pageNumber - 1) * 5 )`;
          }
          if (maxAgeArray != undefined) {
            maxAgeArray += `.skip( (pageNumber - 1) * 5 )`;
          }
          if (minAgeArray != undefined) {
            minAgeArray += `.skip( (pageNumber - 1) * 5 )`;
          }
          if (openArray != undefined) {
            openArray += `.skip( (pageNumber - 1) * 5 )`;
          }
          if (closedArray != undefined) {
            closedArray += `.skip( (pageNumber - 1) * 5 )`;
          }
          if (sortByArray != undefined) {
            for (x = 0; x < ( (pageNumber - 1) * pageSize ); x++) {
              sortByArray.shift();
            }
          }

        }
    } 

    // NOTE: This is where the fun begins! The if(keywordArray),if(role), if(maxAge), and if(minAge) conditionals are
    // mostly identical, if not for the changing of variable and array names. I created and imported a function called
    // dbQuery inside of dbModule, which accepts one of our prebuilt strings to be used as our db.collection.find()
    // command. From this viewpoint, immediately after running dbQuery(), we set an array, arr1, equal to the array 
    // promise that dbQuery returns. To actually transfer the variable from our database.js scope to here, it needs to
    // exported at the end of database.js, so that when you import ../../database.js into user.js as dbModule, the dbModule
    // object will contain the correct array promise that you need. What happens then, is you simply declare a variable
    // and set it equal to the array promise you just saved and exported from database.

    if (keywordArray){

      keywordArray += `.toArray()`;
      await dbModule.dbQuery(keywordArray, 'keywordArray');
      let arr1 = dbModule.finalArr;

      // NOTE: The following code demonstrates the act of accessing the data given in a Promise. To do this we need to
      // use the .then() property of the Promise. .then() runs a function where the result of your Promise is passed 
      // through as a generic parameter. You need to return this result to actually use it. In the end, we call the 
      // callback function with await, where we are directly inserting it into our finalArray.
      
      let finalKeywordArr = arr1.then(function(result) { 
        return result;
      });

      finalArray[n] = { finalKeywordArray: await finalKeywordArr };
      n++;

    }

    if (classification) {

      classificationArray += `.toArray()`;
      
      await dbModule.dbQuery(classificationArray, 'classificationArray');
      let arr2 = dbModule.finalArr;
      
      let finalClassificationArr = arr2.then(function(result) {
        return result;
      });

      finalArray[n] = { finalCLassificationArray: await finalClassificationArr };
      n++;    

    }

    if (maxAge) {

      maxAgeArray += `.toArray()`;
      await dbModule.dbQuery(maxAgeArray, 'maxAgeArray');
      let arr3 = dbModule.finalArr;
      
      let maxAgeArr = arr3.then(function(result) {
        return result;
      });

      finalArray[n] = { maxAgeArray: await maxAgeArr };
      n++;

    }

    if (minAge) {

      minAgeArray += `.toArray()`;
      await dbModule.dbQuery(minAgeArray, 'minAgeArray');
      let arr4 = dbModule.finalArr;
      
      let minAgeArr = arr4.then(function(result) {
        return result;
      });

      finalArray[n] = { minAgeArray: await minAgeArr };
      n++;

    }

    if (open) {

      openArray += `.toArray()`;

      await dbModule.dbQuery(openArray, 'openArray');
      let arr5 = dbModule.finalArr;
      
      let openArr = arr5.then(function(result) {
        return result;
      });

      finalArray[n] = { openArray: await openArr };
      n++;

    }

    if (closed) {
 
      closedArray += `.toArray()`;

      await dbModule.dbQuery(closedArray, 'closedArray');
      let arr5 = dbModule.finalArr;
      
      let closedArr = arr5.then(function(result) {
        return result;
      });

      finalArray[n] = { closedArray: await closedArr };
      n++;

    }

    debugMain({ finalArray: finalArray });
    console.log(`\n`);

    if (!keyword && !classification && !minAge && !maxAge && !open && !closed && !sortBy && !pageSize && !pageNumber) {
      res.status(200).json(bugs.slice(5));
    } else {
      res.status(200).json(finalArray);
    }

  } catch (err) {
    next(err);
  }
  
});

router.get('/:bugId', validId('bugId'), async (req, res, next) => {
 // Get bugs from bugs array and send response as JSON;
 const bugId = req.bugId;
 const foundBug = await dbModule.findBugById(dbModule.newId(bugId));
 if (!foundBug){
  res.status(404).json({ error: 'Bug not found..'})
 } else {
  res.json(foundBug);
 }
});

router.put('/new', validBody(newBugSchema), async (req, res, next) => {
  // Create new bug and send response as JSON

  const { createdById,
          assignedToId,
          title,
          description,
          reproductionSteps,
          classification,
          closed } = req.body;

  const newBug =  {
    createdById,
    assignedToId,
    title,
    description,
    reproductionSteps,
    classification,
    closed
  }

  await dbModule.insertOneBug(newBug);
  
  res.status(200).json(newBug);

});

router.put('/:bugId', validId('bugId'), validBody(updateBugSchema), async (req, res, next) => {
  // Update existing bug and send response as JSON;
  const bugId = req.bugId;
  const updateBug = req.body;

  if (!updateBug) {
    res.status(404).json({ error: 'Bug Not Found'});
  } else {
    debugMain(updateBug);
    await dbModule.updateOneBug(bugId, updateBug);
    res.status(200).json({message: `Bug ${bugId} updated!`});
  } 
});

router.put('/:bugId/classify', validId('bugId'), validBody(classifySchema), async (req, res, next) => {
  // Classify bug and send response as JSON;
  const bugId = req.bugId;
  const classification = req.body;
  const foundBug = req.body;
  debugMain(foundBug);

  console.log(bugId);

  if (!foundBug) {
    res.status(404).json({ error: 'Bug Not Found'});
  } else {
    if (classification != undefined) {
      foundBug.classification = classification;
      foundBug.classifiedOn = new Date();
      foundBug.lastUpdated = new Date();
    }
    await dbModule.updateOneBug(bugId, foundBug);
    res.status(200).json({message: `Bug ${bugId} updated!`});
  }

});

router.put('/:bugId/assign', validId('bugId'), validBody(assignSchema),  async (req, res, next) => {
  // Assign bug to user and send response as JSON;
  let bugId = req.bugId;
  const assignedToUserId = dbModule.newId(req.body.assignedToUserId);
  debugMain(assignedToUserId);

  const user = await dbModule.findUserById(assignedToUserId);
  debugMain(user);

  const foundBug = await dbModule.findBugById(bugId);
  const userName = user.firstName;

  if (!foundBug) {
    res.status(404).json({ error: `Bug ${bugId} Not Found`});
  } else {
    if (user != undefined) {
      foundBug.assignedToUserId = dbModule.newId(assignedToUserId);
    } else {
      res.status(404).json({ error: `UserId ${assignedToUserId} Not Found`});
    }

    if (userName != undefined) {
      foundBug.assignedToUserName = userName;
    } else {
      res.status(404).json({ error: `Username ${userName} Not Found`});
    }

    foundBug.assignedOn = new Date();
    foundBug.lastUpdated = new Date();

    await dbModule.updateOneBug(bugId, foundBug);
    res.status(200).json({message: `Bug ${bugId} assigned to ${userName}!`});
}});

router.put('/:bugId/close', validId('bugId'), async (req, res, next) => {
  // Close bug and send response as JSON;
  const bugId = req.bugId;
  debugMain(bugId);
  const foundBug = await dbModule.findBugById(bugId);
  debugMain(foundBug);

  if (!foundBug) {
    res.status(404).json({ error: `Bug ${bugId} Not Found`});
  } else { 
    foundBug.closed = true;
    foundBug.closedOn = new Date();
    foundBug.lastUpdated = new Date();
  }

  debugMain("conditional complete");

  await dbModule.updateOneBug(bugId, foundBug);
  res.status(200).json({message:`Bug ${bugId} closed!`});
});

router.get('/:bugId/test/list', validId('bugId'), async (req, res, next) => {
  
  try {
    const cases = await dbModule.findAllTestCasesByBugId();
    res.status(200).json(cases);
  } catch (err) {
    next(err);
  }

});

router.get('/:bugId/test/:testId', validId('bugId'), validId('testId'), async (req, res, next) => {

// Get bugs from bugs array and send response as JSON;
const bugId = req.bugId;
const testId = req.testId;

const foundTestCase = await dbModule.findAllTestCasesByTestIdAndBugId(dbModule.newId(testId), dbModule.newId(bugId));
if (!foundTestCase){
 res.status(404).json({ error: 'Test not found..'})
} else {
 res.status(200).json(foundTestCase);
}

});

router.put('/:bugId/test/new', validId('bugId'), validBody(newTestCaseSchema), async (req, res, next) => {
  
  // Create new bug and send response as JSON

  const bugId = req.bugId;
  const testId = dbModule.newId();
  const testCase  = req.body.bugTestCase;

  const newTestCase =  {
    testId,
    testCase,
    createdDateTime: new Date(),
  }

  await dbModule.insertOneTestCaseToBug(newTestCase, bugId);
  
  res.status(200).json(newTestCase);
  
});
 
// Export Router
export {router as bugRouter};