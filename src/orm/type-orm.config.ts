import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
config();

import { RegistryProvider } from '../providers/registry.provider';

const registry = new RegistryProvider();

export function getDataSourceConfig(registry: RegistryProvider): Partial<DataSourceOptions> {
  const { DB_ENGINE, DB_URL } = registry.getConfig();

  return {
    type: DB_ENGINE,
    url: DB_URL,
  };
}

/**
 * For migration files generator
 */
export default new DataSource({
  ...getDataSourceConfig(registry),
  entities: ['./src/orm/model/*.model.ts'],
  migrations: ['./src/orm/migrations/*-Migration.ts'],
} as DataSourceOptions);
