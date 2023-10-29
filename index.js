const express = require("express");
const sse = require("sse-express");

const app = express();
const port = 3333;

app.get("/listen", sse, (req, res) => {
  const user = req.header("X-User");

  let number = 1;
  setInterval(() => {
    res.sse("notify", {
      data: `notify number ${number}`,
    });
    
    number += 1;
  }, 400);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
