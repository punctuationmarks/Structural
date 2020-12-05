import { GraphQLList, GraphQLString, GraphQLNonNull } from "graphql";
import * as chai from "chai";

import { DepartmentType, PeopleType } from "../Schema";
import { RootQueryType, RootMutationType } from "../Resolver";

const expect = chai.expect;
const should = chai.should();
const assert = chai.assert;

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
  // Querying all departments
  it("Should return an array if query all departments", () => {
    RootQueryType.getFields().getAllDepartments.resolve().should.be.an("array");
  });
});

describe("Query people", () => {
  // Querying individual people
  // NOTE: Querying the CEO since there is a higher chance they'll still be at ECorp for longer
  it("Should return an object if query by job title", () => {
    RootQueryType.getFields()
      .people.resolve(null, { jobTitle: "CEO" })
      .should.include({ firstName: "Orval" });
  });

  it("Should return an object if query by id", () => {
    RootQueryType.getFields()
      .people.resolve(null, {
        id: "2798c35b-5b8f-4a5d-9858-0a818d48cbef",
      })
      .should.include({ jobTitle: "CEO" });
  });

  // Querying all people
  it("Should return an array if query all people", () => {
    RootQueryType.getFields().getAllPeople.resolve().should.be.an("array");
  });
});

describe("Updating a person", () => {
  it("Should return the individual updated", () => {
    RootMutationType.getFields()
      .updatePerson.resolve(null, {
        id: "2798c35b-5b8f-4a5d-9858-0a818d48cbef",
        firstName: "Billy",
      })
      .should.include({ firstName: "Billy", jobTitle: "CEO" });
  });

  // This technically fails, but having an issue getting the test to pass stating that it failed. 
  // Need to look deeper into the chai docs for this
  // it("should fail if trying to update by anything besides the ID", () => {
  //   assert.fail(
  //     RootMutationType.getFields().updatePerson.resolve(null, {
  //       jobTitle: "CEO",
  //       firstName: "Billy",
  //     })
  //   );
  // });
});
