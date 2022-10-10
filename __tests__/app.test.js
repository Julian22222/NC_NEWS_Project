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

beforeEach(() => seed({ articleData, commentData, topicData, userData }));

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

describe("get /api/categories", () => {
  test("200: responds with array of categories", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((response) => {
        const {
          body: { category },
        } = response;
        console.log(category);
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

describe("get /api/categories", () => {
  test("should return all 3 topics", () => {
    return request(app)
      .get("/api/categories")
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
