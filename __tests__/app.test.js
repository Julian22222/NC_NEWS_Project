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
