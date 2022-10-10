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

const newCommentSchema = Joi.object({
  authorId: Joi.string().required(),
  content: Joi.string().required()
});

router.get('/:bugId/comment/list', validId('bugId'), async (req, res, next) => {
  
  try {
    const comments = await dbModule.findAllCommentsByBugId();
    res.json(comments);
  } catch (err) {
    next(err);
  }

});

router.get('/:bugId/comment/:commentId', validId('bugId'), validId('commentId'), async (req, res, next) => {

   // Get bugs from bugs array and send response as JSON;
 const bugId = req.bugId;
 const commentId = req.commentId;

 const foundBug = await dbModule.findAllCommentsByCommentIdAndBugId(dbModule.newId(commentId), dbModule.newId(bugId));
 if (!foundBug){
  res.status(404).json({ error: 'Bug not found..'})
 } else {
  res.json(foundBug);
 }

});

router.put('/:bugId/comment/new', validId('bugId'), validBody(newCommentSchema), async (req, res, next) => {
  
  // Create new bug and send response as JSON

  const bugId = req.bugId;
  const authorId = req.body.authorId;
  const content  = req.body.content;

  const newComment =  {
    authorId,
    content,
  }

  await dbModule.insertOneCommentToAllComments(newComment);
  await dbModule.insertOneCommentToBug(newComment, bugId);
  
  res.status(200).json(newComment);
  
});

// Export Router
export {router as commentRouter};