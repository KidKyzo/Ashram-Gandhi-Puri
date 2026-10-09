import * as migration_20261009_062005_baseline from './20261009_062005_baseline';
import * as migration_20261009_062545_bilingual_content from './20261009_062545_bilingual_content';

export const migrations = [
  {
    up: migration_20261009_062005_baseline.up,
    down: migration_20261009_062005_baseline.down,
    name: '20261009_062005_baseline',
  },
  {
    up: migration_20261009_062545_bilingual_content.up,
    down: migration_20261009_062545_bilingual_content.down,
    name: '20261009_062545_bilingual_content'
  },
];
