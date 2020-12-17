"use strict";
exports.__esModule = true;
var _a = require("graphql"), GraphQLObjectType = _a.GraphQLObjectType, GraphQLString = _a.GraphQLString, GraphQLList = _a.GraphQLList, GraphQLNonNull = _a.GraphQLNonNull;
var graphql_1 = require("graphql");
var Schema_1 = require("./Schema");
var data = require("./UserData.json");
exports.RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "Main query that contains all queries",
    fields: function () { return ({
        people: {
            type: Schema_1.PeopleType,
            description: "A person or people who match from an argument",
            // TODO:
            // check with specs to see if search through People for all people in a particular department
            // currently user needs to query department, then people to return all people in that department
            args: {
                id: { type: GraphQLString },
                firstName: { type: GraphQLString },
                lastName: { type: GraphQLString },
                jobTitle: { type: GraphQLString }
            },
            resolve: function (_, _a) {
                var id = _a.id, firstName = _a.firstName, lastName = _a.lastName, jobTitle = _a.jobTitle;
                return data.people.find(function (people) { return people.id === id; }) ||
                    data.people.find(function (people) { return people.firstName === firstName; }) ||
                    data.people.find(function (people) { return people.lastName === lastName; }) ||
                    data.people.find(function (people) { return people.jobTitle === jobTitle; });
            }
        },
        batchGetPeople: {
            type: new GraphQLList(Schema_1.PeopleType),
            description: "List of all People if no arguments passed. Get the number of observations/records from 'first' (with the index starting at 0 and being non-inclusive of ending at argument 'first') and 'last'. If passed together, 'first' and 'last' are .slice(start, end) respectively.",
            args: {
                first: { type: graphql_1.GraphQLInt },
                last: { type: graphql_1.GraphQLInt }
            },
            resolve: function (_, _a) {
                var first = _a.first, last = _a.last;
                if (first && last) {
                    if (last > first || last === -1) {
                        return data.people.slice(first, last);
                    }
                    else {
                        throw new Error("'last' must be greater than 'first', unless 'last' === -1 then just pass 'first' argument without passing 'last'");
                    }
                }
                if (first) {
                    return data.people.slice(0, first);
                }
                if (last) {
                    return data.people.slice(-last);
                }
                return data.people;
            }
        },
        department: {
            type: Schema_1.DepartmentType,
            description: "A single Department",
            args: {
                id: { type: GraphQLString },
                name: { type: GraphQLString }
            },
            resolve: function (_, _a) {
                var id = _a.id, name = _a.name;
                return data.departments.find(function (department) { return department.id === id; }) ||
                    data.departments.find(function (department) { return department.name === name; });
            }
        },
        batchGetDepartments: {
            type: new GraphQLList(Schema_1.DepartmentType),
            description: "List of all Departments. Get the number of observations/records from 'first' (with the index starting at 0 and being non-inclusive of ending at argument 'first') and 'last'. If passed together, 'first' and 'last' are .slice(start, end) respectively.",
            args: {
                first: { type: graphql_1.GraphQLInt },
                last: { type: graphql_1.GraphQLInt }
            },
            resolve: function (_, _a) {
                var first = _a.first, last = _a.last;
                if (first && last) {
                    if (last > first || last === -1) {
                        return data.departments.slice(first, last);
                    }
                    else {
                        throw new Error("'last' must be greater than 'first', unless 'last' === -1 then just pass 'first' argument without passing 'last'");
                    }
                }
                if (first) {
                    return data.departments.slice(0, first);
                }
                if (last) {
                    return data.departments.slice(-last);
                }
                return data.departments;
            }
        }
    }); }
});
// TODO:
// Check with specs to see if this should be allowed to take more attributes/fields
// to be allowed to select an individual to update. Also check to see what attributes
// should be allowed to be mutated
exports.RootMutationType = new GraphQLObjectType({
    name: "Mutation",
    description: "Mutation to update a person's name or job title, but only if they have the user's ID. This is to add a barrier to avoid misuse or overuse. Data does not persit once the server is destroyed.",
    fields: function () { return ({
        updatePerson: {
            type: Schema_1.PeopleType,
            description: "Update a person's data",
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                firstName: { type: GraphQLString },
                lastName: { type: GraphQLString },
                jobTitle: { type: GraphQLString }
            },
            resolve: function (_, _a) {
                var id = _a.id, firstName = _a.firstName, lastName = _a.lastName, jobTitle = _a.jobTitle;
                var updatedPerson = data.people.find(function (data) {
                    return data.id == id;
                });
                if (firstName) {
                    updatedPerson.firstName = firstName;
                }
                if (lastName) {
                    updatedPerson.lastName = lastName;
                }
                if (jobTitle) {
                    updatedPerson.jobTitle = jobTitle;
                }
                return updatedPerson;
            }
        }
    }); }
});
