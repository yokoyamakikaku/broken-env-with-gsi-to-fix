/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      bornedDate
      groupId
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        bornedDate
        groupId
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getGroup = /* GraphQL */ `
  query GetGroup($id: ID!) {
    getGroup(id: $id) {
      id
      name
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listGroups = /* GraphQL */ `
  query ListGroups(
    $filter: ModelGroupFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGroups(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getBook = /* GraphQL */ `
  query GetBook($id: ID!) {
    getBook(id: $id) {
      id
      name
      categoryId
      groupId
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listBooks = /* GraphQL */ `
  query ListBooks(
    $filter: ModelBookFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBooks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        categoryId
        groupId
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getBookCategory = /* GraphQL */ `
  query GetBookCategory($id: ID!) {
    getBookCategory(id: $id) {
      id
      name
      groupId
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listBookCategories = /* GraphQL */ `
  query ListBookCategories(
    $filter: ModelBookCategoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBookCategories(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        groupId
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getComment = /* GraphQL */ `
  query GetComment($id: ID!) {
    getComment(id: $id) {
      id
      contents
      groupId
      userId
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listComments = /* GraphQL */ `
  query ListComments(
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        contents
        groupId
        userId
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listUsersByGroupId = /* GraphQL */ `
  query ListUsersByGroupId(
    $groupId: String!
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsersByGroupId(
      groupId: $groupId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        bornedDate
        groupId
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listUsersByCreatedAt = /* GraphQL */ `
  query ListUsersByCreatedAt(
    $createdAt: AWSDateTime!
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsersByCreatedAt(
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        bornedDate
        groupId
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listGroupsByCreatedAt = /* GraphQL */ `
  query ListGroupsByCreatedAt(
    $createdAt: AWSDateTime!
    $sortDirection: ModelSortDirection
    $filter: ModelGroupFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGroupsByCreatedAt(
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listBooksByGroupId = /* GraphQL */ `
  query ListBooksByGroupId(
    $groupId: String!
    $sortDirection: ModelSortDirection
    $filter: ModelBookFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBooksByGroupId(
      groupId: $groupId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        categoryId
        groupId
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listBooksByCreatedAt = /* GraphQL */ `
  query ListBooksByCreatedAt(
    $createdAt: AWSDateTime!
    $sortDirection: ModelSortDirection
    $filter: ModelBookFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBooksByCreatedAt(
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        categoryId
        groupId
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listBookCategoriesByGroupId = /* GraphQL */ `
  query ListBookCategoriesByGroupId(
    $groupId: String!
    $sortDirection: ModelSortDirection
    $filter: ModelBookCategoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBookCategoriesByGroupId(
      groupId: $groupId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        groupId
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listBookCategoriesByCreatedAt = /* GraphQL */ `
  query ListBookCategoriesByCreatedAt(
    $createdAt: AWSDateTime!
    $sortDirection: ModelSortDirection
    $filter: ModelBookCategoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBookCategoriesByCreatedAt(
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        groupId
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listCommentsByGroupId = /* GraphQL */ `
  query ListCommentsByGroupId(
    $groupId: String!
    $sortDirection: ModelSortDirection
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCommentsByGroupId(
      groupId: $groupId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        contents
        groupId
        userId
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listCommentsByUserId = /* GraphQL */ `
  query ListCommentsByUserId(
    $userId: String!
    $sortDirection: ModelSortDirection
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCommentsByUserId(
      userId: $userId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        contents
        groupId
        userId
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listCommentsByCreatedAt = /* GraphQL */ `
  query ListCommentsByCreatedAt(
    $createdAt: AWSDateTime!
    $sortDirection: ModelSortDirection
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCommentsByCreatedAt(
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        contents
        groupId
        userId
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
