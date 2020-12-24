import { GraphQLList, GraphQLString, GraphQLNonNull } from "graphql";
import * as chai from "chai";

import { DepartmentType, PeopleType } from "../Schema";
import { RootQuery, RootMutation } from "../Resolver";

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
    RootQuery.getFields()
      .department.resolve(null, { id: "ddd31c01-a30d-4e72-8e8b-d710fcc4fb56" })
      .should.be.an("object");

    RootQuery.getFields()
      .department.resolve(null, { name: "HR" })
      .should.be.an("object");
  });
  // Querying all departments
  it("Should return an array if query all departments", () => {
    RootQuery.getFields()
      .batchGetDepartments.resolve(null, { first: undefined, last: undefined })
      .should.be.an("array");
  });

  it("Should return just the first two departments", () => {
    RootQuery.getFields()
      .batchGetDepartments.resolve(null, { first: 2 })
      .should.be.an("array")
      .with.length(2);
  });
});

describe("Query people", () => {
  // Querying individual people
  // NOTE: Querying the CEO since there is a higher chance they'll still be at ECorp for longer
  it("Should return an object if query by job title", () => {
    RootQuery.getFields()
      .people.resolve(null, { jobTitle: "CEO" })
      .should.include({ firstName: "Orval" });
  });

  it("Should return an object if query by id", () => {
    RootQuery.getFields()
      .people.resolve(null, {
        id: "2798c35b-5b8f-4a5d-9858-0a818d48cbef",
      })
      .should.include({ jobTitle: "CEO" });
  });

  // Querying all people
  it("Should return an array if query all people", () => {
    RootQuery.getFields()
      .batchGetPeople.resolve(null, { first: undefined, last: undefined })
      .should.be.an("array");
  });

  it("Should return just the first three people", () => {
    RootQuery.getFields()
      .batchGetPeople.resolve(null, { first: 3 })
      .should.be.an("array")
      .with.length(3);
  });

  it("Should throw an error since last < first", () => {
    expect(() =>
      RootQuery.getFields().batchGetPeople.resolve(null, {
        first: 3,
        last: 1,
      })
    ).to.throw();
  });
});

describe("Updating a person", () => {
  it("Should return the individual updated", () => {
    RootMutation.getFields()
      .updatePerson.resolve(null, {
        id: "2798c35b-5b8f-4a5d-9858-0a818d48cbef",
        firstName: "Billy",
      })
      .should.include({ firstName: "Billy", jobTitle: "CEO" });
  });

  it("should fail if trying to update by anything besides the ID", () => {
    expect(() =>
          RootMutation.getFields().updatePerson.resolve(null, {
        jobTitle: "CEO",
        firstName: "Billy",
      })
    ).to.throw();
  });
});
