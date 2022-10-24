import Debug from 'debug';
const debugMain = Debug('app:routes:user');
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
    res.json(bugs);
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