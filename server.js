const express = require("express");
const app = express();

const exjwt = require("express-jwt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const path = require("path");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Origin", "Content-type,Authorization");
  next();
});

const PORT = 3000;
const secretKey = "secret key";
const jwtMW = exjwt({
  secret: secretKey,
  algorithms: ["HS256"],
});
let users = [
  {
    id: 2,
    username: "def",
    password: "456",
  },
  {
    id: 1,
    username: "abc",
    password: "123",
  },
];

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  var login_success = 0;
  //   console.log("debug first - " + login_success);
  for (let user of users) {
    if (username == user.username && password == user.password) {
      let token = jwt.sign(
        { id: user.id, username: user.username },
        secretKey,
        { expiresIn: 180 }
      );
      return res.json({
        success: true,
        err: null,
        token,
      });
      login_success = 1;

      break;
    } else {
      continue;
    }
  }

  if (login_success == 0) {
    return res.status(401).json({
      success: false,
      token: null,
      err: "Username or password is incorrect",
    });
  }
});

app.get("/api/dashboard", jwtMW, (req, res) => {
  res.json({
    success: true,
    myContent: "<h3>Secret content that only logged in people can see.</h3>",
  });
});

app.get("/api/settings", jwtMW, (req, res) => {
  res.json({
    success: true,
    myContent:
      "<h3>Settings Home Page</h3><br><p>Personalize the webpage using the settings options.</p>",
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      success: false,
      officialerror: err,
      err: "username or password is incorrect 2",
    });
    
  } else {
    next(err);
  }
});

app.listen(PORT, () => {
  console.log(`Serving on Port - ${PORT}`);
});
