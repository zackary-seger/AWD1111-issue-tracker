import Debug from 'debug';
const debugMain = Debug('app:routes:user');
import * as dbModule from '../../database.js';
import Joi from 'joi';
import express from 'express';
import _ from 'lodash';
import { validId } from '../../middleware/validId.js';
import { validBody } from '../../middleware/validBody.js';

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
    res.json(users);
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

// Create User
router.put('/register', validBody(newUserSchema), async (req, res, next) => {
  
  try {

    const foundUser = await dbModule.findUserByEmail(req.body.email);

    if (!foundUser) {

        const user = req.body;

        await dbModule.insertOneUser(user);
        res.status(200).json({ message: 'New User Registered!' });

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