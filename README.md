# Employee and Department project for Structural

GraphQL with Express, written in TypeScript. Tests written with Chai and Mocha.

## Getting started

- Install the node modules. I prefer yarn, but feel free to use npm or another package manager. The scripts and packages are in the package.json file.

```
$ yarn install
```

- Starting the server, which will have the GraphiQL GUI at `http://localhost:4000/graphql`. _This is also console logged in case you just ran it without reading this._

```
$ yarn start
```

- Run the tests

```
$ yarn test
```

## Introspection on the schema

```graphql
query {
  __schema {
    queryType {
      name
      description
    }
    mutationType {
      name
      description
    }
    types {
      name
      description
    }
  }
}
```

## Some sample queries:

- Querying people

```graphql
query {
  asia: people(firstName: "Asia") {
    lastName
    jobTitle
    manager {
      firstName
      lastName
      jobTitle
      id
    }
    immediateSubordinants {
      firstName
      lastName
      jobTitle
    }
  }
  ceo: people(jobTitle: "CEO") {
    firstName
    lastName
    jobTitle
    # returns empty array
    manager {
      id
    }
    immediateSubordinants {
      firstName
      lastName
      jobTitle
    }
  }
}
```

- Querying a department

```graphql
query {
  department(name: "HR") {
    name
    id
    # returns all people in that department
    people {
      firstName
      lastName
    }
  }
}
```

- Query all people/departments

```graphql
query {
  batchGetDepartments {
    name
    id
  }
  batchGetPeople {
    firstName
    lastName
  }
}

# with optional limits
query {
  batchGetPeople(last: 5) {
    lastName
    jobTitle
  }

  batchGetDepartments(first: 5) {
    name
    id
  }
}
```

## Updating individual person

**Notes**: Mutations require the individual's id, this is a required argument just to add a barrier to avoid misuse or overuse. Data does not persit once the server is destroyed.

- Mutation example

```graphql
mutation {
  updatePerson(id: "d44390cd-b306-4e11-b7d5-a5e0e6fe1e3d", jobTitle: "COO") {
    id
    firstName
    jobTitle
    departmentId
  }
}
```

#### Caveats

This was my first project working with GraphQL in any format, so my apologies for any poor naming conventions and any relational taboos. I have much more experience in straight JavaScript with NoSQL DBs like MongoDB and Firebase (when it comes to database structures outside of SQL). With that, I found GraphQL captivating and a fun way to structure data, thank you for pushing me to think of data relations in a new way. Hope this finds you well.
