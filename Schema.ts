const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
} = require("graphql");

import * as data from "./UserData.json";

export const DepartmentType = new GraphQLObjectType({
  name: "Department",
  description:
    "This represents a group of people working in a similar vain towards a similar goal to earn currency \n(there are also other philosophical reasons to work, but this might be a number just shy of inifinity)",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
    people: {
      type: new GraphQLList(PeopleType),
      resolve: (department: { id: string }) => {
        return data.people.filter(
          (person: { departmentId: string }) =>
            person.departmentId === department.id
        );
      },
    },
  }),
});

export const PeopleType = new GraphQLObjectType({
  name: "People",
  description: "This represents a people group who toil away in a deparment",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLString) },
    firstName: { type: GraphQLNonNull(GraphQLString) },
    lastName: { type: GraphQLNonNull(GraphQLString) },
    jobTitle: { type: GraphQLNonNull(GraphQLString) },
    managerId: { type: GraphQLString }, // optional parameter for record, since not every person has a manager
    manager: {
      type: new GraphQLList(PeopleType),
      resolve: (person: { managerId: any }) => {
        return data.people.filter(
          (people: { id: string }) => people.id === person.managerId
        );
      },
    },
    immediateSubordinants: {
      type: new GraphQLList(PeopleType),
      resolve: (person: { id: string }) => {
        return data.people.filter((people) => people.managerId === person.id);
      },
    },
    departmentId: { type: GraphQLNonNull(GraphQLString) },
    department: {
      type: new GraphQLList(DepartmentType),
      resolve: (person: { departmentId: string }) => {
        return data.departments.find(
          (department: { id: string }) => department.id === person.departmentId
        );
      },
    },
  }),
});
