/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateDebt = /* GraphQL */ `
  subscription OnCreateDebt($owner: String) {
    onCreateDebt(owner: $owner) {
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
export const onUpdateDebt = /* GraphQL */ `
  subscription OnUpdateDebt($owner: String) {
    onUpdateDebt(owner: $owner) {
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
export const onDeleteDebt = /* GraphQL */ `
  subscription OnDeleteDebt($owner: String) {
    onDeleteDebt(owner: $owner) {
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
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($owner: String) {
    onCreateUser(owner: $owner) {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($owner: String) {
    onUpdateUser(owner: $owner) {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($owner: String) {
    onDeleteUser(owner: $owner) {
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
