// const express = require("express");
import * as express from "express";
import { graphqlHTTP } from "express-graphql";
const { GraphQLSchema } = require("graphql");

import { RootQueryType, RootMutationType } from "./Resolver";

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);
app.listen(4000, () =>
  console.log("Server Running at local host port 4000; GraphiQL is at /graphql")
);
