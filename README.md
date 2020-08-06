# AREA

Area API documentation.
For every request you will need an access token in the bearer

[Postman](https://documenter.getpostman.com/view/10616927/SzRxWWBf?version=latest)

## /usermanagement

This is the part where we explain how to login and use our API

### /usermanagement/login

To login you need to send via POST the user and the pass

```
curl --location --request POST 'http://localhost:8080/api/login' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "username": "ouinonbonjour",
        "password": "ouinonbonjour"
    }'
```

### /usermanagement/register

To register to the API use a POST request

```
curl --location --request POST 'http://localhost:8080/api/sign-up' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "username": "leosmith",
        "password": "leosmith",
        "password_repeat": "leosmith"
    }'
```

## /tinder

This is the part where we explain how to use the tinder API through our service

### /tinder/login

The API dor to login with tinder phone number
```
curl --location --request POST 'http://localhost:8080/api/tinder-login' \
    --header 'Content-Type: application/json' \
    --header 'authorization: Bearer TOKEN' \
    --data-raw '{
        "number": "PHONE NUMBER"
    }'
```

### /tinder/validate-num

This is where you send the phone number code
```
curl --location --request POST 'http://localhost:8080/api/tinder-validate-num' \
    --header 'Content-Type: application/json' \
    --header 'Authorization: Bearer TOKEN' \
    --data-raw '{
        "code": "CODE",
        "number": "NUMBER"
    }'
```

### /tinder/getxauth

This is where you retrieve the tinder auth token
```
curl --location --request POST 'http://localhost:8080/api/tinder-getxauth' \
    --header 'Content-Type: application/json' \
    --header 'Authorization: Bearer TOKEN' \
    --data-raw '{
        "refresh": "TINDER REFRESH TOKEN FROM LAST REQUEST",
        "number": "NUMBER"
    }'
```

### /tinder/getteaser

This is where you retrieve the people that liked you already
```
curl --location --request POST 'http://localhost:8080/api/tinder-getteaser' \
    --header 'Content-Type: application/json' \
    --header 'Authorization: Bearer TOKEN' \
    --data-raw '{
        "xauth":"TINDER TOKEN"
    }'
```

### /tinder/getrecs

This is where you retrieve all of the recommendation tinder provides you
```
curl --location --request POST 'http://localhost:8080/api/tinder-getrecs' \
    --header 'Content-Type: application/json' \
    --header 'Authorization: Bearer TOKEN' \
    --data-raw '{
        "xauth":"TINDER TOKEN"
    }'
```

### /tinder/like

entry point to like someone
```
curl --location --request POST 'http://localhost:8080/api/tinder-like' \
    --header 'Content-Type: application/json' \
    --header 'Authorization: Bearer TOKEN' \
    --data-raw '{
        "xauth":"TINDER TOKEN", \
        "id":"USER ID"
    }'
```

### /tinder/pass

entry point to pass someone
```
curl --location --request POST 'http://localhost:8080/api/tinder-pass' \
    --header 'Content-Type: application/json' \
    --header 'Authorization: Bearer TOKEN' \
    --data-raw '{
        "xauth":"TINDER TOKEN", \
        "id":"USER ID"
    }'
```

### /tinder/update

entry point to update tinder match and messages
```
curl --location --request POST 'http://localhost:8080/api/tinder-update' \
    --header 'Content-Type: application/json' \
    --header 'Authorization: Bearer TOKEN' \
    --data-raw '{
        "xauth":"TINDER TOKEN"
    }'
```

### /tinder/ping

Change location on the tinder server
```
curl --location --request POST 'http://localhost:8080/api/tinder-ping' \
    --header 'Content-Type: application/json' \
    --header 'Authorization: Bearer TOKEN' \
    --data-raw '{
        "xauth":"TINDER TOKEN",
        "lat": "LATITUDE",
        "lon": "LOGITUDE"
    }'
```

### /tinder/message

Change location on the tinder server
```
curl --location --request POST 'http://localhost:8080/api/tinder-message' \
    --header 'Content-Type: application/json' \
    --header 'Authorization: Bearer TOKEN' \
    --data-raw '{
        "xauth":"TINDER TOKEN",
        "matchid": "THE MATCH ID",
        "message": "THE MESSAGE"
    }'
```

### /imgur/home

get the imgur home page
```
curl --location --request POST 'http://localhost:8080/api/imgur-home' \
    --header 'Content-Type: application/json' \
    --header 'Authorization: Bearer TOKEN' \
    --data-raw '{
        "token":"IMGUR TOKEN",
        "page": "THE PAGE NUMBER"
    }'
```

### /imgur/favimg

Favourite an imgur image
```
curl --location --request POST 'http://localhost:8080/api/imgur-favimg' \
    --header 'Content-Type: application/json' \
    --header 'Authorization: Bearer TOKEN' \
    --data-raw '{
        "token":"IMGUR TOKEN",
        "img_id": "THE IMAGE ID"
    }'
```

### /imgur/favs

display user favourites
```
curl --location --request POST 'http://localhost:8080/api/imgur-favs' \
    --header 'Content-Type: application/json' \
    --header 'Authorization: Bearer TOKEN' \
    --data-raw '{
        "token":"IMGUR TOKEN"
    }'
```
