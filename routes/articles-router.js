const articlesRouter = require('express').Router();
const {getAllArticles, getArticle, patchVotesByArticleId} = require('../controllers/articles.controller.js')
const {getAllCommentsByArticleId, postNewCommentByArticleId} = require('../controllers/comments.controller.js')

articlesRouter.get('/', getAllArticles);

articlesRouter.route('/:article_id')
    .get(getArticle)
    .patch(patchVotesByArticleId);

articlesRouter.route('/:article_id/comments')
    .get(getAllCommentsByArticleId)
    .post(postNewCommentByArticleId);

module.exports = articlesRouter;