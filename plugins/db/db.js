import { readFileSync, existsSync, readdirSync } from 'fs';
import { extname } from 'path';
import Database from 'better-sqlite3';
import config from '../../config.js';
import fastifyPlugin from 'fastify-plugin';

const VERSION = 2;

const migrate = (db, version) => {
  const allFiles = readdirSync('./plugins/db/schema/');
  const sqlFiles = allFiles.filter((file) => extname(file) === '.sql');
  sqlFiles.sort();
  if (version === null || version === undefined) {
    version = 1;
  }

  for (const sqlFile of sqlFiles) {
    if (!sqlFile.includes(`${version}`)) {
      continue;
    }
    console.log(`Migrating to ${sqlFile}`);
    const migration = readFileSync(`./plugins/db/schema/${sqlFile}`, 'utf8');
    db.exec(migration);
    version++;
  }
};

const dbPlugin = async function (fastify) {
  let db = {};
  try {
    //create test database to support CI
    if (process.env.NODE_ENV === 'test') {
      config.DBPATH = './test.db';
      console.log('Test database - ENABLED');
    }

    //make sure the database is available, if not, create one
    if (!existsSync(config.DBPATH)) {
      //create database if it does not exist and migrate
      db = new Database(config.DBPATH);
      db.pragma('journal_mode = WAL');
      migrate(db, 1);
      fastify.log.info(`Generated Sqlite3 Database: ${config.DBPATH}...`);
    } else {
      db = new Database(config.DBPATH);
      db.pragma('journal_mode = WAL');

      //if the database is available, make sure it has the right schema
      const stmt = db.prepare('SELECT version from authc_version');
      const { version } = stmt.get();

      if (!version || version > VERSION) {
        throw new Error('Database is an unexpected version, please try again');
      } else if (version < VERSION) {
        migrate(db, VERSION);
      }
    }
    fastify.log.info(`Using Sqlite3 Database: ${config.DBPATH}`);
  } catch (error) {
    console.log(error);
    throw new Error('There was an error setting and connecting up the Database, please try again!');
  }
  //make available the database across the server by calling "db"
  fastify.decorate('db', db);
};
//wrap the function with the fastly plugin to expose outside of the registered scope
export default fastifyPlugin(dbPlugin, { fastify: '4.x' });
