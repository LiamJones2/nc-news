const app = require('../app');
const request = require('supertest');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/');
const endpoints = require('../endpoints.json')

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('Test GET /api endpoint', () => {
  test('Test connection with GET /api, should receive 200 as the status code to show connection', () => {
    return request(app)
      .get('/api')
      .expect(200)
  })
  test('Test connection with GET /api, should receive all /api showing all endpoints', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpoints)
      })
  })
})

describe('Test GET api/topics  endpoint', () => {
  test('Test connection with GET api/topics, should receive 200 as the status code to show connection', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
  })
  test('Test connection with GET api/topics, should receive all topics which should have keys (slug and description)', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(body.length > 0).toBe(true)
        expect(body).toEqual(testData.topicData)
      })
  })
})

describe('Test GET api/articles  endpoint', () => {
  test('Test connection with GET api/articles', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
  })
  test('Test connection with GET api/articles and get expected keys and values', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({body}) => {
        expect(body.length > 0).toBe(true)
        body.forEach((article) => {
          expect(article['author']).toBeString()
          expect(article['title']).toBeString()
          expect(article['article_id']).toBeInteger()
          expect(article['created_at']).toBeString()
          expect(article['votes']).toBeInteger()
          expect(article['article_img_url']).toBeString()
          expect(article['comment_count']).toBeInteger()
          expect(article['body']).toBe(undefined)
        })
      })
  })
  test('Test connection with GET api/articles and get expected keys and values', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({body}) => {
        expect(body.length > 0).toBe(true)
        expect(body).toBeSortedBy('created_at', {
          descending: true
        })
      })
  })
})

describe('Test GET api/article  endpoint', () => {
  test('Test connection with GET api/article, should receive 200 as the status code to show connection', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
  })
  test('Test connection with GET api/article, should receive an article', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({article : {
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        }})
      })
  })
  test('Test that article id requested does not exist causing a Not Found 404 response when given a number', () => {
    return request(app)
      .get('/api/articles/999999')
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Not Found" })
      })
  })
  test('Test that article id requested does not exist causing a Bad Request 400 response when given a random string', () => {
    return request(app)
      .get('/api/articles/banana')
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Bad Request" })
      })
  })
})