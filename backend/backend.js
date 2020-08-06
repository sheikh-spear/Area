const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
// set up port
const PORT = process.env.PORT || 8080;
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cors());
// add routes
const router = require('./routes/router.js');
app.use('/api', router);

app.get('/about.json', (req, res) => {
  let ts = Date.now();
  var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
  res.send({
    "clients": {
      "hosts": ip
    },
    "server": {
      "current_time": ts,
      "services": [{
        "name": "Tinder",
        "actions": [{
          "name": "login",
          "description": "Loggin with Tinder account"
        }, {
          "name": "liked",
          "description": "See who liked your profile"
        }, {
          "name": "recomendation",
          "description": "Get the recomendation of tinder"
        }, {
          "name": "update",
          "description": "update to the latest messages and likes"
        }],
        "reactions": [{
          "name": "matched",
          "description": "get acces to messaging with a new person"
        }, {
          "name": "like",
          "description": "like a profile"
        }, {
          "name": "dislike",
          "description": "dislike a profile"
        }, {
          "name": "location",
          "description": "change location on the tinders server"
        }, {
          "name": "message",
          "description": "send a message to someone"
        }]
      }, {
        "name": "Imgur",
        "actions": [{
          "name": "viral",
          "description": "get the viral pics of the day"
        }, {
          "name": "my_favourites",
          "description": "see my favourites"
        }],
        "reactions": [{
          "name": "favourite",
          "description": "add a picture to my favourites"
        }]
      }, {
        "name": "random dog",
        "actions": [{
          "name": "random_dog",
          "description": "get a random picture of a dog"
        }],
        "reactions": [
        ]
      }, {
        "name": "language detector",
        "actions": [{
          "name": "language_detector",
          "description": "detect the language of a piece of text"
        }],
        "reactions": [
        ]
      }, {
        "name": "chuck noris jokes",
        "actions": [{
          "name": "chuck_noris_jokes",
          "description": "get a chuck noris joke"
        }],
        "reactions": [
        ]
      }, {
        "name": "Github",
        "actions": [{
          "name": "repos search",
          "description": "search for a repository"
        }],
        "reactions": [{
          "name": "notification",
          "description": "fetch notificaiton from github server"
        }]
      }, {
        "name": "Outlook",
        "actions": [{
          "name": "inbox",
          "description": "retreive inbox messages"
        }, {
          "name": "contacts",
          "description": "retreive contacts"
        }, {
          "name": "calendar",
          "description": "retreive calendar"
        }],
        "reactions": [
        ]
      }, {
        "name": "reddit",
        "actions": [{
          "name": "subreddit",
          "description": "get post from a subreddit"
        }],
        "reactions": [
        ]
      }]
    }
  });
});

// run server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
