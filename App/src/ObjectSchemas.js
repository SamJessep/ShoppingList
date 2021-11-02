export const User = {
  name: 'User',
  properties: {
    _id: 'objectId?',
    authId: 'string?',
    createdAt: 'date?',
    email: 'string?',
    name: 'string?',
  },
  primaryKey: '_id',
};

export const Group = {
  name: 'Group',
  properties: {
    _id: 'objectId?',
    createdAt: 'date?',
    members: 'string[]',
    name: 'string?',
    partition:'string',
  },
  primaryKey: '_id',
};

export const Item = {
  name: 'Item',
  properties: {
    _id: 'objectId',
    checked: 'bool',
    createdAt: 'date',
    key: 'string',
    listID: 'objectId',
    name: 'string',
    partition:'string',
  },
  primaryKey: '_id',
};

export const List = {
  name: 'List',
  properties: {
    _id: 'objectId?',
    partition:  'string', 
    createdAt: 'date?',
    groupID: 'objectId?',
    key: 'string',
    name: 'string?',
  },
  primaryKey: '_id',
};


export const Schema = {
  List,
  Group,
  Item,
  User
}

export const MakeSafe = collection=>collection.map(i=>Object.assign(i,{}))