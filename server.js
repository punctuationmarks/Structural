"use strict";
exports.__esModule = true;
var express = require("express");
var express_graphql_1 = require("express-graphql");
var GraphQLSchema = require("graphql").GraphQLSchema;
var Resolver_1 = require("./Resolver");
var schema = new GraphQLSchema({
    query: Resolver_1.RootQueryType,
    mutation: Resolver_1.RootMutationType
});
var app = express();
app.use("/graphql", express_graphql_1.graphqlHTTP({
    schema: schema,
    graphiql: true
}));
app.listen(4000, function () {
    return console.log("Server Running at local host port 4000; GraphiQL is at /graphql");
});
