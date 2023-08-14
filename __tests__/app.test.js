const app = require('../app');
const request = require('supertest');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const { topicData, userData, articleData, commentData } = require('../db/data/test-data/');

beforeEach(() => seed({ topicData, userData, articleData, commentData }));
afterAll(() => db.end());

describe('Test /api/topics endpoint', () => {
    test('Test connection with /api/topics, should receive 200 as the status code to show connection', () => {
        return request(app)
            .get('/api/topics')
            .expect(200)                  
    })
    test('Test connection with /api/topics, should receive all topics which should have keys (slug and description)', () => {
        return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({body}) => {
                body.forEach((topic) => {
                    expect(Object.keys(topic)).toEqual(
                      expect.arrayContaining([
                        "slug",
                        "description"
                      ])
                    );
                  });
            })        
    })
})