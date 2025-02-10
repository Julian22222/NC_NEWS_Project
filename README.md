## Instructions on how to create the environment variables for anyone who wishes to clone your project and run it locally.

create ".env.test" and ".env.development" files with PGDATABASE=<database_name_here> ("PGDATABASE=nc_news" and "PGDATABASE=nc_news_test" ).

# Avoid to make the same varibles when you connect to DB and to API server

use DB before variables to connect to Database -->

```JS
DB_USERNAME = ********
DB_PASSWORD = ********
PGDATABASE = ******
DB_HOST = ********
DB_PORT = ********
```

and PORT variable --> for port connection to API server,

```JS
PORT = ****
```

to make different names for variables
