## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## CRUD Commands
1. Registration
```
curl -X POST http://localhost:3011/api/v1/users -d '{"email": "admin@sheira.ru", "password": "changeme", "repeat": "changeme"}' -H "Content-Type: application/json"
```

2. Verify
```
curl -X POST http://localhost:3011/api/v1/auth/verify -d '{"code": "a8863dede1b6f9a6d7948eb249653b337"}' -H "Content-Type: application/json"
```

3. Login
```
curl -X POST http://localhost:3011/api/v1/auth/login -d '{"email": "admin@sheira.ru", "password": "changeme"}' -H "Content-Type: application/json"
```

4. OTP
```
curl -X POST http://localhost:3011/api/v1/auth/otp -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzaGVpcmEucnUiLCJzZWNyZXQiOiJCUkRBNkpZREtGS1g2TklJIiwiaWF0IjoxNjg0NTQ3OTM4LCJleHAiOjE2ODQ1NTM5Mzh9.xJpZxJ6uezaSy297uATP3zjiRj5Y8npskb-lyNoD1fs" -d '{"code": 12345}' 
```

curl -X GET http://localhost:3011/api/v1/roles

curl -X POST http://localhost:3011/api/v1/roles -d '{"title": "new role", "description": "new role description"}' -H "Content-Type: application/json"

curl -X PATCH http://localhost:3011/api/v1/roles/[:id] -d '{"title": "new updated role", "description": "new role description"}' -H "Content-Type: application/json"

curl -X DELETE http://localhost:3011/api/v1/roles/[:id]

curl -X GET http://localhost:3011/api/v1/users


curl -X PATCH http://localhost:3011/api/v1/users/1 -d '{"email": "admin.main@sheira.ru", "enabled": true}' -H "Content-Type: application/json"

curl -X DELETE http://localhost:3011/api/v1/users/[:id]

curl http://localhost:3011/api/v1/profiles -H "Authorization: Bearer KWC_OQJOMLQPFE4NLJB61G"

curl -X POST http://localhost:3011/api/v1/profiles -d '{"userId": 1, "username": "olelarsen", "firstName": "Ole", "lastName": "Larsen", "birthdate": "25/01/1988", "about": "there is some information about me", "enabled": true}' -H "Content-Type: application/json" -H "Authorization: Bearer KWC_OQJOMLQPFE4NLJB61G"
curl -X PATCH http://localhost:3011/api/v1/profile/[:id] -d '{"title": "new updated role", "description": "new role description"}' -H "Content-Type: application/json"

curl -X DELETE http://localhost:3011/api/v1/profile/[:id]

curl http://localhost:3011/api/v1/addresses -H "Authorization: Bearer KWC_OQJOMLQPFE4NLJB61G"

curl -X POST http://localhost:3011/api/v1/addresses -d '{ "userId": 1, "addressType": "main",   "country": "Russia", "region": "Saint-Petersburg", "district": "Saint-Petersburg", "city": "Saint-Petersburg", "zip": 1112222, "street": "Nevsky Prospekt", "house": "71", "block": "A", "apartments": "56", "additional": "some more additional information", "enabled": true }' -H "Authorization: Bearer KWC_OQJOMLQPFE4NLJB61G" -H "Content-Type: application/json"
curl -X POST http://localhost:3011/api/v1/addresses -d '{ "userId": 1, "addressType": "second", "country": "Russia", "region": "Moscow",           "district": "Moscow",           "city": "Moscow",           "zip": 1232222, "street": "Kremlin",         "house": "1",  "block": "A", "apartments": "1",  "additional": "some more additional information", "enabled": true }' -H "Authorization: Bearer KWC_OQJOMLQPFE4NLJB61G" -H "Content-Type: application/json"

curl -X POST http://localhost:3011/api/v1/auth/forgot-password -d '{ "email": "admin@sheira.ru" }' -H "Content-Type: application/json"

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

* `npm run migration:create -- {name}` - Create database migration file with `{name}`. Need `DATABASE_URL` [environment variable](#environment-variables).
* `npm run migration:run` - Start database migrations. Need `DATABASE_URL` [environment variable](#environment-variables).
* `npm run migration:down` - Revert last database migration. Need `DATABASE_URL` [environment variable](#environment-variables).

# Login Flow

1. login + password to /api/v1/auth/login. If credentials are correct, check secret field filled in user record. 
2. If secret is empty, it means user login first time. 
3. For the first time generate otp, store it in user record and send back qr code + secret