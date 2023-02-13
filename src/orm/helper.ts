import { MongoMemoryServer } from 'mongodb-memory-server';

import { UtilsProvider } from '../providers/utils.provider';

let mongod: MongoMemoryServer;

export const getMemoryServerMongoUri = async () => {
  mongod = await MongoMemoryServer.create({
    instance: { dbName: new UtilsProvider().randomize() },
  });
  return mongod.getUri();
};
