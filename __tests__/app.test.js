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

describe("test8.get /api/articles", () => {
  test("200: responds with an array of all objects including all the data", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Array);
        expect(body).toHaveLength(12);
        body.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
});
test("200: responds with an array of only cats object articles, when filtering", () => {
  return request(app)
    .get(`/api/articles?topic=cats`)
    .expect(200)
    .then(({ body }) => {
      expect(body).toBeInstanceOf(Array);
      body.forEach((article) => {
        expect(article).toEqual(
          expect.objectContaining({
            topic: "cats",
          })
        );
      });
    });
});
test("200: responds with an array of only mitch object articles, when filtering", () => {
  return request(app)
    .get(`/api/articles?topic=mitch`)
    .expect(200)
    .then(({ body }) => {
      expect(body).toBeInstanceOf(Array);
      body.forEach((article) => {
        expect(article).toEqual(
          expect.objectContaining({
            topic: "mitch",
          })
        );
      });
    });
});
test("200: responds with an array of valid topic which has no articles.", () => {
  return request(app)
    .get(`/api/articles?topic=paper`)
    .expect(200)
    .then(({ body }) => {
      expect(body).toBeInstanceOf(Array);
      body.forEach((article) => {
        expect(article).toEqual({});
      });
    });
});

test("400: insert not existing topic and responds with a message- Invalid topic value ", () => {
  return request(app)
    .get(`/api/articles?topic=banana`)
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Invalid topic value");
    });
});
describe("test9.get /api/articles/:article_id/comments", () => {
  test("200: responds with an array of comments of certain article id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment).toBeInstanceOf(Array);
        expect(comment).toHaveLength(11);
        comment.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });
});
test("status:404, Handling for /api/articles/9999/comments, return an error message when passed article id that doesn't exist in database' ", () => {
  return request(app)
    .get("/api/articles/9999/comments")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Id not found");
    });
});
test("status:400, Handling psql errror for /api/articles/banana/comments, return an error message when passed article id that is of an invalid type ' ", () => {
  return request(app)
    .get("/api/articles/banana/comments")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request, invalid article id");
    });
});

// test9
// I would maybe add a test for what we would expect if there is a valid review but with no comments

// describe.only("test10. POST /api/articles/:article_id/comments", () => {
//   test("status:201, responds with a newly created comment", () => {
//     const newComment = {
//       username: "Jess Jelly",
//       body: "YO",
//     };
//     return request(app)
//       .post("/api/articles/1/comments")
//       .send(newComment)
//       .expect(201)
//       .then(({ body }) => {
//         const { comment } = body;
//         expect(comment).toBeInstanceOf(Array);
//         expect(comment).toHaveLength(1);
//         comment.forEach((eachComment) => {
//           expect(eachComment).toEqual(
//             expect.objectContaining({
//               comment_id: 2,
//               body: "YO",
//               article_id: 1,
//               author: "Jess Jelly",
//               votes: 0,
//               created_at: expect.any(String),
//             })
//           );
//         });
//       });
//   });
// });
// test("status:404, responds with an error message when insert invalid username ", () => {
//   const newComment = {
//     author: "Adam",
//     body: "YO",
//   };
//   return request(app)
//     .post("/api/articles/1/comments")
//     .send(newComment)
//     .expect(404)
//     .then(({ body }) => {
//       expect(body.msg).toBe("username not found");
//     });
// });

// test("status:400, responds with an error message 'Invalid input entered' ", () => {
//   return request(app)
//     .post("/api/articles/1/comments")
//     .expect(400)
//     .then(({ body }) => {
//       expect(body.msg).toBe("Missing required fields");
//     });
// });
// test("status:400, responds with an error message 'Bad input, please try again' ", () => {
//   const newComment = {
//     article_id: 1,
//     author: null,
//     body: "hello world",
//   };
//   return request(app)
//     .post("/api/articles/1/comments")
//     .expect(400)
//     .send(newComment)
//     .then(({ body }) => {
//       expect(body.message).toBe("Invalid input entered");
//     });
// });
// test("status:400, responds with an error message 'Bad input, please try again' ", () => {
//   const newComment = {
//     article_id: 1,
//     author: "Jess Jelly",
//     body: "hello world",
//   };
//   return request(app)
//     .post("/api/articles/banana/comments")
//     .expect(400)
//     .send(newComment)
//     .then(({ body }) => {
//       expect(body.message).toBe("Invalid id");
//     });
// });

// describe("test11.get /api/articles queries", () => {
//   test("200: responds with an array of all objects filtred by sort_by query", () => {
//     return request(app)
//       .get("/api/articles?sort_by=title")
//       .expect(200)
//       .then(({ body }) => {
//         console.log(body);
//         expect(body).toBeInstanceOf(Array);
//         expect(body).toHaveLength(12);
//         body.forEach((article) => {
//           expect(article).toEqual(
//             expect.objectContaining({
//               article_id: expect.any(Number),
//               title: expect.any(String),
//               topic: expect.any(String),
//               author: expect.any(String),
//               body: expect.any(String),
//               created_at: expect.any(String),
//               votes: expect.any(Number),
//               comment_count: expect.any(Number),
//             })
//           );
//         });
//       });
//   });
//   test("200: responds with an array of all objects filtred by date", () => {
//     return request(app)
//       .get("/api/articles")
//       .expect(200)
//       .then(({ body }) => {
//         console.log(body);
//         expect(body).toBeInstanceOf(Array);
//         expect(body).toHaveLength(12);
//       });
//   });
//   test("200: responds with an array of all objects filtred by order query", () => {
//     return request(app)
//       .get("/api/articles?order=asc")
//       .expect(200)
//       .then(({ body }) => {
//         console.log(body);
//         expect(body).toBeInstanceOf(Array);
//         expect(body).toHaveLength(12);
//         body.forEach((article) => {
//           expect(article).toEqual(
//             expect.objectContaining({
//               article_id: expect.any(Number),
//               title: expect.any(String),
//               topic: expect.any(String),
//               author: expect.any(String),
//               body: expect.any(String),
//               created_at: expect.any(String),
//               votes: expect.any(Number),
//               comment_count: expect.any(Number),
//             })
//           );
//         });
//       });
//   });
// });
