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
        expect(body.length === 13).toBe(true)
        expect(body[0]).toEqual({
          article_id: 3,
          title: 'Eight pug gifs that remind me of mitch',
          topic: 'mitch',
          author: 'icellusedkars',
          created_at: '2020-11-03T09:12:00.000Z',
          votes: 0,
          article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
          comment_count: '2'
        })
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
  test('Test connection with GET api/articles and get expected keys and values in descending order from created_at', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({body}) => {
        expect(body.length === 13).toBe(true)
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


describe('Test GET api/article/:article_id/comments endpoint', () => {
  test('Test connection with GET api/article/:article_id/comments, should receive 200 as the status code to show connection', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
  })

  test('Test connection with GET api/article/:article_id/comments, should return all 12 comments connected to the article 1 and ensure they all have the correct keys and types of values', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({body}) => {
        expect(body.length === 12)

        body.comments.forEach((article) => {
          expect(article['votes']).toBeInteger()
          expect(article['comment_id']).toBeInteger()
          expect(article['article_id']).toBeInteger()
          expect(article['author']).toBeString()
          expect(article['body']).toBeString()
          expect(article['created_at']).toBeString()
        })
        expect(body.comments[0]).toEqual({
          comment_id: 5,
          body: 'I hate streaming noses',
          article_id: 1,
          author: 'icellusedkars',
          votes: 0,
          created_at: '2020-11-03T21:00:00.000Z'
        })
      })
  })

  test('Test connection with GET api/article/:article_id/comments, should return all 12 comments connected to the article 1 but ensure it is in DESCENDING order so newest comments appear first', () => {
    
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({body}) => {
        expect(body.length === 12)
        expect(body.comments).toBeSortedBy('created_at', {
          descending : true

        })
      })
  })
  test('Test connection with GET api/article/:article_id/comments, should return an empty array when there is an article but no comments', () => {
    return request(app)
      .get('/api/articles/2/comments')
      .expect(200)
      .then(({body}) => {
        expect(body).toEqual({comments:[]})
      })
  })
  test('Test connection with GET api/article/:article_id/comments, should return 404 Article Not Found response when there is no article with that article_id', () => {
    return request(app)
      .get('/api/articles/100/comments')
      .expect(404)
      .then(({body}) => {
        expect(body).toEqual({msg:"Article Not Found"})
      })
  })
  test('Test connection with GET api/article/:article_id/comments, should return 400 Bad Request response when the article_id is in the wrong format', () => {
    return request(app)
      .get('/api/articles/banana/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Bad Request" })
      })
  })
})



describe('Test POST /api/article/:article_id/comments endpoint', () => {
  test('Test connection with /api/article/:article_id/comments endpoint', () => {
    return request(app)
      .post('/api/articles/1/comments')
      .send({username:"butter_bridge", body: "pretty cool"})
      .expect(201)
  })

  test('Test new comment is made to database as confirmed by returned object of what was added to database', () => {
    return request(app)
      .post('/api/articles/1/comments')
      .send({username:"butter_bridge", body: "pretty cool"})
      .expect(201)
      .then(({body}) => {
        expect(body).toMatchObject({
          comment_id: 19,
          body: 'pretty cool',
          article_id: 1,
          author: 'butter_bridge',
          votes: 0
        }) 
      })
  })

  test('Test new comment is made to database even when body is given extra properties that are not needed', () => {
    return request(app)
      .post('/api/articles/1/comments')
      .send({username:"butter_bridge", body: "pretty cool", extra: "I'm an extra"})
      .expect(201)
  })

  test('Test error when article does not exist', () => {
    return request(app)
      .post('/api/articles/9999/comments')
      .send({username:"butter_bridge", body: "pretty cool"})
      .expect(404)
      .then(({body}) => {
        expect(body).toEqual({msg:"Article Not Found"})
      })
  })

  test('Test error when username does not exist', () => {
    return request(app)
      .post('/api/articles/1/comments')
      .send({username:"THISUSERSHOULDNOTEXIST", body: "pretty cool"})
      .expect(404)
      .then(({body}) => {
        expect(body).toEqual({msg:"Username Not Found"})
      })
  })

  test('Test should return 400 Bad Request response when the article_id is in the wrong format', () => {
    return request(app)
      .post('/api/articles/banana/comments')
      .send({username:"butter_bridge", body: "pretty cool"})
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Bad Request" })
      })
  })

  test('Test should return 400 Bad Request response when there is no attached body', () => {
    return request(app)
      .post('/api/articles/1/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Bad Request" })
      })
  })

  test('Test should return 400 Bad Request response when the body does not have the correct information', () => {
    return request(app)
      .post('/api/articles/1/comments')
      .send({votes: 20, created_at: 1584205320000})
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Bad Request" })
      })
  })
  test('Test no new comment is made when sent body is empty', () => {
    return request(app)
      .post('/api/articles/1/comments')
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Bad Request" })
      })
  })
})

describe('Test PATCH /api/articles/:article_id endpoint', () => {
  test('Test connection with PATCH /api/articles/:article_id endpoint', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({inc_votes : 1})
      .expect(200)
  })

  test('Test article is returned with updated votes plus 1', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({inc_votes : 1})
      .expect(200)
      .then(({body}) => {
        expect(body).toMatchObject({
          article_id: 1,
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: '2020-07-09T20:11:00.000Z',
          votes: 101,
          article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
        })
      })
  })

  test('Test article is returned with updated votes plus 10', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({inc_votes : 10})
      .expect(200)
      .then(({body}) => {
        expect(body).toMatchObject({
          article_id: 1,
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: '2020-07-09T20:11:00.000Z',
          votes: 110,
          article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
        })
      })
  })

  test('Test article is returned with updated votes minus 10', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({inc_votes : -10})
      .expect(200)
      .then(({body}) => {
        expect(body).toMatchObject({
          article_id: 1,
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: '2020-07-09T20:11:00.000Z',
          votes: 90,
          article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
        })
      })
  })


  test('Test article is returned with updated votes plus 50', () => {
    return request(app)
      .patch('/api/articles/5')
      .send({inc_votes : 50})
      .expect(200)
      .then(({body}) => {

        expect(body).toMatchObject({
          article_id: 5,
          title: 'UNCOVERED: catspiracy to bring down democracy',
          topic: 'cats',
          author: 'rogersop',
          body: 'Bastet walks amongst us, and the cats are taking arms!',
          created_at: '2020-08-03T13:14:00.000Z',
          votes: 50,
          article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
        })

      })
  })

  test('Test connection with PATCH /api/articles/:article_id endpoint even when given extra unneeded properties in body', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({inc_votes : 1, banana:"Banana"})
      .expect(200)
  })


  test('Test should return 400 Bad Request response when the body does not have the correct information', () => {
    return request(app)
      .patch('/api/articles/banana')
      .send({votes: 20, created_at: 1584205320000})
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Bad Request" })
      })
  })


  test('Test should return 400 Bad Request response when the body does not have the correct information', () => {

    return request(app)
      .patch('/api/articles/1')
      .send({votes: 20})
      .expect(400)
      .then(({ body }) => {

        expect(body).toEqual({ msg: "Bad Request" })
      })
  })

  test('Test should return 400 Bad Request response when the body does not have the correct information', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Bad Request" })
      })
  })

  test('Test should return 404 Article Not Found response when there is no article with that id', () => {
    return request(app)
      .patch('/api/articles/99999')
      .send({inc_votes: 20})
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Article Not Found" })
      })
  })



})


describe('Test get /api/users', () => {
  test('Test connection with /api/users', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
  })

  test('Test all objects returned have (username name avatar_url) keys', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({body}) => {
        expect(body.users.length === 4).toBe(true)
        body.users.forEach((user) => {
          expect(user.hasOwnProperty("username")).toBe(true)
          expect(user.hasOwnProperty("name")).toBe(true)
          expect(user.hasOwnProperty("avatar_url")).toBe(true)
        })
      })
  })

  test('Test all objects returned have correct keys and values', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({body}) => {
        expect(body.users).toMatchObject(testData.userData)
      })
  })
})