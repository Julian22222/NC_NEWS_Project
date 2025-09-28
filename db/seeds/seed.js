const format = require("pg-format");
//pg-format is a popular Node.js library that helps you safely create SQL query strings by formatting and escaping values to prevent SQL injection vulnerabilities.
//Used to interact with DB when post,put or patch, à format('INSERT INTO….`);  OR  format(UPDATE ….`);   OR  format(PATCH ….`);
//Why use pg-format? When you build SQL queries dynamically by inserting variables (like user input or parameters), you risk SQL injection if you just concatenate strings directly. pg-format helps you format queries safely by escaping values correctly.

const db = require("../connection");
const {
  convertTimestampToDate,
  createRef,
  formatComments,
} = require("./utils");

const seed = async ({ topicData, userData, articleData, commentData }) => {
  await db.query(`DROP TABLE IF EXISTS comments;`);
  await db.query(`DROP TABLE IF EXISTS articles;`);
  await db.query(`DROP TABLE IF EXISTS users;`);
  await db.query(`DROP TABLE IF EXISTS topics;`);

  const topicsTablePromise = db.query(`
  CREATE TABLE topics (
    slug VARCHAR PRIMARY KEY,
    description VARCHAR
  );`);

  const usersTablePromise = db.query(`
  CREATE TABLE users (
    username VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    avatar_url VARCHAR
  );`);

  //Promise.all - used to run multiple asynchronous operations in parallel and wait for all of them to complete before proceeding.
  //Starts both CREATE TABLE queries at the same time (concurrently). Uses Promise.all to wait for both queries to finish before proceeding
  //This can improve performance by reducing the total time taken to create both tables, especially if they are independent of each other.  This is faster, because the two queries run in parallel.
  // If your tables depend on each other (e.g., foreign keys referencing other tables), you should not run the queries concurrently. You should create the tables in the correct order.
  await Promise.all([topicsTablePromise, usersTablePromise]);

  //await - Runs the first CREATE TABLE articles query and waits for it to finish.
  //Only then runs the second CREATE TABLE comments query.
  //Runs the queries sequentially, one after the other. This is necessary here because the comments table references the articles table with a foreign key constraint. The articles table must exist before you can create the comments table that references it.
  //queries are run not in parallel, but one after the other. Not as in -Promise.all
  //In terms of dependency: If one query depends on the other (for example, if you had foreign key constraints), running sequentially might be safer.
  await db.query(`
  CREATE TABLE articles (
    article_id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    topic VARCHAR NOT NULL REFERENCES topics(slug),
    author VARCHAR NOT NULL REFERENCES users(username),
    body VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    votes INT DEFAULT 0 NOT NULL
  );`);

  await db.query(`
  CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    body VARCHAR NOT NULL,
    article_id INT REFERENCES articles(article_id) NOT NULL,
    author VARCHAR REFERENCES users(username) NOT NULL,
    votes INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );`);

  //const format = require("pg-format"); - Used to interact with DB when post,put or patch, à format('INSERT INTO….`);  OR  format(UPDATE ….`);   OR  format(PATCH ….`);
  const insertTopicsQueryStr = format(
    "INSERT INTO topics (slug, description) VALUES %L RETURNING *;",
    topicData.map(({ slug, description }) => [slug, description])
  );
  const topicsPromise = db
    .query(insertTopicsQueryStr)
    .then((result) => result.rows);

  //  //const format = require("pg-format"); - Used to interact with DB when post,put or patch, à format('INSERT INTO….`);  OR  format(UPDATE ….`);   OR  format(PATCH ….`);
  const insertUsersQueryStr = format(
    "INSERT INTO users ( username, name, avatar_url) VALUES %L RETURNING *;",
    userData.map(({ username, name, avatar_url }) => [
      username,
      name,
      avatar_url,
    ])
  );
  const usersPromise = db
    .query(insertUsersQueryStr)
    .then((result) => result.rows);

  await Promise.all([topicsPromise, usersPromise]);

  const formattedArticleData = articleData.map(convertTimestampToDate);
  const insertArticlesQueryStr = format(
    "INSERT INTO articles (title, topic, author, body, created_at, votes) VALUES %L RETURNING *;",
    formattedArticleData.map(
      ({ title, topic, author, body, created_at, votes = 0 }) => [
        title,
        topic,
        author,
        body,
        created_at,
        votes,
      ]
    )
  );

  const articleRows = await db
    .query(insertArticlesQueryStr)
    .then((result) => result.rows);

  const articleIdLookup = createRef(articleRows, "title", "article_id");
  const formattedCommentData = formatComments(commentData, articleIdLookup);

  const insertCommentsQueryStr = format(
    "INSERT INTO comments (body, author, article_id, votes, created_at) VALUES %L RETURNING *;",
    formattedCommentData.map(
      ({ body, author, article_id, votes = 0, created_at }) => [
        body,
        author,
        article_id,
        votes,
        created_at,
      ]
    )
  );
  return db.query(insertCommentsQueryStr).then((result) => result.rows);
};

module.exports = seed;
