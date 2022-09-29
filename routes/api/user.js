import Debug from 'debug';
const debugMain = Debug('app:routes:user');

import express from 'express';
import moment from 'moment';
import _ from 'lodash';
import { nanoid } from 'nanoid';

// FIXME: use this array to store user data in for now
//        we will replace this with a database in a later assignment
const usersArray = [
                    { 
                      _id:"QI7lUo5YfZYtCHNSU43Ws", 
                      email: "zackary@seger.us", 
                      password: "123456", 
                      firstName: "Zackary", 
                      lastName: "Seger", 
                      role:"Developer"
                    },
                    { 
                      _id:"QI7lUo5YfZYtCHNSU43W7", 
                      email: "robert@seger.us", 
                      password: "123456", 
                      firstName: "Robert", 
                      lastName: "Seger", 
                      role:"Project Manager"
                    }
                   ];

// Create & Export Router
const router = express.Router();

// Register Routes
router.get('/list', (req, res, next) => {
  res.json(usersArray);
});

router.get('/:userId', (req, res, next) => {
 // FIXME: get user from users array and send response as JSON;
 const foundUser = req.params.userId;
 if (!foundUser){
  res.status(404).json({ error: 'User not found..'});
 } else {
  res.json(foundUser);
 }
});

router.put('/register', (req, res, next) => {

  // FIXME: register new user and send response as JSON

  const _id = nanoid();
  const { email, password, firstName, lastName, role } = req.body;
  const fullName = firstName + '' + lastName;

  const newUser =  {
    _id,
    email,
    password,
    firstName,
    lastName,
    role
  }

  if(!email){
    res.status(400).json({error: "Email Required"});
  } else if (!password){
    res.status(400).json({error: "Password Required"});
  } else if (!firstName){
    res.status(400).json({error: "First Name Required"});
  } else if (!lastName){
    res.status(400).json({error: "Last Name Required"});
  } else if (!role){
    res.status(400).json({error: "Role Required"});
  } else {
    usersArray.push(newUser);
    res.json(newUser);
  }

});

router.post('/login', (req, res, next) => {
  // FIXME: check users email and password and send response as JSON
  const email = req.body.email;
  const password = req.body.password;

  debugMain(`Email is: ${email}`)

  let foundUser = false;

  for (let index = 0; index < usersArray.length; index++) {
    if(usersArray[index].email == email && usersArray[index].password == password) {
      res.json(usersArray[index]);
      foundUser = true;
    }
  }

  if (!foundUser) {
    res.status(404).json({error:'User Not Found'});
  }
  
});

router.put('/:userId', (req, res, next) => {

  // FIXME: update existing user and send response as JSON;
  
  const userId = req.params.userId;
  const { email, password, firstName, lastName, role } = req.body;
  const user = usersArray.find((user) => user._id == userId);

  if (!user) {
    res.status(404).json({ error: 'User Not Found'});
  } else {
    if (email != undefined) {
      user.email = email;
    }
    if (password != undefined) {
      user.password = password;
    }
    if (firstName != undefined) {
      user.firstName = firstName;
    }
    if (lastName != undefined) {
      user.lastName = lastName;
    }
    if (role != undefined) {
      user.role = role;
    }
    res.json(user);
  }


});

router.delete('/:userId', (req, res, next) => {
  // FIXME: delete user and send response as JSON;
  const userId = req.params.userId;
  const index = usersArray.findIndex((user) => user._id == userId);
  if (index < 0) {
    res.status(404).json({error: "User Not Found"});
  } else {
    usersArray.splice(index, 1);
    res.json({message: 'User Deleted!'});
  }
 });
 
 export {router as userRouter};