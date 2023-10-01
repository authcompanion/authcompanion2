import fastifyPlugin from 'fastify-plugin';
import config from '../../config.js';
import { writeFileSync } from 'fs';
import { createId } from '@paralleldrive/cuid2';
import { createHash } from '../../utils/credential.js';
import * as crypto from 'crypto';

//function to generate a random password using crypto module
const generatePassword = function () {
  return crypto.randomBytes(20).toString('hex');
};

const setupAdminKey = async function (fastify) {
  try {
    //create test database to support CI
    if (process.env.NODE_ENV === 'test') {
      config.ADMINKEYPATH = './adminkey_test';
    }

    //Check if the admin user already exists on server startup
    const stmt = fastify.db.prepare('SELECT uuid, name, email, active, created_at, updated_at FROM admin LIMIT 1;');
    const adminUser = await stmt.get();

    if (adminUser) {
      //register the admin user on the fastify instance
      fastify.decorate('registeredAdminUser', adminUser);
      fastify.log.info(`Using Admin API Key: ${config.ADMINKEYPATH}`);
      return;
    }

    //Create the default admin user in the Database, set the password to a random UUID as a placeholder
    const uuid = createId();
    const adminPwd = generatePassword();
    const hashPwd = await createHash(adminPwd);

    //Create a default admin account
    const userObj = {
      uuid: uuid,
      name: 'Admin',
      email: 'admin@localhost',
    };

    const registerStmt = fastify.db.prepare(
      "INSERT INTO admin (uuid, name, email, password, active, jwt_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, strftime('%Y-%m-%dT%H:%M:%fZ','now'), strftime('%Y-%m-%dT%H:%M:%fZ','now')) RETURNING uuid, name, email, active, created_at, updated_at;"
    );
    const user = registerStmt.get(uuid, userObj.name, userObj.email, hashPwd, 1, '');

    //export admin password to a file. Admin password is only exported once on server startup and can be traded for an access token
    writeFileSync(config.ADMINKEYPATH, `admin password: ${adminPwd}`);
    fastify.log.info(`Generating Admin API Key: ${config.ADMINKEYPATH}...`);
    fastify.log.info(`Admin Password is: ${adminPwd}`);

    //register the admin user on the fastify instance
    fastify.decorate('registeredAdminUser', user);

    fastify.log.info(`Using Admin API Key: ${config.ADMINKEYPATH}`);
  } catch (error) {
    console.log(error);
    throw new Error('Failed to export the admin key');
  }
};

//Wrap as Fastify Plugin
export default fastifyPlugin(setupAdminKey, { fastify: '4.x' });
