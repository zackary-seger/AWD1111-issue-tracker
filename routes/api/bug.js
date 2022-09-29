import Debug from 'debug';
const debugMain = Debug('app:routes:user');

import express from 'express';
import moment from 'moment';
import _ from 'lodash';
import { nanoid } from 'nanoid';

// FIXME: use this array to store user data in for now
//        we will replace this with a database in a later assignment
const bugsArray = [
                    {
                     _id: 'uSj6YOkTLbxSlTOQfLTML', 
                     title: 'First Bug',
                     description: 'This is a test description',
                     createdDateTime: new Date(),
                    },
                    {
                      _id: 'uSj6YOkTLbxFyEOQfLTMY', 
                      title: 'Second Bug',
                      description: 'This is a second test description',
                      createdDateTime: new Date(),
                    },
                    {
                    "_id":{"$oid":"63235e010b392e38dc17eaff"},
                     "createdById":{"$oid":"631bb8e8845c498b8faba4c5"},
                     "assignedToId":{"$oid":"631bb8e8845c498b8faba4c5"},
                     "title":"Test Bug Title",
                     "description":"This is a test bug entry.",
                     "reproductionSteps":"Insert Bug",
                     "classification":"unclassified",
                     "closed":false,
                     "createdDateTime":{"$date":{"$numberLong":"1663262209390"}},
                     "bugEdits":[{"authorId":null,"changes":"No changes this is a test.","dateTime":{"$date":{"$numberLong":"1663262209390"}}}],
                     "bugComments":[{"authorId":{"$oid":"631bb8e8845c498b8faba4c5"},"content":"No changes this is a test.","dateTime":{"$date":{"$numberLong":"1663262209390"}}},{"authorId":{"$oid":"631bb8e8845c498b8faba4c6"},"content":"No changes this is another test.","dateTime":{"$date":{"$numberLong":"1663262209390"}}}],
                     "bugTestCases":[{"authorId":null,"content":"No changes this is a test.","passFail":true}],"timeSpent":[{"devId":{"$oid":"631bb8e8845c498b8faba4c7"},"hoursEntered":{"$numberInt":"5"},"dateTime":{"$date":{"$numberLong":"1663262209390"}}}]
                    }
                    
                  ];

// Create Router
const router = express.Router()

// Register Routes
router.get('/list', (req, res, next) => {
  res.json(bugsArray);
});

router.get('/:bugId', (req, res, next) => {
 // FIXME: get bugs from bugs array and send response as JSON;
 const foundBug = req.params._id;
 if (!foundBug){
  res.status(404).json({ error: 'Bug not found..'})
 } else {
  res.json(foundBug);
 }
});

router.put('/new', (req, res, next) => {
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

router.put('/:bugId', (req, res, next) => {
  // FIXME: update existing bug and send response as JSON;
  const bugId = req.params.bugId;
  const { createdById,
          assignedToId,
          title,
          description,
          reproductionSteps,
          classification,
          closed } = req.body;

  const foundBug = bugsArray.find((bug) => bug._id == bugId);

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

router.put('/:bugId/classify', (req, res, next) => {
  // FIXME: classify bug and send response as JSON;
  const bugId = req.params.bugId;
  const {classification} = req.body;
  const foundBug = bugsArray.find((bug) => bug._id == bugId);

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

router.put('/:bugId/assign', (req, res, next) => {
  // FIXME: assign bug to user and send response as JSON;
  const bugId = req.params.bugId;
  const userId = req.body.userId;
  const userName = req.body.userName;
  const foundBug = bugsArray.find((bug) => bug._id == bugId);

  if (!foundBug) {
    res.status(404).json({ error: `Bug ${bugId} Not Found`});
  } else {
    if (userId != undefined) {
      foundBug.assignedToUserId = userId;
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

    res.status(200).type("text/plain").send("Bug Assigned!");
    res.json(foundBug);

}});

router.put('/:bugId/close', (req, res, next) => {
  // FIXME: close bug and send response as JSON;
  const bugId = req.params.bugId;
  const closed = req.body.closed;
  const foundBug = bugsArray.find((bug) => bug._id == bugId);

  if (!foundBug) {
    res.status(404).json({ error: `Bug ${bugId} Not Found`});
  } else { 
    foundBug.closed = true;
    foundBug.closedOn = new Date();
    foundBug.lastUpdated = new Date();
  }

  res.status(200).type("text/plain").send("Bug Closed!");
  res.json(foundBug);
});
 
// Export Router
export {router as bugRouter};