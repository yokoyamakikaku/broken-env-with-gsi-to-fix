/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
export const createGroup = /* GraphQL */ `
  mutation CreateGroup(
    $input: CreateGroupInput!
    $condition: ModelGroupConditionInput
  ) {
    createGroup(input: $input, condition: $condition) {
      id
      name
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const updateGroup = /* GraphQL */ `
  mutation UpdateGroup(
    $input: UpdateGroupInput!
    $condition: ModelGroupConditionInput
  ) {
    updateGroup(input: $input, condition: $condition) {
      id
      name
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const deleteGroup = /* GraphQL */ `
  mutation DeleteGroup(
    $input: DeleteGroupInput!
    $condition: ModelGroupConditionInput
  ) {
    deleteGroup(input: $input, condition: $condition) {
      id
      name
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const createBook = /* GraphQL */ `
  mutation CreateBook(
    $input: CreateBookInput!
    $condition: ModelBookConditionInput
  ) {
    createBook(input: $input, condition: $condition) {
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
export const updateBook = /* GraphQL */ `
  mutation UpdateBook(
    $input: UpdateBookInput!
    $condition: ModelBookConditionInput
  ) {
    updateBook(input: $input, condition: $condition) {
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
export const deleteBook = /* GraphQL */ `
  mutation DeleteBook(
    $input: DeleteBookInput!
    $condition: ModelBookConditionInput
  ) {
    deleteBook(input: $input, condition: $condition) {
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
export const createBookCategory = /* GraphQL */ `
  mutation CreateBookCategory(
    $input: CreateBookCategoryInput!
    $condition: ModelBookCategoryConditionInput
  ) {
    createBookCategory(input: $input, condition: $condition) {
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
export const updateBookCategory = /* GraphQL */ `
  mutation UpdateBookCategory(
    $input: UpdateBookCategoryInput!
    $condition: ModelBookCategoryConditionInput
  ) {
    updateBookCategory(input: $input, condition: $condition) {
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
export const deleteBookCategory = /* GraphQL */ `
  mutation DeleteBookCategory(
    $input: DeleteBookCategoryInput!
    $condition: ModelBookCategoryConditionInput
  ) {
    deleteBookCategory(input: $input, condition: $condition) {
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
export const createComment = /* GraphQL */ `
  mutation CreateComment(
    $input: CreateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    createComment(input: $input, condition: $condition) {
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
export const updateComment = /* GraphQL */ `
  mutation UpdateComment(
    $input: UpdateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    updateComment(input: $input, condition: $condition) {
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
export const deleteComment = /* GraphQL */ `
  mutation DeleteComment(
    $input: DeleteCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    deleteComment(input: $input, condition: $condition) {
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
