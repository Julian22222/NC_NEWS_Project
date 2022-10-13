\c nc_news

SELECT articles.*,
    FROM articles
    LEFT JOIN comments ON articles.article_id=comments.article_id
    WHERE article_id =$1;`,
      [article_id];