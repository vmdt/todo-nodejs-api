
# Todo Nodejs API
## Tech Stack
Nodejs, Express, Mongoose, JWT, Cloudinary, Nodemailer




## API Features

- Authentication & Authorization
- Forgot & Reset Password
- CRUD operations for tasks
- Upload user's avatar
- Task Searching

## End Points

 - [API Authentication](#Authentication)
 - [API Reference](#api-Reference)
    - [Auth API](#Auth-API)
        - [User signup](#User-signup)
        - [User login](#User-login)
        - [Forgot password](#User-forgot-password)
        - [Reset password](#User-reset-password)
        - [Refresh access token](#Refresh-access-token)
    - [User API](#User-API)
        - [Update profile](#User-update-profile)
        - [Update password](#User-update-password)
    - [Task API](#Task-API)
        - [Get tasks](#Get-tasks)
        - [Create task](#Create-task)
        - [Update task](#Update-task)
        - [Delete task](#Delete-task)
        - [Search task](#Search-task)
## Authentication

Some endpoints may require authentication for example. To create a create/delete/update post, you need to register your API client and obtain an access token.

The endpoints that require authentication expect a bearer token sent in the `Authorization header`

Example:

`Authorization: Bearer YOUR TOKEN`


## API Reference

### Auth API

#### User signup

```http
  POST /api/users/signup
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `fullname` | `string` | **Required** |
| `email` | `string` | **Required** |
| `password` | `string` | **Required** |
| `passwordConfirm` | `string` | **Required** |

#### User login

```http
  POST /api/users/login
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`      | `string` | **Required**|
| `password`      | `string` | **Required**|
| `passwordConfirm`      | `string` | **Required**|


#### User forgot password

```http
  POST /api/users/forgot-password
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`      | `string` | **Required**|

Password reset token is valid for only 10 minutes

#### User reset password

```http
  POST /api/users/reset-password/:token
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `password`      | `string` | **Required**|
| `passwordConfirm`      | `string` | **Required**|

`token` can get from password reset token in email forgot password

#### Refresh access token

```http
  GET /api/users/refresh-access-token
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `refeshToken`      | `string` | Get from cookies|

### User API

#### User update profile

```http
  PATCH /api/users/update-me
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `authentication`      | `string` |**Required**. Bearer Token|
| `avatar`      | `file` | Upload single file|
| `fullname`      | `string` | **Not Required**|

This route is not for password & email updates

#### User update password

```http
  PATCH /api/users/update-password
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `authentication`      | `string` |**Required**. Bearer Token|
| `passwordCurrent`      | `string` | **Required**|
| `password`      | `string` | **Required**|
| `passwordConfirm`      | `string` | **Required**|

### Task API

#### Get tasks

```http
  GET /api/tasks
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `authentication`      | `string` |**Required**. Bearer Token|

Query options:

- Filter:
```http
  GET /api/tasks?field_name=name

  ex: GET /api/tasks?category=study
```
Users can filter query string with comparison query operatiors `$gt`, `$lt`, `$in`, ...
Example: `?priority[gt]=2` priority meaning is greater than 2

- Limit fields:
```http
  GET /api/tasks?fields=field_name
  
  ex: GET /api/tasks?fields=category,description
```
- Sort:
```http
  GET /api/tasks?sort=field_name
  
  ex: GET /api/tasks?sort=priority
```
Users default sorted by ascending,
`sort=-priority` sorted by descending

- Paginate:
```http
  GET /api/tasks?page=page_num&limit=limit_record
  
  ex: GET /api/tasks?page=1&limit=5
```

#### Create task

```http
  POST /api/tasks
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `authentication`      | `string` |**Required**. Bearer Token|
| `category`      | `string` |**Required**|
| `description`      | `string` |**Not Required**|
| `priority`      | `number` |**Required**. Must be in [1,3]|
| `date`      | `string` |**Required**|
| `time`      | `string` |**Not Required**|

#### Update task

```http
  PATCH /api/tasks/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `authentication`      | `string` |**Required**. Bearer Token|

User can update any fields they want

#### Delete task

```http
  DELETE /api/tasks/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `authentication`      | `string` |**Required**. Bearer Token|


#### Search task

```http
  GET /api/tasks/search?q=query_string
```

## 🔗 Links
[![facebook](https://img.shields.io/badge/facebook-Code?style=for-the-badge&logo=facebook&logoColor=white&color=blue)](https://www.facebook.com/profile.php?id=100034947971586)

[![github](https://img.shields.io/badge/github-Code?style=for-the-badge&logo=github&logoColor=white&color=black)](https://github.com/vmdt)
