/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getDebt = /* GraphQL */ `
  query GetDebt($id: ID!) {
    getDebt(id: $id) {
      id
      name
      type
      balance
      apr
      payment
      user {
        id
        name
        debt {
          nextToken
          startedAt
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        owner
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userDebtId
      owner
    }
  }
`;
export const listDebts = /* GraphQL */ `
  query ListDebts(
    $filter: ModelDebtFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDebts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        type
        balance
        apr
        payment
        user {
          id
          name
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          owner
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userDebtId
        owner
      }
      nextToken
      startedAt
    }
  }
`;
export const syncDebts = /* GraphQL */ `
  query SyncDebts(
    $filter: ModelDebtFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncDebts(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        name
        type
        balance
        apr
        payment
        user {
          id
          name
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          owner
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userDebtId
        owner
      }
      nextToken
      startedAt
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      debt {
        items {
          id
          name
          type
          balance
          apr
          payment
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userDebtId
          owner
        }
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
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
        debt {
          nextToken
          startedAt
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        owner
      }
      nextToken
      startedAt
    }
  }
`;
export const syncUsers = /* GraphQL */ `
  query SyncUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncUsers(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        name
        debt {
          nextToken
          startedAt
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        owner
      }
      nextToken
      startedAt
    }
  }
`;
