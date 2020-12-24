import * as express from "express";
import { graphqlHTTP } from "express-graphql";
const { GraphQLSchema } = require("graphql");

import { RootQuery, RootMutation } from "./Resolver";

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});

const port = 5000;
const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.listen(port, () =>
  console.log(`Server Running at local host port ${port}; GraphiQL is at /graphql`)
);