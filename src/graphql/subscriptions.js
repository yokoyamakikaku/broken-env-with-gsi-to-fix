/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String @auth(rules: [{ allow: owner, operations: [read]}])
  ) {
    onCreateUser(filter: $filter, owner: $owner) {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String @auth(rules: [{ allow: owner, operations: [read]}])
  ) {
    onUpdateUser(filter: $filter, owner: $owner) {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String @auth(rules: [{ allow: owner, operations: [read]}])
  ) {
    onDeleteUser(filter: $filter, owner: $owner) {
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
export const onCreateGroup = /* GraphQL */ `
  subscription OnCreateGroup(
    $filter: ModelSubscriptionGroupFilterInput
    $owner: String @auth(rules: [{ allow: owner, operations: [read]}])
  ) {
    onCreateGroup(filter: $filter, owner: $owner) {
      id
      name
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onUpdateGroup = /* GraphQL */ `
  subscription OnUpdateGroup(
    $filter: ModelSubscriptionGroupFilterInput
    $owner: String @auth(rules: [{ allow: owner, operations: [read]}])
  ) {
    onUpdateGroup(filter: $filter, owner: $owner) {
      id
      name
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onDeleteGroup = /* GraphQL */ `
  subscription OnDeleteGroup(
    $filter: ModelSubscriptionGroupFilterInput
    $owner: String @auth(rules: [{ allow: owner, operations: [read]}])
  ) {
    onDeleteGroup(filter: $filter, owner: $owner) {
      id
      name
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onCreateBook = /* GraphQL */ `
  subscription OnCreateBook(
    $filter: ModelSubscriptionBookFilterInput
    $owner: String @auth(rules: [{ allow: owner, operations: [read]}])
  ) {
    onCreateBook(filter: $filter, owner: $owner) {
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
export const onUpdateBook = /* GraphQL */ `
  subscription OnUpdateBook(
    $filter: ModelSubscriptionBookFilterInput
    $owner: String @auth(rules: [{ allow: owner, operations: [read]}])
  ) {
    onUpdateBook(filter: $filter, owner: $owner) {
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
export const onDeleteBook = /* GraphQL */ `
  subscription OnDeleteBook(
    $filter: ModelSubscriptionBookFilterInput
    $owner: String @auth(rules: [{ allow: owner, operations: [read]}])
  ) {
    onDeleteBook(filter: $filter, owner: $owner) {
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
export const onCreateBookCategory = /* GraphQL */ `
  subscription OnCreateBookCategory(
    $filter: ModelSubscriptionBookCategoryFilterInput
    $owner: String @auth(rules: [{ allow: owner, operations: [read]}])
  ) {
    onCreateBookCategory(filter: $filter, owner: $owner) {
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
export const onUpdateBookCategory = /* GraphQL */ `
  subscription OnUpdateBookCategory(
    $filter: ModelSubscriptionBookCategoryFilterInput
    $owner: String @auth(rules: [{ allow: owner, operations: [read]}])
  ) {
    onUpdateBookCategory(filter: $filter, owner: $owner) {
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
export const onDeleteBookCategory = /* GraphQL */ `
  subscription OnDeleteBookCategory(
    $filter: ModelSubscriptionBookCategoryFilterInput
    $owner: String @auth(rules: [{ allow: owner, operations: [read]}])
  ) {
    onDeleteBookCategory(filter: $filter, owner: $owner) {
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
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment(
    $filter: ModelSubscriptionCommentFilterInput
    $owner: String @auth(rules: [{ allow: owner, operations: [read]}])
  ) {
    onCreateComment(filter: $filter, owner: $owner) {
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
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment(
    $filter: ModelSubscriptionCommentFilterInput
    $owner: String @auth(rules: [{ allow: owner, operations: [read]}])
  ) {
    onUpdateComment(filter: $filter, owner: $owner) {
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
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment(
    $filter: ModelSubscriptionCommentFilterInput
    $owner: String @auth(rules: [{ allow: owner, operations: [read]}])
  ) {
    onDeleteComment(filter: $filter, owner: $owner) {
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
