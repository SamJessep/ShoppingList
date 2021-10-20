export const UserSchema = {
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

export const GroupSchema = {
  name: 'Group',
  properties: {
    _id: 'objectId?',
    createdAt: 'date?',
    key: 'string?',
    members: 'string[]',
    name: 'string?',
  },
  primaryKey: '_id',
};

export const ItemSchema = {
  name: 'Item',
  properties: {
    _id: 'objectId',
    checked: 'bool',
    createdAt: 'date',
    key: 'string',
    listID: 'objectId',
    name: 'string',
    partition:'string'
  },
  primaryKey: '_id',
};

export const ListSchema = {
  name: 'List',
  properties: {
    _id: 'objectId?',
    createdAt: 'date?',
    groupID: 'objectId?',
    key: 'string',
    name: 'string?',
  },
  primaryKey: '_id',
};
