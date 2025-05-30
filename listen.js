const app = require("./app");

//API PORT
const { PORT = 9030 } = process.env; // If PORT is not set, the default value = 9030 / destructuring the PORT value from process.env.

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
