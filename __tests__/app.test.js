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
          .then(({body}) => {
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
            .then(({body}) => {
                expect(body.length > 0).toBe(true)
                expect(body).toEqual([{"description": "The man, the Mitch, the legend", "slug": "mitch"}, 
                  {"description": "Not dogs", "slug": "cats"}, 
                  {"description": "what books are made of", "slug": "paper"}
                ])
            })        
    })
})

describe('Test GET api/articles  endpoint', () => {
  test('Test connection with GET api/articles, should receive 200 as the status code to show connection', () => {
      return request(app)
          .get('/api/articles/1')
          .expect(200)                  
  })
  test('Test connection with GET api/articles, should receive all topics which should have keys (slug and description)', () => {
      return request(app)
          .get('/api/articles/1')
          .expect(200)
          .then(({body}) => {
              expect(body.length > 0).toBe(true) 
              console.log(body)
              expect(body).toEqual([{
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 100,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              }])
          })        
  })
})