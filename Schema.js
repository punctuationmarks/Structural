"use strict";
exports.__esModule = true;
exports.PeopleType = exports.DepartmentType = void 0;
var _a = require("graphql"), GraphQLObjectType = _a.GraphQLObjectType, GraphQLString = _a.GraphQLString, GraphQLNonNull = _a.GraphQLNonNull, GraphQLList = _a.GraphQLList;
var data = require("./UserData.json");
exports.DepartmentType = new GraphQLObjectType({
    name: "Department",
    description: "This represents a group of people working in a similar vain towards a similar goal to earn currency \n(there are also other philosophical reasons to work, but this might be a number just shy of inifinity)",
    fields: function () { return ({
        id: { type: GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLNonNull(GraphQLString) },
        people: {
            type: new GraphQLList(exports.PeopleType),
            resolve: function (department) {
                return data.people.filter(function (person) {
                    return person.departmentId === department.id;
                });
            }
        }
    }); }
});
exports.PeopleType = new GraphQLObjectType({
    name: "People",
    description: "This represents a people group who toil away in a deparment",
    fields: function () { return ({
        id: { type: GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLNonNull(GraphQLString) },
        lastName: { type: GraphQLNonNull(GraphQLString) },
        jobTitle: { type: GraphQLNonNull(GraphQLString) },
        managerId: { type: GraphQLString },
        manager: {
            type: new GraphQLList(exports.PeopleType),
            resolve: function (person) {
                return data.people.filter(function (people) { return people.id === person.managerId; });
            }
        },
        immediateSubordinants: {
            type: new GraphQLList(exports.PeopleType),
            resolve: function (person) {
                return data.people.filter(function (people) { return people.managerId === person.id; });
            }
        },
        departmentId: { type: GraphQLNonNull(GraphQLString) },
        department: {
            type: new GraphQLList(exports.DepartmentType),
            resolve: function (person) {
                return data.departments.find(function (department) { return department.id === person.departmentId; });
            }
        }
    }); }
});
