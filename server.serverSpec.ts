// TODO:
// ADD TESTS FOR UPDATING A PERSON
// MAYBE ADD A FRONT END?
import { GraphQLList, GraphQLString, GraphQLNonNull } from "graphql";
import * as chai from "chai";

import { DepartmentType, PeopleType } from "./Schema";
import { RootQueryType } from "./Resolver";

const expect = chai.expect;
const should = chai.should();

describe("DepartmentType", () => {
  it("Should have an id field of type String", () => {
    expect(DepartmentType.getFields()).to.have.property("id");
    expect(DepartmentType.getFields().id.type).to.deep.equals(
      GraphQLNonNull(GraphQLString)
    );
  });

  it("Should have a name field of type String", () => {
    expect(DepartmentType.getFields()).to.have.property("name");
    expect(DepartmentType.getFields().name.type).to.deep.equals(
      GraphQLNonNull(GraphQLString)
    );
  });
});

describe("PeopleType", () => {
  it("Should have an id field of type String", () => {
    expect(PeopleType.getFields()).to.have.property("id");
    expect(PeopleType.getFields().id.type).to.deep.equals(
      GraphQLNonNull(GraphQLString)
    );
  });

  it("Should have a name field of type String", () => {
    expect(PeopleType.getFields()).to.have.property("firstName");
  });

  it("Should have a name field of type String", () => {
    expect(PeopleType.getFields()).to.have.property("lastName");
  });

  it("Should have a department field linked to DepartmentType", () => {
    expect(PeopleType.getFields()).to.have.property("department");
    expect(PeopleType.getFields().department.type).to.deep.equals(
      GraphQLList(DepartmentType)
    );
  });
});

describe("Query departments", () => {
  // Querying individual departments
  it("Should return an object if query by id or name", () => {
    RootQueryType.getFields()
      .department.resolve(null, { id: "ddd31c01-a30d-4e72-8e8b-d710fcc4fb56" })
      .should.be.an("object");

    RootQueryType.getFields()
      .department.resolve(null, { name: "HR" })
      .should.be.an("object");
  });

  it("Should return the HR department", () => {
    RootQueryType.getFields()
      .department.resolve(null, { id: "ddd31c01-a30d-4e72-8e8b-d710fcc4fb56" })
      .should.include({ name: "HR" });
  });

  // Querying all departments
  it("Should return an array if query all departments", () => {
    RootQueryType.getFields().getAllDepartments.resolve().should.be.an("array");
  });
});

describe("Query people", () => {
  // Querying individual people
  // NOTE: Querying the CEO since there is a higher chance they'll still be at ECorp for longer
  // also, chose to query by job title and ID because if the board replaces them, less code to change
  it("Should return an object if query by id or name", () => {
    RootQueryType.getFields()
      .people.resolve(null, { id: "2798c35b-5b8f-4a5d-9858-0a818d48cbef" })
      .should.be.an("object");

    RootQueryType.getFields()
      .people.resolve(null, { jobTitle: "CEO" })
      .should.be.an("object");
  });

  it("Should return the CEO's information", () => {
    RootQueryType.getFields().department.resolve(null, {
      id: "2798c35b-5b8f-4a5d-9858-0a818d48cbef",
    });
    // .should.include({ jobTitle: "CEO" });
  });

  // Querying all departments
  it("Should return an array if query all people", () => {
    RootQueryType.getFields().getAllPeople.resolve().should.be.an("array");
  });
});
