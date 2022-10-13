const app = require("../app");

const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data/index");

const testData = { articleData, commentData, topicData, userData };

beforeEach(() => seed(testData));

afterAll(() => {
  if (db.end) db.end();
});

describe("test3.get /api/topics", () => {
  test("200: responds with array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const {
          body: { category },
        } = response;
        expect(category).toHaveLength(3);
        expect(Array.isArray(category)).toBe(true);
        category.forEach((eachCategory) => {
          expect(eachCategory).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});
test("should return all 3 topics", () => {
  return request(app)
    .get("/api/topics")
    .expect(200)
    .then(({ body }) => {
      expect(body).toEqual({
        category: [
          {
            description: "The man, the Mitch, the legend",
            slug: "mitch",
          },
          {
            description: "Not dogs",
            slug: "cats",
          },
          {
            description: "what books are made of",
            slug: "paper",
          },
        ],
      });
    });
});

describe("test4.get /api/articles/:article_id", () => {
  test("200: responds with an object of article id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        expect(typeof response).toBe("object");
        expect.objectContaining({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
        });
      });
  });
});
test("status:400, Handling psql errror for /api/articles/banana, retorn an error message when passed article id that is of an invalid type ' ", () => {
  return request(app)
    .get("/api/articles/banana")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request, invalid article id");
    });
});
test("status:404, Handling for /api/articles/9999, return an error message when passed article id that doesn't exist in database' ", () => {
  return request(app)
    .get("/api/articles/9999")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Id not found");
    });
});

describe("test5.get /api/users", () => {
  test("200: responds with array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        expect(response.body.users).toBeInstanceOf(Array);
        expect(response.body.users).toHaveLength(4);
        response.body.users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});
test("should return 4 users", () => {
  return request(app)
    .get("/api/users")
    .expect(200)
    .then((response) => {
      expect(response.body.users).toEqual([
        {
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
          name: "jonny",
          username: "butter_bridge",
        },
        {
          avatar_url:
            "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
          name: "sam",
          username: "icellusedkars",
        },
        {
          avatar_url:
            "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
          name: "paul",
          username: "rogersop",
        },
        {
          avatar_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          name: "do_nothing",
          username: "lurker",
        },
      ]);
    });
});

describe("test6. PATCH /api/articles/:article_id", () => {
  test("status 201: should update the vote field of specified article id and respond with new object", () => {
    const ARTICLE_ID = 1;
    return request(app)
      .patch(`/api/articles/${ARTICLE_ID}`)
      .send({ inc_votes: -50 })
      .expect(201)
      .then(({ body }) => {
        expect(body).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 50,
        });
      });
  });
});
test("status 400,responds with an error when passed invalid id", () => {
  const ARTICLE_ID = "Banana";
  return request(app)
    .patch(`/api/articles/${ARTICLE_ID}`)
    .send({ inc_votes: -50 })
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request, invalid article id");
    });
});
test("status 400,responds with an error when passed invalid input", () => {
  const ARTICLE_ID = 1;
  return request(app)
    .patch(`/api/articles/${ARTICLE_ID}`)
    .send({ inc_votes: "Banana" })
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Invalid article input");
    });
});
test("status 400,responds with an error when passed empty input ", () => {
  const ARTICLE_ID = 1;
  return request(app)
    .patch(`/api/articles/${ARTICLE_ID}`)
    .send({})
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Missing required fields");
    });
});
test("status 404,responds with an error when passed invalid input", () => {
  const ARTICLE_ID = 9999;
  return request(app)
    .patch(`/api/articles/${ARTICLE_ID}`)
    .send({ inc_votes: -100 })
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Id not found");
    });
});

describe("test7.get /api/articles/:article_id", () => {
  test("200: responds with an object of article id + comment count", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        expect(typeof response).toBe("object");
        expect.objectContaining({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(Number),
        });
      });
  });
});
test("should respond with an correct article id", () => {
  return request(app)
    .get("/api/articles/1")
    .expect(200)
    .then(({ body }) => {
      expect(body).toEqual({
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 100,
        comment_count: `11`,
      });
    });
});
