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