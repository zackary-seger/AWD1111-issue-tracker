import Debug from 'debug';
const debugMain = Debug('app:routes:user');
const debugReg = Debug('app:routes:user - reg');
import * as dbModule from '../../database.js';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import config from 'config';
import jwt from 'jsonwebtoken';
import path from 'path';
import express from 'express';
import _ from 'lodash';
import { validId } from '../../middleware/validId.js';
import { validBody } from '../../middleware/validBody.js';
import { auth } from '../../middleware/auth.js';

// Create & Export Router
const router = express.Router();

// Define joi validation schemas
const newUserSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).trim().required(),
  password: Joi.string().trim().required(),
  firstName: Joi.string().min(1).trim().required(),
  lastName: Joi.string().min(1).trim().required(),
  role: Joi.string().min(1).trim().required(),
});

const updateUserSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).trim(),
  password: Joi.string().trim(),
  firstName: Joi.string().min(1).trim(),
  lastName: Joi.string().min(1).trim(),
  fullName: Joi.string().min(1).trim(),
  role: Joi.string().min(1).trim(),
}).min(1);

const loginSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).trim().required(),
  password: Joi.string().trim().required(),
});

// Define Routes

// Find all Users
router.get('/list', async (req, res, next) => {

  try {

    const users = await dbModule.findAllUsers();

    // I created the newDbConn() function on my own accord for _db use here..
    // You can do super neat one liners on this sheet if you do it this way..

    const db = await dbModule.newDbConn();

    // We only need to use lines 47-52 once for our database, so they are now commented out..

    // await dbModule.newTextIndex(db, 'Users');
    // await dbModule.newDateIndex(db, 'Users', -1, 'Date');
    // await dbModule.newDateComboIndex(db, 'Users', -1, 'DateTitle', 'title');
    // await dbModule.newDateComboIndex(db, 'Users', -1, 'DateClassification', 'classification');
    // await dbModule.newDateComboIndex(db, 'Bugs', -1, 'DateAssignedToUser', 'assignedToUserId');
    // await dbModule.newDateComboIndex(db, 'Bugs', -1, 'DateCreatedByUser', 'createdByUserId');

    // Scope..

    let keyword = req.query.keyword;
    let sortBy = req.query.sortBy;
    let role = req.query.role;
    let maxAge = req.query.maxAge;
    let minAge = req.query.minAge; 
    let pageSize = req.query.pageSize;
    let pageNumber = req.query.pageNumber;

    let keywordArray;
    let roleArray;
    let maxAgeArray;
    let minAgeArray;
    let sortByArray;

    let specifier = '';
    let finalArray = [];
        
    let n = 0;
    
    const todaysDate = new Date();
    let calcDateMin = new Date();
    let calcDate = new Date();

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

      keywordArray = `db.collection('Users').find({ $text: { $search: '${keyword}' } })`;

    } 

    if (role) {

      roleArray = `db.collection('Users').find({ $text: { $search: '${role}' } })`;

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

      maxAgeArray = `db.collection('Users').find( { createdDateTime: { $gte: new Date("${calcDate.toISOString()}") } } )`;
      
    }

    if (minAge) {

      calcDateMin = new Date();
      calcDateMin.setTime( todaysDate.getTime() - ((24*60*60*1000) * parseInt(minAge)) );
      minAgeArray = `db.collection('Users').find({ createdDateTime: { $lte: new Date("${calcDateMin.toISOString()}") } })`;

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
      debugMain({test3: specifier});

      try {
    
        if (specifier == 'firstName') {
    
          results[0] = { firstNameSort: await db.collection('Users').find().sort({ firstName: 1}).toArray() };
          results[1] = { lastNameSort: await db.collection('Users').find().sort({ lastName: 1}).toArray() };
          results[2] = { dateTimeSort: await db.collection('Users').find().sort({ createdDateTime: 1}).toArray() };
          sortByArray = results;
    
        } else if (specifier == 'lastName') {
    
          results[0] = { lastNameSort: await db.collection('Users').find().sort({ lastName: 1}).toArray()};
          results[1] = { firstNameSort: await db.collection('Users').find().sort({ firstName: 1}).toArray()};
          results[2] = { dateTimeSort: await db.collection('Users').find().sort({ createdDateTime: 1}).toArray()};
          sortByArray = results;
          
        } else if (specifier == 'role') {
    
          results[0] = { roleSort: await db.collection('Users').find().sort({ role: 1}).toArray()};
          results[1] = { firstNameSort: await db.collection('Users').find().sort({ firstName: 1}).toArray()};
          results[2] = { lastNameSort: await db.collection('Users').find().sort({ lastName: 1}).toArray()};
          results[3] = { dateTimeSort: await db.collection('Users').find().sort({ createdDateTime: 1}).toArray()};
          sortByArray = results;
          
        } else if (specifier == 'newest') {
          
          results[0] = { dateTimeSort: await db.collection('Users').find().sort({ createdDateTime: -1}).toArray()};
          sortByArray = results;
    
        } else if (specifier == 'oldest') {
          
          results[0] = { dateTimeSort: await db.collection('Users').find().sort({ createdDateTime: 1}).toArray()};
          sortByArray = results;
    
        } else {
    
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
      if (roleArray != undefined) {
        roleArray += `.limit(${size})`;
      }
      if (maxAgeArray != undefined) {
        maxAgeArray += `.limit(${pageSize})`;
      }
      if (minAgeArray != undefined) {
        minAgeArray += `.limit(${pageSize})`;
      }
      if (sortByArray != undefined) {
        sortByArray.slice(pageSize);
      }

    } else {
     
      if (keywordArray != undefined) {
        keywordArray += `.limit(5)`;
      }
      if (roleArray != undefined) {
        roleArray += `.limit(5)`;
      }
      if (maxAgeArray != undefined) {
        maxAgeArray += `.limit(5)`;
      }
      if (minAgeArray != undefined) {
        minAgeArray += `.limit(5)`;
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
          if (roleArray != undefined) {
            roleArray += `.skip( (pageNumber - 1) * pageSize )`;
          }
          if (maxAgeArray != undefined) {
            maxAgeArray += `.skip( (pageNumber - 1) * pageSize )`;
          }
          if (minAgeArray != undefined) {
            minAgeArray += `.skip( (pageNumber - 1) * pageSize )`;
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
          if (roleArray != undefined) {
            roleArray += `.skip( (pageNumber - 1) * 5 )`;
          }
          if (maxAgeArray != undefined) {
            maxAgeArray += `.skip( (pageNumber - 1) * 5 )`;
          }
          if (minAgeArray != undefined) {
            minAgeArray += `.skip( (pageNumber - 1) * 5 )`;
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
      await dbModule.dbQuery(keywordArray);
      let arr1 = dbModule.finalArr;
  
      console.log('\n');
      debugMain({test: arr1});

      // NOTE: The following code demonstrates the act of accessing the data given in a Promise. To do this we need to
      // use the .then() property of the Promise. .then() runs a function where the result of your Promise is passed 
      // through as a generic parameter. You need to return this result to actually use it. In the end, we call the 
      // callback function with await, where we are directly inserting it into our finalArray.
      
      let finalKeywordArr = arr1.then(function(result) {
        console.log('\n');
        debugMain(result); 
        return result;
      });

      finalArray[n] = { finalKeywordArray: await finalKeywordArr };
      n++;

    }

    if (role) {

      roleArray += `.toArray()`;
      await dbModule.dbQuery(roleArray);
      let arr2 = dbModule.finalArr;

      console.log('\n');
      debugMain({test: arr2});
      
      let finalRoleArr = arr2.then(function(result) {
        console.log('\n');
        debugMain(result); 
        return result;
      });

      finalArray[n] = { finalRoleArray: await finalRoleArr };
      n++;    

    }

    if (maxAge) {

      maxAgeArray += `.toArray()`;
      await dbModule.dbQuery(maxAgeArray);
      let arr3 = dbModule.finalArr;

      console.log('\n');
      debugMain({test: arr3});
      
      let maxAgeArr = arr3.then(function(result) {
        console.log('\n');
        debugMain('testThen: ' + arr3); 
        return result;
      });

      finalArray[n] = { maxAgeArray: await maxAgeArr };
      n++;

    }

    if (minAge) {

      minAgeArray += `.toArray()`;
      await dbModule.dbQuery(minAgeArray);
      let arr4 = dbModule.finalArr;

      console.log('\n');
      debugMain({test: arr4});
      
      let minAgeArr = arr4.then(function(result) {
        console.log('\n');
        debugMain('testThen2: ' + arr4); 
        return result;
      });

      finalArray[n] = { minAgeArray: await minAgeArr };
      n++;

    }

    console.log(`\n`);
    debugMain({ finalArray: finalArray });

    if (!keyword && !role && !minAge && !maxAge && !sortBy && !pageSize && !pageNumber) {
      res.status(200).json(users).limit(5);
    } else {
      res.status(200).json(finalArray);
    }

  } catch (err) {
    next(err);
  }

});

// Find User
router.get('/:userId', validId('userId'), async (req, res, next) => {
  try {

    const userId = req.userId;
    const user = await dbModule.findUserById(userId);

    if (!user) {
      res.status(404).json({ error: `${userId} User not found` });
    } else {
      res.json(user);
    }

  } catch (err) {
    next(err);
  }
});

// Register User

// Before the fun even begins, this function starts by running validBody(schema), and
// pre-validated and sent directly to something like - req.body[n] = {name: name}; - where
// req.body[n] stores the data inputs to be further used.

router.put('/register', validBody(newUserSchema), async (req, res, next) => {
  
  try {

    // Below, we use await and call findUserByGetEmail(), and we insert the email data
    // we parsed through the request body. An actual example of using this would be creating
    // html form boxes that use a 'submit' button, and have a a form action attribute set
    // equal to the path you want your form to PUT to. ex:  action = "/user/api/register"

    const foundUser = await dbModule.findUserByEmail(req.body.email);

    if (!foundUser) {

        const user = req.body;

        // Right here we are creating a hash of whatever password the user enters in. 
        // The bycrypt.hash() function randomly salts, and then hashes over the previous
        // hash as many times as you command. You can have an infinitely intricate password
        // this way. I checked out the internets and found a way that you can access the 
        // salts that are created with hash(). It actually looks super simple too.

        user.password = await bcrypt.hash(user.password, 10);
        debugReg({hashedPass: user.password});
        console.log('\n');

        // Now we need to issue a new JWT token.

        const authPayload = { /* save user data that you will want later */ };
        const authSecret = config.get('auth.secret');
        const authExpiresIn = config.get('auth.tokenExpiresIn');
        const authToken = jwt.sign(authPayload, authSecret, { expiresIn: authExpiresIn });

        // Save the JWT token in a cookie.

        const authMaxAge = parseInt(config.get('auth.cookieMaxAge'));
        res.cookie('authToken', authToken, { maxAge: authMaxAge, httpOnly: true });

        // Return the token back in the JSON response.
        
        await dbModule.insertOneUser(user);
        res.status(200).json({ message: 'New User Registered!' + `  -  Full Name: ${req.body.firstName} ${req.body.lastName}` , authToken });

    } else {
      res.status(400).json({ error: 'Email already registered..' });
    }

  } catch (err) {
      next(err);
  }
 
});

// Login User
router.put('/login', validBody(loginSchema), async (req, res, next) => {
  
  try {

    const foundUser = await dbModule.findUserByEmail(req.body.email);

    if (!foundUser) {
      res.status(404).json({ error: `User: ${req.body.email} not found` });
    } else {
      const email = req.body.email;
      const password = req.body.password;
  
      const user = await dbModule.readUserByEmail(email);
      const userPassword = user.password;
  
      res.status(200).json( `Welcome back ${user.fullName}!` );
    }

    } catch (err) {
    next(err);
  }

});

// Update User
router.put('/:userId', validId('userId'), validBody(updateUserSchema),  async (req, res, next) => {
  try{
    const userId = req.userId;
    const update = req.body;
    debugMain(`Update User ${userId}`, update);

    const userFound = await dbModule.findUserById(userId);
    if (!userFound) {
      res.status(404).json({ error: `User ${userId} not found` });
    } else {
      await dbModule.updateOneUser(dbModule.newId(userId), update);
      res.json({ message: `User ${userId} updated` });
    }
  } catch (err) {
    next(err);
  }
});

//Delete User
router.delete('/:userId', validId('userId'), async (req, res, next) => {
 try{
    const userId = req.userId;
    debugMain(`Delete user ${userId}`);

    const userFound = await dbModule.findUserById(dbModule.newId(userId));
    
    if (!userFound) {
      res.status(404).json({ error: `User ${userId} not found` });
    } else {
      await dbModule.deleteOneUser(dbModule.newId(userId));
      res.json({ message: `User ${userId} deleted` });
    }

  } catch (err) {
    next(err);
 }
});
 
 export {router as userRouter};