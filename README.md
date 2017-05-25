# instagram-api

## Prerequisites

  1. Install nodejs
      https://nodejs.org/en/download/

  2. Install mongodb
      https://docs.mongodb.com/manual/administration/install-community/

## Installation packages

   $ npm install
  
Or using yarn

   $ yarn

## How to run app

  $ npm run dev


# API

### Authentication Header:

`Authorization: Token jwt.token.here`

### Errors and Status Codes

If a request fails any validations, expect a 422 and errors in the following format:

```
{
  "errors":{
    "body": [
      "can't be empty"
    ]
  }
}
```

#### Other status codes:

401 for Unauthorized requests, when a request requires authentication but it isn't provided

403 for Forbidden requests, when a request may be valid but the user doesn't have permissions to perform the action

404 for Not found requests, when a resource can't be found to fulfill the request

format

```
{
  "errors" : "message"
}
```


## Endpoints:

### Authentication:

`POST /api/users/login`

Example request body:
```
{
  "user":{
    "email": "exam@exam.com",
    "password": "examexam"
  }
}
```

No authentication required, returns a User

Required fields: `email`, `password`


### Registration:

`POST /api/users`

Example request body:
```
{
  "user":{
    "username": "exam",
    "email": "exam@exam.come",
    "password": "examexam"
  }
}
```

No authentication required, returns a User

Required fields: `email`, `username`, `password`



### Get Current User

`GET /api/user`

Authentication required, returns a User that's the current user

```
{
  "user": {
    "email": "exam@example.com",
    "token": "jwt.token.here",
    "username": "exam"
  }
}
```


### Update User

`PUT /api/user`

Example request body:
```
{
  "user":{
    "email": "exam@exam.exam",
    "bio": "Bla bla bla"
  }
}
```

Authentication required, returns the User


Accepted fields: `email`, `username`, `password`, `image`, `bio`



### Get Profile

`GET /api/profiles/:username`

Authentication optional, returns a Profile

```
{
  "profile": {
    "username": "exam",
    "image": "/uploads/images/avatar/image-1488783522157.jpg",
    "following": false
  }
}
```



### Follow user

`POST /api/profiles/:username/follow`

Authentication required, returns a Profile

No additional parameters required

```
{
  "profile": {
    "username": "exam",
    "image": "/uploads/images/avatar/image-1488783522157.jpg",
    "following": true
  }
}
```



### Unfollow user

`DELETE /api/profiles/:username/follow`

Authentication required, returns a Profile

No additional parameters required

```
{
  "profile": {
    "username": "exam",
    "image": "/uploads/images/avatar/image-1488783522157.jpg",
    "following": true
  }
}
```



### List Photos

`GET /api/photos`

Returns most recent photos globally be default, provide `tag`, `author` or `favorited` query parameter to filter results

Query Parameters:

Filter by tag:

`?tag=ReactJS`

Filter by author:

`?author=exam`

Favorited by user:

`?favorited=exam`

Limit number of photos (default is 20):

`?limit=20`

Offset/skip number of photos:

`?offset=0`

Authentication optional, will return multiple photos, ordered by most recent first


```
{
  "photos": [
      {
      "slug": "iron-man-1495467741859",
      "title": "iron man",
      "description": "iron man",
      "image": "/uploads/images/photos/image-1495467740305.jpg",
      "width": 946,
      "height": 630,
      "format": "jpg",
      "originalName": "image-1495467740305",
      "url": "http://res.cloudinary.com/dvu7qj3gw/image/upload/v1495467741/c5cb0nk4nle4qmpzu5ln.jpg",
      "secUrl": "https://res.cloudinary.com/dvu7qj3gw/image/upload/v1495467741/c5cb0nk4nle4qmpzu5ln.jpg",
      "createdAt": "2017-05-22T15:42:21.886Z",
      "updatedAt": "2017-05-22T15:42:21.886Z",
      "tagList": [],
      "favorited": false,
      "favoritesCount": 0,
      "author": {
        "username": "test01",
        "bio": "This is a test user",
        "image": "/uploads/images/default.jpg",
        "following": false
      }
    },
    {
      "slug": "a-girl-1495462304829",
      "title": "a girl",
      "description": "a girl",
      "image": "/uploads/images/photos/image-1495462300658.jpg",
      "width": 635,
      "height": 481,
      "format": "jpg",
      "originalName": "image-1495462300658",
      "url": "http://res.cloudinary.com/dvu7qj3gw/image/upload/v1495462304/ju4vyg9tukzuzj8mq4hq.jpg",
      "secUrl": "https://res.cloudinary.com/dvu7qj3gw/image/upload/v1495462304/ju4vyg9tukzuzj8mq4hq.jpg",
      "createdAt": "2017-05-22T14:11:44.840Z",
      "updatedAt": "2017-05-22T14:11:44.840Z",
      "tagList": [],
      "favorited": false,
      "favoritesCount": 0,
      "author": {
        "username": "test01",
        "bio": "This is a test user",
        "image": "/uploads/images/default.jpg",
        "following": false
      }
    }
  ],
  "photosCount": 2
}
```

### Feed photos

`GET /api/photos/feed`

Can also take `limit` and `offset` query parameters like List Photos

Authentication required, will return multiple photos created by followed users, ordered by most recent first.

```
{
  "photos": [
      {
      "slug": "iron-man-1495467741859",
      "title": "iron man",
      "description": "iron man",
      "image": "/uploads/images/photos/image-1495467740305.jpg",
      "width": 946,
      "height": 630,
      "format": "jpg",
      "originalName": "image-1495467740305",
      "url": "http://res.cloudinary.com/dvu7qj3gw/image/upload/v1495467741/c5cb0nk4nle4qmpzu5ln.jpg",
      "secUrl": "https://res.cloudinary.com/dvu7qj3gw/image/upload/v1495467741/c5cb0nk4nle4qmpzu5ln.jpg",
      "createdAt": "2017-05-22T15:42:21.886Z",
      "updatedAt": "2017-05-22T15:42:21.886Z",
      "tagList": [],
      "favorited": false,
      "favoritesCount": 0,
      "author": {
        "username": "test01",
        "bio": "This is a test user",
        "image": "/uploads/images/default.jpg",
        "following": false
      }
    },
    {
      "slug": "a-girl-1495462304829",
      "title": "a girl",
      "description": "a girl",
      "image": "/uploads/images/photos/image-1495462300658.jpg",
      "width": 635,
      "height": 481,
      "format": "jpg",
      "originalName": "image-1495462300658",
      "url": "http://res.cloudinary.com/dvu7qj3gw/image/upload/v1495462304/ju4vyg9tukzuzj8mq4hq.jpg",
      "secUrl": "https://res.cloudinary.com/dvu7qj3gw/image/upload/v1495462304/ju4vyg9tukzuzj8mq4hq.jpg",
      "createdAt": "2017-05-22T14:11:44.840Z",
      "updatedAt": "2017-05-22T14:11:44.840Z",
      "tagList": [],
      "favorited": false,
      "favoritesCount": 0,
      "author": {
        "username": "test01",
        "bio": "This is a test user",
        "image": "/uploads/images/default.jpg",
        "following": false
      }
    }
  ],
  "photosCount": 2
}
```


### Retrieve Photo

`GET /api/photos/:slug`

No authentication required, will return single photo

```
{
  "photo": {
      "slug": "iron-man-1495467741859",
      "title": "iron man",
      "description": "iron man",
      "image": "/uploads/images/photos/image-1495467740305.jpg",
      "width": 946,
      "height": 630,
      "format": "jpg",
      "originalName": "image-1495467740305",
      "url": "http://res.cloudinary.com/dvu7qj3gw/image/upload/v1495467741/c5cb0nk4nle4qmpzu5ln.jpg",
      "secUrl": "https://res.cloudinary.com/dvu7qj3gw/image/upload/v1495467741/c5cb0nk4nle4qmpzu5ln.jpg",
      "createdAt": "2017-05-22T15:42:21.886Z",
      "updatedAt": "2017-05-22T15:42:21.886Z",
      "tagList": [],
      "favorited": false,
      "favoritesCount": 0,
      "author": {
        "username": "test01",
        "bio": "This is a test user",
        "image": "/uploads/images/default.jpg",
        "following": false
      }
    }
}
```

### Create Photo

`POST /api/photos`

Example request body:

```
{
  "title": "iron man",
  "description": "iron man",
  "image": FILE_FORM_DATA,
}
```
Note: you can add "tagList": ['reactjs', 'angularjs', 'dragons'],

Authentication required, will return an Photo

Required fields: `title`, `description`

Optional fields: `tagList` as an array of Strings

```
{
  "photo": {
      "slug": "iron-man-1495467741859",
      "title": "iron man",
      "description": "iron man",
      "image": "/uploads/images/photos/image-1495467740305.jpg",
      "width": 946,
      "height": 630,
      "format": "jpg",
      "originalName": "image-1495467740305",
      "url": "http://res.cloudinary.com/dvu7qj3gw/image/upload/v1495467741/c5cb0nk4nle4qmpzu5ln.jpg",
      "secUrl": "https://res.cloudinary.com/dvu7qj3gw/image/upload/v1495467741/c5cb0nk4nle4qmpzu5ln.jpg",
      "createdAt": "2017-05-22T15:42:21.886Z",
      "updatedAt": "2017-05-22T15:42:21.886Z",
      "tagList": [],
      "favorited": false,
      "favoritesCount": 0,
      "author": {
        "username": "test01",
        "bio": "This is a test user",
        "image": "/uploads/images/default.jpg",
        "following": false
      }
    }
}
```

### Update photo

`PUT /api/photos/:slug`

Example request body:

```
{
  "description": "Anh dep bla bla",
  "image: FILE_FORM_DATA
}
```

Authentication required, returns the updated Photo

Optional fields: `title`, `description`, `image`

The `slug` also gets updated when the `title` is changed

```
{
  "photo": {
      "slug": "iron-man-1495467741859",
      "title": "iron man",
      "description": "Anh dep bla bla",
      "image": "/uploads/images/photos/image-1495467740305.jpg",
      "width": 946,
      "height": 630,
      "format": "jpg",
      "originalName": "image-1495467740305",
      "url": "http://res.cloudinary.com/dvu7qj3gw/image/upload/v1495467741/c5cb0nk4nle4qmpzu5ln.jpg",
      "secUrl": "https://res.cloudinary.com/dvu7qj3gw/image/upload/v1495467741/c5cb0nk4nle4qmpzu5ln.jpg",
      "createdAt": "2017-05-22T15:42:21.886Z",
      "updatedAt": "2017-05-22T15:42:21.886Z",
      "tagList": [],
      "favorited": false,
      "favoritesCount": 0,
      "author": {
        "username": "test01",
        "bio": "This is a test user",
        "image": "/uploads/images/default.jpg",
        "following": false
      }
    }
}
```

### Delete a photo

`DELETE /api/photos/:slug`

No body

Authentication required, returns `{status: 'OK'}` for success

### Adding comments to an photo

`POST /api/photos/:slug/comments`

Example request body:

```
{
  "body": "This my demo comment."
}
```

Authentication required, returns the created Comment

Required fields: `body`

```
{
  "comment": {
    "id": "58c2542adcd58829926816ae",
    "body": "This my demo comment.",
    "createdAt": "2017-03-10T07:22:18.872Z",
    "author": {
      "username": "exam",
      "image": "/uploads/images/avatar/image-1488783522157.jpg",
      "following": false
    }
  }
}
```


### Getting comments to an photo

`GET /api/photos/:slug/comments`

Authentication optional, returns multiple comments

```
{
  "comments": [
    {
      "id": "58c257608b49062cfc6d2567",
      "body": "This my demo comment.",
      "createdAt": "2017-03-10T07:36:20.815Z",
      "author": {
        "username": "exam",
        "image": "/uploads/images/default.jpg",
        "following": false
      }
    },
    {
      "id": "58c2542adcd58829926816ae",
      "body": "This my demo comment 2.",
      "createdAt": "2017-03-10T07:22:18.872Z",
      "author": {
        "username": "exam",
        "image": "/uploads/images/default.jpg",
        "following": false
      }
    }
  ]
}
```



### Deleting a comment

`DELETE /api/photos/:slug/comments/:id`

Authentication required

return `{status: 'OK'}` for success

### Favoriting an photo

`POST /api/photos/:slug/favorite`

Authentication required, returns the Photo

No additional parameters required

```
{
  "photo": {
      "slug": "iron-man-1495467741859",
      "title": "iron man",
      "description": "iron man",
      "image": "/uploads/images/photos/image-1495467740305.jpg",
      "width": 946,
      "height": 630,
      "format": "jpg",
      "originalName": "image-1495467740305",
      "url": "http://res.cloudinary.com/dvu7qj3gw/image/upload/v1495467741/c5cb0nk4nle4qmpzu5ln.jpg",
      "secUrl": "https://res.cloudinary.com/dvu7qj3gw/image/upload/v1495467741/c5cb0nk4nle4qmpzu5ln.jpg",
      "createdAt": "2017-05-22T15:42:21.886Z",
      "updatedAt": "2017-05-22T15:42:21.886Z",
      "tagList": [],
      "favorited": true,
      "favoritesCount": 1,
      "author": {
        "username": "test01",
        "bio": "This is a test user",
        "image": "/uploads/images/default.jpg",
        "following": false
      }
    }
}
```


### Unfavoriting an photo

`DELETE /api/photos/:slug/favorite`

Authentication required, returns the Photo

No additional parameters required

```
{
  "photo": {
      "slug": "iron-man-1495467741859",
      "title": "iron man",
      "description": "iron man",
      "image": "/uploads/images/photos/image-1495467740305.jpg",
      "width": 946,
      "height": 630,
      "format": "jpg",
      "originalName": "image-1495467740305",
      "url": "http://res.cloudinary.com/dvu7qj3gw/image/upload/v1495467741/c5cb0nk4nle4qmpzu5ln.jpg",
      "secUrl": "https://res.cloudinary.com/dvu7qj3gw/image/upload/v1495467741/c5cb0nk4nle4qmpzu5ln.jpg",
      "createdAt": "2017-05-22T15:42:21.886Z",
      "updatedAt": "2017-05-22T15:42:21.886Z",
      "tagList": [],
      "favorited": false,
      "favoritesCount": 0,
      "author": {
        "username": "test01",
        "bio": "This is a test user",
        "image": "/uploads/images/default.jpg",
        "following": false
      }
    }
}
```


### Get tags

`GET /api/tags`

No authentication required, returns a List of Tags

```
{
  "tags": [
    "[\"ReactJS\", \"AngularJS\"]"
  ]
}
```

## How to use POSTMAN

set environment variables: 

Click `SETTING` icon (at TOP-RIGHT) --> Select `Manage Environment` -> Click Add -> 

Fill `Environment Name` : `instagram-api`
Fill key-value pairs:
`host`: `https://iossimple-instagram.herokuapp.com`
`jwt_token_khacpv`: `token return from server`
Click Update

### Heroku

[https://iossimple-instagram.herokuapp.com](https://iossimple-instagram.herokuapp.com)
