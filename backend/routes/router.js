const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const db = require("../lib/db.js");
const authHelper = require("./auth.js");
const userMiddleware = require("../middleware/users.js");
const fetch = require("node-fetch");
const snoowrap = require("snoowrap");
const GitHub = require("github-api");
var graph = require("@microsoft/microsoft-graph-client");
require("es6-promise").polyfill();
require("isomorphic-fetch");

var onMatchPost = false;
var onMatchEmail = false;
var imgurToken = "";
var imgurSetimage = "";
var outlookToken = "";
var outlookEmail = "";

const twitchClientid = "n635dx4ma9emzkmcmetyfv07hunaf8";
const twitchClientSecret = "7e4j11t572glm7mvojny1wxdigoybr";
const twitchRedirectURI = "http://localhost:8081";
var SpotifyWebApi = require("spotify-web-api-node");

const r = new snoowrap({
  userAgent: "JamesBond",
  clientId: "o4vKa7dAf4SW5g",
  clientSecret: "fL-w9IIpsGsl1JvI_6AstEgvyxw",
  username: "TheSheikhSpearian",
  password: "ismail01"
});

const oauth2Reddit = require("simple-oauth2").create({
  client: {
    id: "xpAzZH0dUBVoXQ",
    secret: "XotLK_jYdmtid03-H8qewgOK1tk"
  },
  auth: {
    authorizeHost: "https://www.reddit.com",
    authorizePath: "/api/v1/authorize",

    tokenHost: "https://www.reddit.com",
    tokenPath: "/api/v1/access_token"
  }
});

router.get("/github-notifications/:user/:pass/", async (req, res) => {
  var github = require("github-api");
  var gh = new github({
    username: req.params.user,
    password: req.params.pass
  });
  var result = undefined;
  var me = gh.getUser();
  await me.listNotifications((err, n) => {
    result = n;
  });
  res.send(result);
});

router.get("/github-repos/:user/:pass/:repo", async (req, res) => {
  var gh = new GitHub({
    username: req.params.user,
    password: req.params.pass
  });
  var result = undefined;
  await gh.getUser(req.params.repo).listStarredRepos(function(err, repos) {
    result = repos.map(r => r.name);
  });
  res.send(result);
});

router.post("/sign-up", userMiddleware.validateRegister, (req, res, next) => {
  db.query(
    `SELECT * FROM users WHERE LOWER(username) = LOWER(${db.escape(
      req.body.username
    )});`,
    (err, result) => {
      if (result.length) {
        return res.status(409).send({
          msg: "This username is already in use!"
        });
      } else {
        // username is available
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).send({
              msg: err
            });
          } else {
            // has hashed pw => add to database
            db.query(
              `INSERT INTO users(userId, username, password, registered) values('${uuid.v4()}', ${db.escape(
                req.body.username
              )}, ${db.escape(hash)}, now())`,
              (err, result) => {
                if (err) {
                  throw err;
                  return res.status(400).send({
                    msg: err
                  });
                }
                return res.status(201).send({
                  msg: "Registered!"
                });
              }
            );
          }
        });
      }
    }
  );
});

router.post("/login", (req, res, next) => {
  db.query(
    `SELECT * FROM users WHERE username = ${db.escape(req.body.username)};`,
    (err, result) => {
      // user does not exists
      if (err) {
        throw err;
        return res.status(400).send({
          msg: err
        });
      }
      if (!result.length) {
        return res.status(401).send({
          msg: "Username or password is incorrect!"
        });
      }
      // check password
      bcrypt.compare(
        req.body.password,
        result[0]["password"],
        (bErr, bResult) => {
          // wrong password
          if (bErr) {
            throw bErr;
            return res.status(401).send({
              msg: "Username or password is incorrect!"
            });
          }
          if (bResult) {
            const token = jwt.sign(
              {
                username: result[0].username,
                userId: result[0].userId
              },
              "SECRETKEY",
              {
                expiresIn: "7d"
              }
            );
            db.query(
              `UPDATE users SET last_login = now() WHERE userId = '${result[0]
                .userId}'`
            );
            return res.status(200).send({
              msg: "Logged in!",
              token,
              user: result[0]
            });
          }
          return res.status(401).send({
            msg: "Username or password is incorrect!"
          });
        }
      );
    }
  );
});

router.get("/discord-login", async (req, res) => {
  const ret = await fetch(
    "https://discordapp.com/api/oauth2/authorize?client_id=" +
      "687074424016601134" +
      "&scope=identify&response_type=code&redirect_uri=http://localhost:8081/"
  );
  if (ret.json() !== undefined) {
    console.log(ret.json());
  }
});

router.get("/twitch-login", async (req, res) => {
  const ret = await fetch(
    "https://id.twitch.tv/oauth2/authorize?client_id=" +
      twitchClientid +
      "&redirect_uri=" +
      twitchRedirectURI +
      "&response_type=code&scope=analytics:" +
      "read:extensions+analytics:read:games+bits:read+channel:read:subscriptions+clips:edit+user:edit+user:edit:broadcast+user:read:broadcast+user:read:email"
  );
  if (ret.url !== undefined) {
    console.log(ret.url);
    res.send({ url: ret.url });
  }
});

router.get("/twitch-token/:code", async (req, res) => {
  const ret = await fetch(
    "https://id.twitch.tv/oauth2/token" +
      "?client_id=" +
      twitchClientid +
      "&client_secret=" +
      twitchClientSecret +
      "&code=" +
      req.params.code +
      "&grant_type=authorization_code" +
      "&redirect_uri=" +
      twitchRedirectURI,
    {
      method: "POST"
    }
  );
  try {
    let r = await ret.json();
    console.log(r);
    if (r.access_token !== undefined) {
      console.log(r);
      res.send({ token: r.access_token });
    }
  } catch (e) {
    console.log(e);
  }
});

router.get("/twitch-get-user", async (req, res) => {
  const ret = await fetch("https://api.twitch.tv/kraken/user", {
    headers: {
      "Client-ID": twitchClientid,
      Accept: "application/vnd.twitchtv.v5+json",
      Authorization: "OAuth " + req.headers.twitch
    }
  }).then(r => {
    console.log(r);
    res.send(r.json());
  });
});

router.get("/get-top-vid/:game", async (req, res) => {
  console.log("here");
  const ret = await fetch(
    "https://api.twitch.tv/kraken/videos/top?period=all&game=" +
      req.params.game,
    {
      headers: {
        "Client-ID": twitchClientid,
        Accept: "application/vnd.twitchtv.v5+json"
      }
    }
  );
  try {
    let r = await ret.json();
    console.log(r);
    console.log("here");
    if (r.vods !== undefined) {
      console.log(r);
      res.send({ url: r.vods[0].url });
    }
  } catch (e) {
    console.log(e);
  }
});

router.get("/instagram-token/:code", async (req, res) => {
  try {
    console.log(
      "https://api.instagram.com/oauth/access_token?" +
        "client_id=0ce68ba8e2b646b7836b2c16bec5b4b0&" +
        "client_secret=c5845ad67ca649068319ac62720393b6&" +
        "grant_type=authorization_code&" +
        "redirect_uri=http://127.0.0.1:8081&" +
        "code=" +
        req.params.code
    );
    const ret = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: {
        client_id: "0ce68ba8e2b646b7836b2c16bec5b4b0",
        client_secret: "c5845ad67ca649068319ac62720393b6",
        grant_type: "authorization_code",
        redirect_uri: "http://127.0.0.1:8081",
        code: req.params.code
      }
    });
    try {
      z = await ret.json();
      console.log(z);
      if (z !== undefined && z.access_token !== undefined) {
        console.log(z);
        res.send({ token: z.access_token });
      }
    } catch (e) {
      console.log(e);
    }
  } catch (e) {
    console.log(e);
  }
});

router.get("/outlook-token/:code", async (req, res, next) => {
  console.log(req.params.code);
  authHelper
    .getTokenFromCode(req.params.code, res)
    .then(j => res.send({ token: j }));
});

router.get("/outlook-login", async (req, res, next) => {
  const signInURL = authHelper.getAuthUrl();
  res.send({ url: signInURL });
});

router.get("/outlook-get-mail", async (req, res, next) => {
  try {
    const client = graph.Client.init({
      authProvider: done => {
        done(null, req.headers.outlook);
      }
    });
    const start = new Date(new Date().setHours(0, 0, 0));
    // Set end of the calendar view to 7 days from start
    const end = new Date(new Date(start).setDate(start.getDate() + 7));
    client
      .api("/me/mailfolders/inbox/messages")
      .top(5)
      .select("subject,from,receivedDateTime,isRead")
      .orderby("receivedDateTime DESC")
      .get()
      .then(r => res.send(r));
  } catch (e) {
    console.log(e);
  }
});

router.get("/outlook-calendar", async (req, res, next) => {
  const client = graph.Client.init({
    authProvider: done => {
      done(null, req.headers.outlook);
    }
  });
  const start = new Date(new Date().setHours(0, 0, 0));
  // Set end of the calendar view to 7 days from start
  const end = new Date(new Date(start).setDate(start.getDate() + 7));
  client
    .api(
      `/me/calendarView?startDateTime=${start.toISOString()}&endDateTime=${end.toISOString()}`
    )
    .top(5)
    .select("subject,start,end,attendees")
    .orderby("start/dateTime DESC")
    .get()
    .then(j => res.send(j))
    .catch(e => console.log(e));
});

router.get("/outlook-contacts", async (req, res, next) => {
  const client = graph.Client.init({
    authProvider: done => {
      done(null, req.headers.outlook);
    }
  });
  client
    .api("/me/contacts")
    .top(10)
    .select("givenName,surname,emailAddresses")
    .orderby("givenName ASC")
    .get()
    .then(j => res.send(j));
});

router.get("/", userMiddleware.debug, (req, res, next) => {
  db.query("SELECT * FROM users", (err, results, fields) => {
    if (err) {
      throw err;
      return res.status(400).send({ msg: err });
    }
    console.log(results);
    return res.status(200).send({ data: results });
  });
});
router.get("/", userMiddleware.debug, (req, res, next) => {
  db.query("SELECT * FROM users", (err, results, fields) => {
    if (err) {
      throw err;
      return res.status(400).send({ msg: err });
    }
    console.log(results);
    return res.status(200).send({ data: results });
  });
});

router.get(
  "/outlook-send-mail/:destaddress/:subject/:message/:content_type",
  async (req, res, next) => {
    const client = graph.Client.init({
      authProvider: done => {
        done(null, req.headers.outlook);
      }
    });
    var mail = {
      subject: req.params.subject,
      toRecipients: [
        {
          emailAddress: {
            address: req.params.destaddress
          }
        }
      ],
      body: {
        content: req.params.message,
        contentType: req.params.content_type
      }
    };
    console.log(mail);
    try {
      let response = await client
        .api("/me/sendMail")
        .post({ message: mail })
        .then({ response: "ok" });
      console.log(response);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

router.get("/reddit-login", async (req, res) => {
  const ret = await oauth2Reddit.authorizationCode.authorizeURL({
    redirect_uri: "http://localhost:8081",
    scope: [
      "identity",
      "edit",
      "flair",
      "history",
      "modconfig",
      "modflair",
      "modlog",
      "modposts",
      "modwiki",
      "mysubreddits",
      "privatemessages",
      "read",
      "report",
      "save",
      "submit",
      "subscribe",
      "vote",
      "wikiedit",
      "wikiread"
    ],
    state: "random-unique-string"
  });
  if (ret !== undefined) {
    console.log(ret);
    res.send({url : ret})
  }
});

router.get("/reddit-token/:code", async (req, res) => {
  var auth = new Buffer("o4vKa7dAf4SW5g:fL-w9IIpsGsl1JvI_6AstEgvyxw");
  console.log(auth.toString("base64"));
  const ret = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic eHBBelpIMGRVQlZvWFE6WG90TEtfallkbXRpZDAzLUg4cWV3Z09LMXRr",
        "Content-Type": "application/x-www-form-urlencoded",
        "Connection": "keep-alive",
        "Host": "www.reddit.com",
        "User-Agent": "PostmanRuntime/7.23.0",
        "Allow" : "*/*"
    },
    body: {
      grant_type: "authorization_code",
      redirect_uri: "http://localhost:8081",
      code: req.params.code
    }
  });
  console.log(ret);
  try {
    z = await ret.json();
    if (z !== undefined) {
      res.send({ token: z });
    }
  } catch (e) {
    console.log(e);
  }
});

router.get("/spotify-login", async (req, res) => {
  res.send({
    url:
      "https://accounts.spotify.com/authorize?client_id=f84580f0e7654dacae151764a70b8239&response_type=code&redirect_uri=" +
      encodeURIComponent("http://localhost:8081") +
      "&scope=ugc-image-upload%20playlist-read-private%20playlist-modify-public%20playlist-read-collaborative%20playlist-modify-private" +
      "%20user-read-currently-playing%20user-modify-playback-state%20user-read-playback-state%20user-read-recently-played%20user-top-read" +
      "%20user-follow-read%20user-follow-modify%20app-remote-control%20streaming%20user-read-private%20user-read-email%20user-library-modify" +
      "%20user-library-read"
  });
});

router.get("/spotify-token/:code", async (req, res) => {
  var c = {
    clientId: "f84580f0e7654dacae151764a70b8239",
    clientSecret: "657df5b9bedc4ba7afab9c55acac86f2",
    redirectUri: "http://localhost:8081"
  };
  var spotifyApi = new SpotifyWebApi(c);
  spotifyApi.authorizationCodeGrant(req.params.code).then(s => {
    console.log(s);
    if (s.body.access_token !== undefined) {
      res.send({ spotify_token: s.body.access_token });
    }
  });
  /*let auth =
    "f84580f0e7654dacae151764a70b8239:657df5b9bedc4ba7afab9c55acac86f2";
  const ret = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + auth.toString("base64")
    },
    data: {
      grant_type: "client_credentials",
      redirect_uri: encodeURIComponent("http://localhost:8081"),
      code: req.params.code
    }
  });
  try {
    z = await ret.json();
    console.log(z);
    if (z.token !== undefined) {
      console.log(z);
      res.send({ token: z.token });
    }
  } catch (e) {
    console.log(e);
  }*/
});

router.get("/spotify-getUser", async (req, res) => {
  console.log(req.headers.outlook, req.params.spotify);
  var spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(req.headers.spotify);
  spotifyApi.getMe().then(
    function(data) {
      console.log("Some information about the authenticated user", data.body);
      res.send(data);
    },
    function(err) {
      console.log("Something went wrong!", err);
      res.send({ status: "ko" });
    }
  );
});

router.get("/spotify-get-user-playlists/:username", async (req, res) => {
  var spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(req.headers.spotify);
  spotifyApi.getUserPlaylists(req.params.username).then(
    function(data) {
      res.send(data);
      var mailtosend = "";
      data.forEach(element => {
        mailtosend += "name: " + element.name + "\n";
        mailtosend += "link: " + element.href + "\n";
      });
      mailtosend += "Cordialement\nIsmail HAOUAM";
      if (req.headers.outlook != undefined) {
        fetch(
          "http://127.0.0.1:8080/api/send-to-contacts/" +
            encodeURIComponent(
              "Have you seen " + req.params.username + "'s playlists"
            ) +
            "/" +
            encodeURIComponent(mailtosend) +
            "/text",
          {
            headers: {
              outlook: req.headers.outlook
            }
          }
        );
      }
    },
    function(err) {
      console.log("Something went wrong!", err);
    }
  );
});
router.get("/send-to-contacts/:subject/:body/:type", async (req, res) => {
  console.log("Send to contacts\nRecieved: " + req.params);
  try {
    const client = await graph.Client.init({
      authProvider: done => {
        done(null, req.headers.outlook);
      }
    });
    if (client !== undefined) {
      client
        .api("/me/contacts")
        .top(10)
        .select("givenName,surname,emailAddresses")
        .orderby("givenName ASC")
        .get()
        .then(async j => {
          console.log(j);
          j.value.map(async r => {
            try {
              if (r !== undefined) {
                console.log(r);
                var mail = {
                  subject: req.params.subject,
                  toRecipients: [
                    {
                      emailAddress: {
                        address: r.emailAddresses[0].address
                      }
                    }
                  ],
                  body: {
                    content: req.params.body,
                    contentType: req.params.type
                  }
                };
                console.log(mail);
                try {
                  let response = await client
                    .api("/me/sendMail")
                    .post({ message: mail });
                  console.log(response);
                  if (response !== undefined) res.send({ response: "ok" });
                } catch (error) {
                  console.log(error);
                  throw error;
                }
              }
            } catch (e) {
              console.log(e);
            }
          });
        });
    }
  } catch (e) {
    console.log(e);
  }
});

router.get("/random-dog", userMiddleware.isLoggedIn, (req, res) => {
  fetch("https://dog.ceo/api/breeds/image/random")
    .then(result => result.json())
    .then(json => res.send(json));
});

router.get(
  "/language-detector/:query",
  userMiddleware.isLoggedIn,
  (req, res) => {
    console.log(req.params);
    fetch(
      "http://api.languagelayer.com/detect?access_key=2ed46c6abc43da350efb4b196ccd3d94&query=" +
        encodeURI(req.params.query)
    )
      .then(result => result.json())
      .then(json => res.send(json));
  }
);

router.post("/tinder-login", userMiddleware.isLoggedIn, (req, res) => {
  console.log("tinder loggin:");
  console.log(req.body.number);
  fetch("https://api.gotinder.com/v2/auth/sms/send?auth_type=sms&locale=en", {
    credentials: "omit",
    headers: {
      accept: "application/json",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "en-US,en;q=0.9",
      "app-session-id": "a27bb1ea-ac87-46dc-9a49-ef8b3d03ec1f",
      "app-session-time-elapsed": "16669",
      "app-version": "1021800",
      "persistent-device-id": "0d4f3e12-ca69-48f2-9797-9728f00cd1b9",
      platform: "web",
      referer: "https://tinder.com/",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "tinder-version": "2.18.0",
      "user-agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.72 Safari/537.36 Vivaldi/2.9.1705.31",
      "user-session-id": "64e2cb41-6eb5-4b2e-a512-a76b6e68c7f2",
      "user-session-time-elapsed": "16347",
      "x-supported-image-formats": "webp,jpeg",
      "Content-Type": "application/json"
    },
    referrer: "https://tinder.com/",
    referrerPolicy: "origin",
    body: `{\"phone_number\":\"${req.body.number}\"}`,
    method: "POST",
    mode: "cors"
  })
    .then(result => result.json())
    .then(json => res.send(json));
});

router.post("/tinder-validate-num", userMiddleware.isLoggedIn, (req, res) => {
  console.log("tinder validate:");
  console.log(req.body.number);
  console.log(req.body.code);
  fetch(
    "https://api.gotinder.com/v2/auth/sms/validate?auth_type=sms&locale=en",
    {
      credentials: "omit",
      headers: {
        accept: "application/json",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-US,en;q=0.9",
        "app-session-id": "a27bb1ea-ac87-46dc-9a49-ef8b3d03ec1f",
        "app-session-time-elapsed": "16669",
        "app-version": "1021800",
        "persistent-device-id": "0d4f3e12-ca69-48f2-9797-9728f00cd1b9",
        platform: "web",
        referer: "https://tinder.com/",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "tinder-version": "2.18.0",
        "user-agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.72 Safari/537.36 Vivaldi/2.9.1705.31",
        "user-session-id": "64e2cb41-6eb5-4b2e-a512-a76b6e68c7f2",
        "user-session-time-elapsed": "16347",
        "x-supported-image-formats": "webp,jpeg",
        "Content-Type": "application/json"
      },
      referrer: "https://tinder.com/",
      referrerPolicy: "origin",
      body: `{\"otp_code\":\"${req.body.code}\",\"phone_number\":\"${req.body
        .number}\",\"is_update\":false}`,
      method: "POST",
      mode: "cors"
    }
  )
    .then(result => result.json())
    .then(json => res.send(json));
});

router.post("/tinder-getxauth", userMiddleware.isLoggedIn, (req, res) => {
  console.log("tinder getxauth:");
  console.log(req.body.number);
  console.log(req.body.refresh);
  fetch("https://api.gotinder.com/v2/auth/login/sms?locale=en", {
    credentials: "omit",
    headers: {
      accept: "application/json",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "en-US,en;q=0.9",
      "app-session-id": "a27bb1ea-ac87-46dc-9a49-ef8b3d03ec1f",
      "app-session-time-elapsed": "16669",
      "app-version": "1021800",
      "persistent-device-id": "0d4f3e12-ca69-48f2-9797-9728f00cd1b9",
      platform: "web",
      referer: "https://tinder.com/",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "tinder-version": "2.18.0",
      "user-agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.72 Safari/537.36 Vivaldi/2.9.1705.31",
      "user-session-id": "64e2cb41-6eb5-4b2e-a512-a76b6e68c7f2",
      "user-session-time-elapsed": "16347",
      "x-supported-image-formats": "webp,jpeg",
      "Content-Type": "application/json"
    },
    referrer: "https://tinder.com/",
    referrerPolicy: "origin",
    body: `{\"refresh_token\":\"${req.body.refresh}\",\"phone_number\":\"${req
      .body.number}\"}`,
    method: "POST",
    mode: "cors"
  })
    .then(result => result.json())
    .then(json => res.send(json));
});

router.post("/tinder-getteaser", userMiddleware.isLoggedIn, (req, res) => {
  console.log("tinder xauth:");
  console.log(req.body.xauth);
  fetch("https://api.gotinder.com/v2/fast-match/teasers?locale=en", {
    credentials: "omit",
    headers: {
      accept: "application/json",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "en-US,en;q=0.9",
      "app-session-id": "a27bb1ea-ac87-46dc-9a49-ef8b3d03ec1f",
      "app-session-time-elapsed": "16669",
      "app-version": "1021800",
      "persistent-device-id": "0d4f3e12-ca69-48f2-9797-9728f00cd1b9",
      platform: "web",
      referer: "https://tinder.com/",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "tinder-version": "2.18.0",
      "user-agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.72 Safari/537.36 Vivaldi/2.9.1705.31",
      "user-session-id": "64e2cb41-6eb5-4b2e-a512-a76b6e68c7f2",
      "user-session-time-elapsed": "16347",
      "x-supported-image-formats": "webp,jpeg",
      "Content-Type": "application/json",
      "x-auth-token": `${req.body.xauth}`
    },
    referrer: "https://tinder.com/",
    referrerPolicy: "origin",
    body: null,
    method: "GET",
    mode: "cors"
  })
    .then(result => result.json())
    .then(json => res.send(json));
});

router.post("/tinder-getrecs", userMiddleware.isLoggedIn, (req, res) => {
  console.log("tinder xauth:");
  console.log(req.body.xauth);
  fetch("https://api.gotinder.com/recs", {
    credentials: "omit",
    headers: {
      accept: "application/json",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "en-US,en;q=0.9",
      "app-session-id": "a27bb1ea-ac87-46dc-9a49-ef8b3d03ec1f",
      "app-session-time-elapsed": "16669",
      "app-version": "1021800",
      "persistent-device-id": "0d4f3e12-ca69-48f2-9797-9728f00cd1b9",
      platform: "web",
      referer: "https://tinder.com/",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "tinder-version": "2.18.0",
      "user-agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.72 Safari/537.36 Vivaldi/2.9.1705.31",
      "user-session-id": "64e2cb41-6eb5-4b2e-a512-a76b6e68c7f2",
      "user-session-time-elapsed": "16347",
      "x-supported-image-formats": "webp,jpeg",
      "Content-Type": "application/json",
      "x-auth-token": `${req.body.xauth}`
    },
    referrer: "https://tinder.com/",
    referrerPolicy: "origin",
    body: null,
    method: "GET",
    mode: "cors"
  })
    .then(result => result.json())
    .then(json => res.send(json));
});

router.post("/tinder-like", userMiddleware.isLoggedIn, (req, res) => {
  console.log("tinder xauth:");
  console.log(req.body.xauth);
  console.log("tinder id:");
  console.log(req.body.id);
  fetch(`https://api.gotinder.com/like/${req.body.id}`, {
    credentials: "omit",
    headers: {
      accept: "application/json",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "en-US,en;q=0.9",
      "app-session-id": "a27bb1ea-ac87-46dc-9a49-ef8b3d03ec1f",
      "app-session-time-elapsed": "16669",
      "app-version": "1021800",
      "persistent-device-id": "0d4f3e12-ca69-48f2-9797-9728f00cd1b9",
      platform: "web",
      referer: "https://tinder.com/",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "tinder-version": "2.18.0",
      "user-agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.72 Safari/537.36 Vivaldi/2.9.1705.31",
      "user-session-id": "64e2cb41-6eb5-4b2e-a512-a76b6e68c7f2",
      "user-session-time-elapsed": "16347",
      "x-supported-image-formats": "webp,jpeg",
      "Content-Type": "application/json",
      "x-auth-token": `${req.body.xauth}`
    },
    referrer: "https://tinder.com/",
    referrerPolicy: "origin",
    body: null,
    method: "GET",
    mode: "cors"
  })
    .then(result => result.json())
    .then(json => {
      if (json.match && onMatchPost) {
        console.log("HERE");
        fetch("https://api.imgur.com/3/upload/", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${imgurToken}`
          },
          body: `${imgurSetimage}`
        })
          .then(result => result.json())
          .then(json => console.log(json))
          .catch(error => console.log("error", error));
      }
      if (json.match && onMatchEmail) {
        const client = graph.Client.init({
          authProvider: done => {
            done(null, outlookToken);
          }
        });
        var mail = {
          subject: "AREA - Tinder",
          toRecipients: [
            {
              emailAddress: {
                address: outlookEmail
              }
            }
          ],
          body: {
            content: "Wow I JUST MATCHED",
            contentType: "text"
          }
        };
        console.log(mail);
        try {
          let response = client
            .api("/me/sendMail")
            .post({ message: mail })
            .then({ response: "ok" });
          console.log(response);
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
      res.send(json);
    });
});

router.post("/tinder-pass", userMiddleware.isLoggedIn, (req, res) => {
  console.log("tinder xauth:");
  console.log(req.body.xauth);
  console.log("tinder id:");
  console.log(req.body.id);
  fetch(`https://api.gotinder.com/pass/${req.body.id}`, {
    credentials: "omit",
    headers: {
      accept: "application/json",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "en-US,en;q=0.9",
      "app-session-id": "a27bb1ea-ac87-46dc-9a49-ef8b3d03ec1f",
      "app-session-time-elapsed": "16669",
      "app-version": "1021800",
      "persistent-device-id": "0d4f3e12-ca69-48f2-9797-9728f00cd1b9",
      platform: "web",
      referer: "https://tinder.com/",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "tinder-version": "2.18.0",
      "user-agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.72 Safari/537.36 Vivaldi/2.9.1705.31",
      "user-session-id": "64e2cb41-6eb5-4b2e-a512-a76b6e68c7f2",
      "user-session-time-elapsed": "16347",
      "x-supported-image-formats": "webp,jpeg",
      "Content-Type": "application/json",
      "x-auth-token": `${req.body.xauth}`
    },
    referrer: "https://tinder.com/",
    referrerPolicy: "origin",
    body: null,
    method: "GET",
    mode: "cors"
  })
    .then(result => result.json())
    .then(json => res.send(json));
});

router.post("/tinder-update", userMiddleware.isLoggedIn, (req, res) => {
  console.log("tinder xauth:");
  console.log(req.body.xauth);
  fetch(`https://api.gotinder.com/updates`, {
    credentials: "omit",
    headers: {
      accept: "application/json",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "en-US,en;q=0.9",
      "app-session-id": "a27bb1ea-ac87-46dc-9a49-ef8b3d03ec1f",
      "app-session-time-elapsed": "16669",
      "app-version": "1021800",
      "persistent-device-id": "0d4f3e12-ca69-48f2-9797-9728f00cd1b9",
      platform: "web",
      referer: "https://tinder.com/",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "tinder-version": "2.18.0",
      "user-agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.72 Safari/537.36 Vivaldi/2.9.1705.31",
      "user-session-id": "64e2cb41-6eb5-4b2e-a512-a76b6e68c7f2",
      "user-session-time-elapsed": "16347",
      "x-supported-image-formats": "webp,jpeg",
      "Content-Type": "application/json",
      "x-auth-token": `${req.body.xauth}`
    },
    referrer: "https://tinder.com/",
    referrerPolicy: "origin",
    body: null,
    method: "POST",
    body: '{"last_activity_date": "2014-04-10T10:17:54.379Z"}',
    mode: "cors"
  })
    .then(result => result.json())
    .then(json => res.send(json));
});

router.post("/tinder-ping", userMiddleware.isLoggedIn, (req, res) => {
  console.log("tinder xauth:");
  console.log(req.body.xauth);
  console.log("tinder lat:");
  console.log(req.body.lat);
  console.log("tinder lon:");
  console.log(req.body.lon);
  fetch(`https://api.gotinder.com/user/ping`, {
    credentials: "omit",
    headers: {
      accept: "application/json",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "en-US,en;q=0.9",
      "app-session-id": "a27bb1ea-ac87-46dc-9a49-ef8b3d03ec1f",
      "app-session-time-elapsed": "16669",
      "app-version": "1021800",
      "persistent-device-id": "0d4f3e12-ca69-48f2-9797-9728f00cd1b9",
      platform: "web",
      referer: "https://tinder.com/",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "tinder-version": "2.18.0",
      "user-agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.72 Safari/537.36 Vivaldi/2.9.1705.31",
      "user-session-id": "64e2cb41-6eb5-4b2e-a512-a76b6e68c7f2",
      "user-session-time-elapsed": "16347",
      "x-supported-image-formats": "webp,jpeg",
      "Content-Type": "application/json",
      "x-auth-token": `${req.body.xauth}`
    },
    referrer: "https://tinder.com/",
    referrerPolicy: "origin",
    method: "POST",
    body: `{\"lat\": \"${req.body.lat}\", \"lon\": \"${req.body.lon}\"}`,
    mode: "cors"
  })
    .then(result => result.json())
    .then(json => res.send(json));
});

router.post("/tinder-message", userMiddleware.isLoggedIn, (req, res) => {
  console.log("tinder xauth:");
  console.log(req.body.xauth);
  console.log("tinder matchid:");
  console.log(req.body.matchid);
  console.log("tinder message:");
  console.log(req.body.message);

  myHeaders = {
    accept: "application/json",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "en-US,en;q=0.9",
    "app-session-id": "a27bb1ea-ac87-46dc-9a49-ef8b3d03ec1f",
    "app-session-time-elapsed": "16669",
    "app-version": "1021800",
    origin: "https://tinder.com",
    "persistent-device-id": "0d4f3e12-ca69-48f2-9797-9728f00cd1b9",
    platform: "web",
    referer: "https://tinder.com/",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "tinder-version": "2.18.0",
    "user-agent":
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.72 Safari/537.36 Vivaldi/2.9.1705.31",
    "user-session-id": "64e2cb41-6eb5-4b2e-a512-a76b6e68c7f2",
    "user-session-time-elapsed": "16347",
    "x-auth-token": req.body.xauth,
    "x-supported-image-formats": "webp,jpeg",
    "Content-Type": "application/json"
  };

  var raw = JSON.stringify({ message: req.body.message });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  fetch(
    `https://api.gotinder.com/user/matches/${req.body.matchid}`,
    requestOptions
  )
    .then(result => result.json())
    .then(json => res.send(json))
    .catch(error => console.log("error", error));
});

router.get(
  "/reddit-searchSubreddit/:subname",
  userMiddleware.isLoggedIn,
  (req, res) => {
    console.log(req.params.subname);
    r
      .getSubreddit(req.params.subname)
      .getNew()
      .map(post => post.title)
      .then(result => res.send(JSON.stringify(result)));
  }
);

router.get("/outlook/:access_token", userMiddleware.isLoggedIn, (req, res) => {
  try {
    client = graph.Client.init({
      authProvider: done => {
        done(null, req.params.access_token);
      }
    });
    start = new Date(new Date().setHours(0, 0, 0));
    end = new Date(new Date(start).setDate(start.getDate() + 7));
    client
      .api("/me/mailfolders/inbox/messages")
      .top(5)
      .select("subject,from,receivedDateTime,isRead")
      .orderby("receivedDateTime DESC")
      .get()
      .then(result => res.send(result.value));
  } catch (e) {
    console.log(e);
  }
});

router.get("/chuck-norris-jokes", userMiddleware.isLoggedIn, (req, res) => {
  fetch("https://api.chucknorris.io/jokes/random")
    .then(result => result.json())
    .then(json => res.send(json));
});

router.post("/imgur-home", userMiddleware.isLoggedIn, (req, res) => {
  console.log("imgur token: ", req.body.token);
  console.log("imgur page: ", req.body.page);
  fetch(`https://api.imgur.com/3/gallery/top/viral/day/${req.body.page}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${req.body.token}`
    }
  })
    .then(result => result.json())
    .then(json => res.send(json))
    .catch(error => console.log("error", error));
});

router.post("/imgur-favimg", userMiddleware.isLoggedIn, (req, res) => {
  console.log("imgur token: ", req.body.token);
  console.log("imgur image id: ", req.body.img_id);
  fetch(`https://api.imgur.com/3/image/${req.body.img_id}/favorite/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${req.body.token}`
    }
  })
    .then(result => result.json())
    .then(json => res.send(json))
    .catch(error => console.log("error", error));
});

router.post("/imgur-favs", userMiddleware.isLoggedIn, (req, res) => {
  console.log("imgur token: ", req.body.token);
  fetch("https://api.imgur.com/3/account/me/gallery_favorites/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${req.body.token}`
    }
  })
    .then(result => result.json())
    .then(json => res.send(json))
    .catch(error => console.log("error", error));
});

router.post("/imgur-post", userMiddleware.isLoggedIn, (req, res) => {
  console.log("imgur token: ", req.body.token);
  console.log("imgur img: ", req.body.image);
  fetch("https://api.imgur.com/3/upload/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${req.body.token}`
    },
    body: `${req.body.image}`
  })
    .then(result => result.json())
    .then(json => res.send(json))
    .catch(error => console.log("error", error));
});

router.post(
  "/area-tindermatch-imgurpost",
  userMiddleware.isLoggedIn,
  (req, res) => {
    imgurToken = req.body.token;
    imgurSetimage = req.body.image;
    onMatchPost = true;
    res.send({ message: "Set on match a post" });
  }
);

router.post(
  "/area-tindermatch-email",
  userMiddleware.isLoggedIn,
  (req, res) => {
    outlookToken = req.body.token;
    outlookEmail = req.body.email;
    onMatchEmail = true;

    console.log("outlook token: ");
    console.log(outlookToken);
    console.log("outlook email: ");
    console.log(outlookEmail);
    console.log("onMatchEmail: ");
    console.log(onMatchEmail);

    res.send({ message: "Set on match a post" });
  }
);

// TWITCH LOGIN

router.post("/get_token", userMiddleware.isLoggedIn, (req, res) => {
  fetch(
    "https://id.twitch.tv/oauth2/authorize?client_id=n635dx4ma9emzkmcmetyfv07hunaf8&redirect_uri=http://localhost:8081&response_type=token&scope=user:read:email",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${req.body.token}`
      }
    }
  )
    .then(result => result.json())
    .then(json => res.send(json))
    .catch(error => console.log("error", error));
});

// TWITCH GETINFOS

router.post("/get_userInfo", userMiddleware.isLoggedIn, (req, res) => {
  fetch("https://api.twitch.tv/helix/users?id=" + twitchUserid, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${req.body.token}`
    },
    body: `${req.body.twitchUserid}`
  })
    .then(result => result.json())
    .then(json => res.send(json))
    .catch(error => console.log("error", error));
});

router.post("/get_followers", userMiddleware.isLoggedIn, (req, res) => {
  fetch("https://api.twitch.tv/helix/users/follows?to_id=" + twitchUserid, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${req.body.token}`
    },
    body: `${req.body.total}`
  })
    .then(result => result.json())
    .then(json => res.send(json))
    .catch(error => console.log("error", error));
});

// TWITCH SEND MAIL

// TO DO

module.exports = router;
