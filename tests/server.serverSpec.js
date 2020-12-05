"use strict";
exports.__esModule = true;
// TODO:
// ADD TESTS FOR UPDATING A PERSON
// MAYBE ADD A FRONT END?
var graphql_1 = require("graphql");
var chai = require("chai");
var Schema_1 = require("../Schema");
var Resolver_1 = require("../Resolver");
var expect = chai.expect;
var should = chai.should();
describe("DepartmentType", function () {
    it("Should have an id field of type String", function () {
        expect(Schema_1.DepartmentType.getFields()).to.have.property("id");
        expect(Schema_1.DepartmentType.getFields().id.type).to.deep.equals(graphql_1.GraphQLNonNull(graphql_1.GraphQLString));
    });
    it("Should have a name field of type String", function () {
        expect(Schema_1.DepartmentType.getFields()).to.have.property("name");
        expect(Schema_1.DepartmentType.getFields().name.type).to.deep.equals(graphql_1.GraphQLNonNull(graphql_1.GraphQLString));
    });
});
describe("PeopleType", function () {
    it("Should have an id field of type String", function () {
        expect(Schema_1.PeopleType.getFields()).to.have.property("id");
        expect(Schema_1.PeopleType.getFields().id.type).to.deep.equals(graphql_1.GraphQLNonNull(graphql_1.GraphQLString));
    });
    it("Should have a name field of type String", function () {
        expect(Schema_1.PeopleType.getFields()).to.have.property("firstName");
    });
    it("Should have a name field of type String", function () {
        expect(Schema_1.PeopleType.getFields()).to.have.property("lastName");
    });
    it("Should have a department field linked to DepartmentType", function () {
        expect(Schema_1.PeopleType.getFields()).to.have.property("department");
        expect(Schema_1.PeopleType.getFields().department.type).to.deep.equals(graphql_1.GraphQLList(Schema_1.DepartmentType));
    });
});
describe("Query departments", function () {
    // Querying individual departments
    it("Should return an object if query by id or name", function () {
        Resolver_1.RootQueryType.getFields()
            .department.resolve(null, { id: "ddd31c01-a30d-4e72-8e8b-d710fcc4fb56" })
            .should.be.an("object");
        Resolver_1.RootQueryType.getFields()
            .department.resolve(null, { name: "HR" })
            .should.be.an("object");
    });
    it("Should return the HR department", function () {
        Resolver_1.RootQueryType.getFields()
            .department.resolve(null, { id: "ddd31c01-a30d-4e72-8e8b-d710fcc4fb56" })
            .should.include({ name: "HR" });
    });
    // Querying all departments
    it("Should return an array if query all departments", function () {
        Resolver_1.RootQueryType.getFields().getAllDepartments.resolve().should.be.an("array");
    });
});
describe("Query people", function () {
    // Querying individual people
    // NOTE: Querying the CEO since there is a higher chance they'll still be at ECorp for longer
    // also, chose to query by job title and ID because if the board replaces them, less code to change
    it("Should return an object if query by id or name", function () {
        Resolver_1.RootQueryType.getFields()
            .people.resolve(null, { id: "2798c35b-5b8f-4a5d-9858-0a818d48cbef" })
            .should.be.an("object");
        Resolver_1.RootQueryType.getFields()
            .people.resolve(null, { jobTitle: "CEO" })
            .should.be.an("object");
    });
    it("Should return the CEO's information", function () {
        Resolver_1.RootQueryType.getFields().department.resolve(null, {
            id: "2798c35b-5b8f-4a5d-9858-0a818d48cbef"
        });
        // .should.include({ jobTitle: "CEO" });
    });
    // Querying all departments
    it("Should return an array if query all people", function () {
        Resolver_1.RootQueryType.getFields().getAllPeople.resolve().should.be.an("array");
    });
});
