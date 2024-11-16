import express from "express";

var app = express();

app.get("/", async function (req, res) {
    console.log("hello world");
    res.send("hello world");
})

var server = app.listen(3000, function () {
    console.log("Express App running at http://127.0.0.1:5000/");
  });

