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

No authentication required, returns a [User](#users-for-authentication)

Required fields: `email`, `password`


### Registration:

`POST /api/users`

Example request body:
```
{
  "user":{
    "username": "exam"
    "email": "exam@exam.come",
    "password": "examexam"
  }
}
```

No authentication required, returns a [User](#users-for-authentication)

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
          "slug": "anh-dep-1",
          "title": "anh dep 1",
          "description": "anh dep 1",
          "image": "/uploads/images/photos/image-1488804068928.jpg",
          "createdAt": "2017-03-06T12:41:08.934Z",
          "updatedAt": "2017-03-06T12:41:08.934Z",
          "tagList": [],
          "favorited": false,
          "favoritesCount": 0,
          "author": {
              "username": "exam",
              "image": "/uploads/images/avatar/image-1488783522157.jpg",
              "following": false
          }
      },
      {
          "slug": "anh-dep-2",
          "title": "anh dep 2",
          "description": "anh dep 2",
          "image": "/uploads/images/photos/image-1488804049051.jpg",
          "createdAt": "2017-03-06T12:40:49.078Z",
          "updatedAt": "2017-03-06T12:45:52.420Z",
          "tagList": [],
          "favorited": false,
          "favoritesCount": 0,
          "author": {
              "username": "exam",
              "image": "/uploads/images/avatar/image-1488783522157.jpg",
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
          "slug": "anh-dep-1",
          "title": "anh dep 1",
          "description": "anh dep 1",
          "image": "/uploads/images/photos/image-1488804068928.jpg",
          "createdAt": "2017-03-06T12:41:08.934Z",
          "updatedAt": "2017-03-06T12:41:08.934Z",
          "tagList": [],
          "favorited": false,
          "favoritesCount": 0,
          "author": {
              "username": "exam",
              "image": "/uploads/images/avatar/image-1488783522157.jpg",
              "following": false
          }
      },
      {
          "slug": "anh-dep-2",
          "title": "anh dep 2",
          "description": "anh dep 2",
          "image": "/uploads/images/photos/image-1488804049051.jpg",
          "createdAt": "2017-03-06T12:40:49.078Z",
          "updatedAt": "2017-03-06T12:45:52.420Z",
          "tagList": [],
          "favorited": false,
          "favoritesCount": 0,
          "author": {
              "username": "exam",
              "image": "/uploads/images/avatar/image-1488783522157.jpg",
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
    "slug": "anh-dep-1",
    "title": "anh dep 1",
    "description": "Anh dep 1",
    "createdAt": "2017-03-06T12:31:26.037Z",
    "updatedAt": "2017-03-06T12:31:26.037Z",
    "tagList": [],
    "favorited": false,
    "favoritesCount": 0,
    "author": {
      "username": "tiennh",
      "image": "/uploads/images/avatar/image-1488783522157.jpg",
      "following": true
    }
  }
}
```

### Create Photo

`POST /api/photos`

Example request body:

```
{
  "title": "Anh dep 1",
  "description": "Anh dep 1",
  "tagList": ['reactjs', 'angularjs', 'dragons'],
  "image": FILE_FORM_DATA,
}
```

Authentication required, will return an Photo

Required fields: `title`, `description`

Optional fields: `tagList` as an array of Strings

```
{
  "photo": {
    "slug": "anh-dep-4",
    "title": "anh dep 4",
    "description": "anh dep 4",
    "image": "/uploads/images/photos/image-1489129455211.png",
    "createdAt": "2017-03-10T07:04:16.996Z",
    "updatedAt": "2017-03-10T07:04:16.996Z",
    "tagList": [],
    "favorited": false,
    "favoritesCount": 0,
    "author": {
      "username": "exam",
      "image": "/uploads/images/avatar/image-1488783522157.jpg",
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
  "photo": {
    "description": "Anh dep bla bla",
    "image: FILE_FORM_DATA
  }
}
```

Authentication required, returns the updated Photo

Optional fields: `title`, `description`, `image`

The `slug` also gets updated when the `title` is changed

```
{
  "photo": {
    "slug": "anh-dep",
    "title": "anh dep",
    "description": "Anh dep bla bla",
    "image": "/uploads/images/photos/image-1489130284972.png",
    "createdAt": "2017-03-06T12:31:26.037Z",
    "updatedAt": "2017-03-10T07:16:23.040Z",
    "tagList": [],
    "favorited": false,
    "favoritesCount": 0,
    "author": {
      "username": "exam",
      "image": "/uploads/images/avatar/image-1488783522157.jpg",
      "following": false
    }
  }
}
```

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



### Favoriting an photo

`POST /api/photos/:slug/favorite`

Authentication required, returns the Photo

No additional parameters required

```
{
  "photo": {
    "slug": "anh-dep",
    "title": "anh dep",
    "description": "Anh dep",
    "image": "/uploads/images/photos/image-1489130284972.png",
    "createdAt": "2017-03-06T12:31:26.037Z",
    "updatedAt": "2017-03-10T07:54:23.514Z",
    "tagList": [],
    "favorited": true,
    "favoritesCount": 1,
    "author": {
      "username": "exam",
      "image": "/uploads/images/avatar/image-1488783522157.jpg",
      "following": true
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
    "slug": "anh-dep",
    "title": "anh dep",
    "description": "Anh dep",
    "image": "/uploads/images/photos/image-1489130284972.png",
    "createdAt": "2017-03-06T12:31:26.037Z",
    "updatedAt": "2017-03-10T07:54:23.514Z",
    "tagList": [],
    "favorited": false,
    "favoritesCount": 1,
    "author": {
      "username": "exam",
      "image": "/uploads/images/avatar/image-1488783522157.jpg",
      "following": true
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
