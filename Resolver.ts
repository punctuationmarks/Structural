const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
} = require("graphql");

import { DepartmentType, PeopleType } from "./Schema";
import * as data from "./UserData.json";

export const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    people: {
      type: PeopleType,
      description: "A person or people who match from an argument",
      args: {
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        jobTitle: { type: GraphQLString },
      },
      resolve: (
        _: string,
        { id, firstName, lastName, jobTitle, departmentId }
      ) =>
        data.people.find((people: { id: string }) => people.id === id) ||
        data.people.find(
          (people: { firstName: string }) => people.firstName === firstName
        ) ||
        data.people.find(
          (people: { lastName: string }) => people.lastName === lastName
        ) ||
        data.people.find(
          (people: { jobTitle: string }) => people.jobTitle === jobTitle
        ),
    },
    getAllPeople: {
      type: new GraphQLList(PeopleType),
      description: "List of all People",
      resolve: () => data.people,
    },
    department: {
      type: DepartmentType,
      description: "A Single Department",
      args: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
      },
      resolve: (_: string, { id, name }) =>
        data.departments.find(
          (department: { id: string }) => department.id === id
        ) ||
        data.departments.find(
          (department: { name: string }) => department.name === name
        ),
    },
    getAllDepartments: {
      type: new GraphQLList(DepartmentType),
      description: "List of all Departments",
      resolve: () => data.departments,
    },
  }),
});

export const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description:
    "Mutation to update a person's name or job title, but only if they have the user's ID. This is to add a barrier to avoid misuse or overuse. Data does not persit once the server is destroyed",
  fields: () => ({
    updatePerson: {
      type: PeopleType,
      description: "Update a human's data",
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        jobTitle: { type: GraphQLString },
      },
      resolve: (parent, args) => {
        const updatedPerson = data.people.find((data) => {
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
      },
    },
  }),
});
