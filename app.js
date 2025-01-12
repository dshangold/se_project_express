const express = require("express");

const app = express();

const { PORT = 3001 } = process.env;

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost.${PORT}`);
});
