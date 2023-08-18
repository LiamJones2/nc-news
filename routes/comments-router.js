const commentsRouter = require('express').Router();
const {deleteCommentByCommentId, patchVoteByCommentId} = require('../controllers/comments.controller.js')

commentsRouter.delete('/:comment_id', deleteCommentByCommentId);

commentsRouter.patch('/:comment_id', patchVoteByCommentId);

module.exports = commentsRouter;