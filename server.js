const mongoose = require("mongoose");

const app = require("./app");

const { DB_HOST, PORT = 3000 } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() => app.listen(PORT))
  .catch(() => process.exit(1));
  console.log('DB_HOST::===', DB_HOST);
  console.log('port::===', PORT);
  