import Debug from 'debug';
const debugMain = Debug('app:routes:user');
import * as dbModule from '../../database.js';

import express from 'express';
import moment from 'moment';
import _ from 'lodash';
import { nanoid } from 'nanoid';

// Create Router
const router = express.Router()

// Register Routes
router.get('/list', async (req, res, next) => {
  try {
    const bugs = await dbModule.findAllBugs();
    res.json(bugs);
  } catch (err) {
    next(err);
  }
});

router.get('/:bugId', async (req, res, next) => {
 // FIXME: get bugs from bugs array and send response as JSON;
 const bugId = req.params.bugId;
 const foundBug = await dbModule.findBugById(dbModule.newId(bugId));
 if (!foundBug){
  res.status(404).json({ error: 'Bug not found..'})
 } else {
  res.json(foundBug);
 }
});

router.put('/new', async (req, res, next) => {
  // FIXME: create new bug and send response as JSON
  const _id = nanoid();
  const { createdById,
          assignedToId,
          title,
          description,
          reproductionSteps,
          classification,
          closed } = req.body;

  const newBug =  {
    _id,
    createdById,
    assignedToId,
    title,
    description,
    reproductionSteps,
    classification,
    closed
  }

  if(!createdById){
    res.status(400).json({error: "Created by ID Required"});
  } else if (!assignedToId){
    res.status(400).json({error: "Assigned to ID Required"});
  } else if (!title){
    res.status(400).json({error: "Title Required"});
  } else if (!description){
    res.status(400).json({error: "Description Required"});
  } else if (!reproductionSteps){
    res.status(400).json({error: "Reproduction Steps Required"});
  } else if (!classification){
    res.status(400).json({error: "Classification Required"});
  } else if (!closed){
    res.status(400).json({error: "Closed Required"});
  } else {
    bugsArray.push(newBug);
    res.type("text/plain").send("New Bug Reported!");
    res.json(newBug);
  }
});

router.put('/:bugId', async (req, res, next) => {
  // FIXME: update existing bug and send response as JSON;
  const bugId = req.params.bugId;
  const { createdById,
          assignedToId,
          title,
          description,
          reproductionSteps,
          classification,
          closed } = req.body;

  const foundBug = dbModule.findBugById(dbModule.newId(bugId))

  if (!foundBug) {
    res.status(404).json({ error: 'Bug Not Found'});
  } else {
    if (createdById != undefined) {
      foundBug.createdById = createdById;
    }
    if (assignedToId != undefined) {
      foundBug.assignedToId = assignedToId;
    }
    if (title != undefined) {
      foundBug.title = title;
    }
    if (description != undefined) {
      foundBug.description = description;
    }
    if (reproductionSteps != undefined) {
      foundBug.reproductionSteps = reproductionSteps;
    }
    if (classification != undefined) {
      foundBug.classification = classification;
    }
    if (closed != undefined) {
      foundBug.closed = closed;
    }
    res.type("text/plain").send("Bug Updated!");
    res.json(foundBug);
  } 
});

router.put('/:bugId/classify', async (req, res, next) => {
  // FIXME: classify bug and send response as JSON;
  const bugId = req.params.bugId;
  const {classification} = req.body;
  const foundBug = dbModule.findBugById(dbModule.newId(bugId));

  if (!foundBug) {
    res.status(404).json({ error: 'Bug Not Found'});
  } else {
    if (classification != undefined) {
      foundBug.classification = classification;
      foundBug.classifiedOn = new Date();
      foundBug.lastUpdated = new Date();
    }
    res.status(200).type("text/plain").send("Bug Updated!");
    res.json(foundBug);
}});

router.put('/:bugId/assign', async (req, res, next) => {
  // FIXME: assign bug to user and send response as JSON;
  const bugId = req.params.bugId;
  const userId = req.body.userId;

  const foundBug = await dbModule.findBugById(dbModule.newId(bugId));
  const user = await dbModule.findUserById(dbModule.newId(userId));
  const userName = user.fullName;

  if (!foundBug) {
    res.status(404).json({ error: `Bug ${bugId} Not Found`});
  } else {
    if (user != undefined) {
      foundBug.assignedToUserId = dbModule.newId(userId);
    } else {
      res.status(404).json({ error: `UserId ${userId} Not Found`});
    }

    if (userName != undefined) {
      foundBug.assignedToUserName = userName;
    } else {
      res.status(404).json({ error: `Username ${userName} Not Found`});
    }

    foundBug.assignedOn = new Date();
    foundBug.lastUpdated = new Date();

    res.status(200).type("text/plain").json({ message: `Bug ${bugId} assigned!`, bugId });

}});

router.put('/:bugId/close', async (req, res, next) => {
  // FIXME: close bug and send response as JSON;
  const bugId = req.params.bugId;

  const foundBug = dbModule.findBugById(dbModule.newId(bugId));

  if (!foundBug) {
    res.status(404).json({ error: `Bug ${bugId} Not Found`});
  } else { 
    foundBug.closed = true;
    foundBug.closedOn = new Date();
    foundBug.lastUpdated = new Date();
  }

  res.status(200).type("text/plain").json({ message: `Bug ${bugId} closed!`, bugId });
});
 
// Export Router
export {router as bugRouter};