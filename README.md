# Rest API with NestJS

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install

# set up a new Prisma project
$ npx prisma init

# container up
$ npm run db:dev:up
```

- El comando `npx prisma init` crea una carpeta prisma con el schema para ser modificado y un archivo .env
- Reemplaza la informacion de docker-compose.yaml dentro del archivo .env
- Crea una variable de entorno JWT_SECRET_KEY y asignale un valor en string
- Agrega el siguiente codigo a prisma/scheme.prisma

```typescript
model User {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  email String
  hash  String

  firstName String?
  lastName  String?

  bookmarks Bookmark[]

  @@unique([email])
  @@map("users")
}

model Bookmark {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  title       String
  description String?
  link        String

  userId Int
  user   User @relation(fields: [userId], references: [id])

  @@map("bookmarks")
}
```

Migra los esquemas de prisma.schema a la base de datos con `npx prisma migrate dev`

## Prisma

```bash
# browse your data
$ npx prisma studio

# create migrations from your Prisma schema, apply them to the database, generate artifacts
$ npx prisma migration dev

# pull the schema from an existing database, updating the Prisma schema
$ prisma db pull

# push the Prisma schema state to the database
$ prisma db push
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
