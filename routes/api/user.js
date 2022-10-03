import Debug from 'debug';
const debugMain = Debug('app:routes:user');
import * as dbModule from '../../database.js';

import express from 'express';
import moment from 'moment';
import _ from 'lodash';
import { nanoid } from 'nanoid';
import { ObjectID } from 'bson';

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
router.put('/login', async (req, res, next) => {
  
  try {

    const foundUser = await dbModule.findUserByEmail(req.body.email);
    const email = req.body.email;
    const password = req.body.password;

    const user = await dbModule.readUserByEmail(email);
    const userPassword = user.password;

    if (!email) {
      res.status(404).json({ error: ` You must enter an email address ` });
    } else if (!password) {
      res.status(404).json({ error: ` You must enter a password ` });
    } else if (!foundUser) {
      res.status(404).json({ error: ` ${user.userId} User not found` });  
    } else if (password != userPassword) {
        res.status(404).json({ error: ` Invalid password. Please try again..` });  
    } else {
      res.status(200).json( `Welcome back ${user.fullName}!` );
    }
  } catch (err) {
    next(err);
  }

});

// Update User
router.put('/:userId', async (req, res, next) => {
  try{
    const userId = dbModule.newId(req.params.userId);
    const update = req.body;
    debug(`Update User ${userId}`, update);

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
router.delete('/:userId', async (req, res, next) => {
 try{
    const userId = req.params.userId;
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