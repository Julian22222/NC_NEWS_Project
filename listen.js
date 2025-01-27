const app = require("./app");

const { PORT = 9030 } = process.env; // If PORT is not set, default to 9030

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
