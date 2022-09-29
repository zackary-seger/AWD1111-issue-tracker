import Debug from 'debug';
const debugMain = Debug('app:routes:user');
import * as dbModule from '../../database.js';

import express from 'express';
import moment from 'moment';
import _ from 'lodash';
import { nanoid } from 'nanoid';
import { ObjectID } from 'bson';

// FIXME: use this array to store user data in for now
//        we will replace this with a database in a later assignment
// const usersArray = [
//                     { 
//                       _id:"QI7lUo5YfZYtCHNSU43Ws", 
//                       email: "zackary@seger.us", 
//                       password: "123456", 
//                       firstName: "Zackary", 
//                       lastName: "Seger", 
//                       role:"Developer"
//                     },
//                     { 
//                       _id:"QI7lUo5YfZYtCHNSU43W7", 
//                       email: "robert@seger.us", 
//                       password: "123456", 
//                       firstName: "Robert", 
//                       lastName: "Seger", 
//                       role:"Project Manager"
//                     }
//                    ];

// Create & Export Router
const router = express.Router();

// Define Routes

// Find all Users
router.get('/list', async (req, res, next) => {
  try {
    const users = await dbModule.findAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// Find User
router.get('/:userId', async (req, res, next) => {
  try {
    const userId = dbModule.newId(req.params.userId);
    const user = await dbModule.findUserById(userId);
    if (!user) {
      res.status(404).json({ error: ` ${userId} User not found` });
    } else {
      res.json(user);
    }
  } catch (err) {
    next(err);
  }
});

// Create User
router.put('/register', async (req, res, next) => {
  
  try {

    const foundUser = await dbModule.findUserByEmail(req.body.email);

    if (foundUser == false) {
      
      try {
        const user = {
          _id: new ObjectID(),
          email: req.body.email,
          password: req.body.password,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          fullName: req.body.firstName + " " + req.body.lastName,
          role: req.body.role,
          createdDateTime: new Date()
        };
    
      // Validation
      if (!user.email) {
        res.status(400).json({ error: 'Email required..' });
      } else if (!user.password) {
        res.status(400).json({ error: 'Password required..' });
      } else if (!user.firstName) {
        res.status(400).json({ error: 'First Name required..' });
      } else if (!user.lastName) {
        res.status(400).json({ error: 'Last Name required..' });
      } else {
        await dbModule.insertOneUser(user);
        res.status(200).json({ message: 'New User Registered!' });
      }
      } catch (err) {
        next(err);
      }

    } else {
        res.status(400).json({ error: 'Email already in use..' });
    }
    
  } catch (err) {
    next(err);
  }
  
 
});

// Login User
router.get('/login', async (req, res, next) => {
  try {

    const email = await dbModule.newId(req.body.email);
    const password = await dbModule.findUserById(req.body.password);

    if (!user) {
      res.status(404).json({ error: ` ${userId} User not found` });
    } else {
      res.json(user);
    }
  } catch (err) {
    next(err);
  }
});

// Update User
router.put('/:userId', async (req, res, next) => {
  try{
    const petId = dbModule.newId(req.params.petId);
    const update = req.body;
    debug(`update pet ${petId}`, update);

    const pet = await dbModule.findPetById(petId);
    if (!pet) {
      res.status(404).json({ error: ` ${petId} Pet not found` });
    } else {
      await dbModule.updateOnePet(petId, update);
      res.json({ message: ` ${petId} Pet updated` });
    }
  } catch (err) {
    next(err);
  }
});

//Delete User
router.delete('/:userId', async (req, res, next) => {
 try{
    const petId = dbModule.newId(req.params.petId);
    debug(`delete pet ${petId}`);

    const pet = await dbModule.findPetById(petId);
    if (!pet) {
      res.status(404).json({ error: ` ${petId} Pet not found` });
    } else {
      await dbModule.deleteOnePet(petId);
      res.json({ message: ` ${petId} Pet deleted` });
    }
  } catch (err) {
    next(err);
 }
});
 
 export {router as userRouter};