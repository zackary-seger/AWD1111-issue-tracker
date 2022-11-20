import Debug from 'debug';
const debugMain = Debug('app:routes:user');
import * as dbModule from '../../database.js';
import express from 'express';
import _ from 'lodash';
import Joi from 'joi';
import config from 'config';
import jwt from 'jsonwebtoken';
import { validId } from '../../middleware/validId.js';
import { validBody } from '../../middleware/validBody.js';
import { hasAnyRole } from '../../middleware/hasAnyRole.js';

// Create Router
const router = express.Router();

const newCommentSchema = Joi.object({
  authorId: Joi.string().required(),
  content: Joi.string().required()
});

router.get('/:bugId/comment/list', hasAnyRole(), validId('bugId'), async (req, res, next) => {
  
  if (req.cookies.authToken != undefined) {

    try {
      const comments = await dbModule.findAllCommentsByBugId();
      res.status(200).json(comments);
    } catch (err) {
      next(err);
    }
  
  } else {
    res.status(401).json({error: 'Error: you are not logged in.. Log in and try again..'});
  }

});

router.get('/:bugId/comment/:commentId', hasAnyRole(), validId('bugId'), validId('commentId'), async (req, res, next) => {

 if (req.cookies.authToken != undefined) {

  // Get bugs from bugs array and send response as JSON;
  const bugId = req.bugId;
  const commentId = req.commentId;

  const foundBug = await dbModule.findAllCommentsByCommentIdAndBugId(dbModule.newId(commentId), dbModule.newId(bugId));
  if (!foundBug){
    res.status(404).json({ error: 'Bug not found..'})
  } else {
    res.status(200).json(foundBug);
  }

} else {
  res.status(401).json({error: 'Error: you are not logged in.. Log in and try again..'});
}

});

router.put('/:bugId/comment/new', hasAnyRole(),  validId('bugId'), validBody(newCommentSchema), async (req, res, next) => {
  
  if (req.cookies.authToken != undefined) {

    // Create new bug and send response as JSON

    const secret = config.get('auth.secret');
    const token = req.cookies.authToken;

    // Below, we use the jwt.verify() function to access the data saved within our authToken 
    // cookie. That cookie contains the three variables we save inside it during our login stage.

    const payload = jwt.verify(token, secret);

    // Create new bug and send response as JSON

    const bugId = req.bugId;
    let authorId = dbModule.newId(payload.userId);
    const content  = req.body.content;

    authorId = dbModule.newId(authorId);

    const newComment =  {
      authorId,
      content,
      createdBy: dbModule.newId(payload.userId), 
      createdDateTime: new Date(),
    }

    await dbModule.insertOneCommentToAllComments(newComment);
    await dbModule.insertOneCommentToBug(newComment, bugId);
    
    res.status(200).json(newComment);

  } else {
    res.status(401).json({error: 'Error: you are not logged in.. Log in and try again..'});

  }
  
});

// Export Router
export {router as commentRouter};