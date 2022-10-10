const app = require("./app"); //creating server

const PORT = 9060;

app.listen(PORT, () => {
  console.log(`app is listening on ${PORT}`);
});
