const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
} = require("graphql");

import { error } from "console";
import { GraphQLInt } from "graphql";
import { DepartmentType, PeopleType } from "./Schema";
import * as data from "./UserData.json";

export const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Main query that contains all queries",
  fields: () => ({
    people: {
      type: PeopleType,
      description: "A person or people who match from an argument",
      // TODO:
      // check with specs to see if search through People for all people in a particular department
      // currently user needs to query department, then people to return all people in that department
      args: {
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        jobTitle: { type: GraphQLString },
      },
      resolve: (_: string, { id, firstName, lastName, jobTitle }) =>
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
    batchGetPeople: {
      type: new GraphQLList(PeopleType),
      description:
        "List of all People if no arguments passed. Get the number of observations/records from 'first' (with the index starting at 0 and being non-inclusive of ending at argument 'first') and 'last'. If passed together, 'first' and 'last' are .slice(start, end) respectively.",
      args: {
        first: { type: GraphQLInt },
        last: { type: GraphQLInt },
      },
      resolve: (_: string, { first, last }) => {
        if (first && last) {
          if (last > first || last === -1) {
            return data.people.slice(first, last);
          } else {
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
      },
    },
    department: {
      type: DepartmentType,
      description: "A single Department",
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
    batchGetDepartments: {
      type: new GraphQLList(DepartmentType),
      description:
        "List of all Departments. Get the number of observations/records from 'first' (with the index starting at 0 and being non-inclusive of ending at argument 'first') and 'last'. If passed together, 'first' and 'last' are .slice(start, end) respectively.",
      args: {
        first: { type: GraphQLInt },
        last: { type: GraphQLInt },
      },
      resolve: (_: string, { first, last }) => {
        if (first && last) {
          if (last > first || last === -1) {
            return data.departments.slice(first, last);
          } else {
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
      },
    },
  }),
});

// TODO:
// Check with specs to see if this should be allowed to take more attributes/fields
// to be allowed to select an individual to update. Also check to see what attributes
// should be allowed to be mutated
export const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description:
    "Mutation to update a person's name or job title, but only if they have the user's ID. This is to add a barrier to avoid misuse or overuse. Data does not persit once the server is destroyed.",
  fields: () => ({
    updatePerson: {
      type: PeopleType,
      description: "Update a person's data",
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        jobTitle: { type: GraphQLString },
      },
      resolve: (_: string, { id, firstName, lastName, jobTitle }) => {
        let updatedPerson = data.people.find((data: { id: string }) => {
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
      },
    },
  }),
});
