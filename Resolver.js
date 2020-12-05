"use strict";
exports.__esModule = true;
exports.RootMutationType = exports.RootQueryType = void 0;
var _a = require("graphql"), GraphQLObjectType = _a.GraphQLObjectType, GraphQLString = _a.GraphQLString, GraphQLList = _a.GraphQLList, GraphQLNonNull = _a.GraphQLNonNull;
var Schema_1 = require("./Schema");
var data = require("./UserData.json");
exports.RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "Root Query",
    fields: function () { return ({
        people: {
            type: Schema_1.PeopleType,
            description: "A person or people who match from an argument",
            args: {
                id: { type: GraphQLString },
                firstName: { type: GraphQLString },
                lastName: { type: GraphQLString },
                jobTitle: { type: GraphQLString }
            },
            resolve: function (_, _a) {
                var id = _a.id, firstName = _a.firstName, lastName = _a.lastName, jobTitle = _a.jobTitle, departmentId = _a.departmentId;
                return data.people.find(function (people) { return people.id === id; }) ||
                    data.people.find(function (people) { return people.firstName === firstName; }) ||
                    data.people.find(function (people) { return people.lastName === lastName; }) ||
                    data.people.find(function (people) { return people.jobTitle === jobTitle; });
            }
        },
        getAllPeople: {
            type: new GraphQLList(Schema_1.PeopleType),
            description: "List of all People",
            resolve: function () { return data.people; }
        },
        department: {
            type: Schema_1.DepartmentType,
            description: "A Single Department",
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
        getAllDepartments: {
            type: new GraphQLList(Schema_1.DepartmentType),
            description: "List of all Departments",
            resolve: function () { return data.departments; }
        }
    }); }
});
exports.RootMutationType = new GraphQLObjectType({
    name: "Mutation",
    description: "Mutation to update a person's name or job title, but only if they have the user's ID. This is to add a barrier to avoid misuse or overuse. Data does not persit once the server is destroyed",
    fields: function () { return ({
        updatePerson: {
            type: Schema_1.PeopleType,
            description: "Update a human's data",
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                firstName: { type: GraphQLString },
                lastName: { type: GraphQLString },
                jobTitle: { type: GraphQLString }
            },
            resolve: function (parent, args) {
                var updatedPerson = data.people.find(function (data) {
                    return data.id == args.id;
                });
                if (args.firstName) {
                    updatedPerson.firstName = args.firstName;
                }
                if (args.lastName) {
                    updatedPerson.lastName = args.lastName;
                }
                if (args.jobTitle) {
                    updatedPerson.jobTitle = args.jobTitle;
                }
                return updatedPerson;
            }
        }
    }); }
});
