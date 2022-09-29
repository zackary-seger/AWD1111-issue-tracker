import Debug from 'debug';
const debugMain = Debug('app:routes:user');

import express from 'express';
import moment from 'moment';
import _ from 'lodash';
import { nanoid } from 'nanoid';

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

//define routes
router.get('/api/pet/list', async (req, res, next) => {
  try {
    const pets = await dbModule.findAllPets();
    res.json(pets);
  } catch (err) {
    next(err);
  }
});

router.get('/api/pet/:petId', async (req, res, next) => {
  try {
    const petId = dbModule.newId(req.params.petId);
    const pet = await dbModule.findPetById(petId);
    if (!pet) {
      res.status(404).json({ error: ` ${petId} Pet not found` });
    } else {
      res.json(pet);
    }
  } catch (err) {
    next(err);
  }
});

//create
router.put('/api/pet/new', async (req, res, next) => {
  try {
    const pet = {
      _id: dbModule.newId(),
      species: req.body.species,
      name: req.body.name,
      age: parseInt(req.body.age),
      gender: req.body.gender,
    };

  //validation
  if (!pet.species) {
    res.status(400).json({ error: 'Species required' });
  } else if (!pet.name) {
    res.status(400).json({ error: 'Name required' });
  } else if (!pet.age) {
    res.status(400).json({ error: 'Age required' });
  } else if (!pet.gender) {
    res.status(400).json({ error: 'Gender required' });
  } else {
    await dbModule.insertOnePet(pet);
    res.json({ message: 'Pet created' });
  }
  } catch (err) {
    next(err);
  }
});

//update
router.put('/api/pet/:petId', async (req, res, next) => {
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

//delete
router.delete('/api/pet/:petId', async (req, res, next) => {
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