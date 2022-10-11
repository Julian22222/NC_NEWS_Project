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

afterAll(() => db.end());

// describe("app", () => {
//   describe("/app", () => {
//     describe("/categories", () => {
//       describe("GET:/api/categories", () => {
//         it("200: responds with array of categories", () => {
//           return request(app)
//             .get("/api/categories")
//             .expect(200)
//             .then((response) => {
//               const {
//                 body: { categories },
//               } = response;
//               console.log(categories);
//               expect(categories).toHaveLength(3);

//               categories.forEach((category) => {
//                 expect(category).toEqual(
//                   expect.objectContaining({
//                     slug: expect.any(String),
//                     description: expect.any(String),
//                   })
//                 );
//               });
//             });
//         });
//       });
//     });
//   });
// });
//

describe("test3.get /api/topics", () => {
  test("200: responds with array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        // console.log(response);
        const {
          body: { category },
        } = response;
        // console.log(category);
        expect(category).toHaveLength(3);
        expect(Array.isArray(category)).toBe(true);
        //expext(.....)toBeInstanceOf(Array)
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

describe("test3.get /api/topics", () => {
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
});

describe("test4.get /api/articles/:article_id", () => {
  test("200: responds with an object of article id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        // console.log(response);

        //   expect(message).toBeInstanceOf(Object);
        // expect(testStack.hasOwnProperty("quantity")).toBe(true);

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

describe("test4. Handling psql errror for /api/articles/banana", () => {
  test("status:400, retorn an error message when passed article id that is of an invalid type ' ", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, invalid article id");
      });
  });
});

describe("test4. Handling for /api/articles/9999", () => {
  test("status:404, retorn an error message when passed article id that doesn't exist in database' ", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Id not found");
      });
  });
});

describe("test4.get /api/articles/:article_id", () => {
  test("should respond with an correct article id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        // console.log(body);
        expect(body).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
        });
      });
  });
});

// KIRIL
// describe("test5 get /api/users", () => {
//   test("status:200, responds with an array of test users objects", () => {
//     return request(app)
//       .get("/api/users")
//       .expect(200)
//       .then((response) => {
//         const {
//           body: { users },
//         } = response;
//         expect(users).toBeInstanceOf(Array);
//         expect(users).toHaveLength(4);
//         users.forEach((user) => {
//           expect(user).toEqual(
//             expect.objectContaining({
//               username: expect.any(String),
//               name: expect.any(String),
//               avatar_url: expect.any(String),
//             })
//           );
//         });
//         expect(users).toEqual([
//           {
//             avatar_url:
//               "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
//             name: "jonny",
//             username: "butter_bridge",
//           },
//           {
//             avatar_url:
//               "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
//             name: "sam",
//             username: "icellusedkars",
//           },
//           {
//             avatar_url:
//               "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
//             name: "paul",
//             username: "rogersop",
//           },
//           {
//             avatar_url:
//               "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
//             name: "do_nothing",
//             username: "lurker",
//           },
//         ]);
//       });
//   });
// });

describe("test5.get /api/users", () => {
  test("200: responds with array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        console.log(response.body);
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

describe("test5.get /api/users", () => {
  test("should return 4 users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        // console.log(response.body);
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
});
