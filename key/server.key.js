import config from "../config.js";
import { readFileSync, writeFileSync, existsSync } from "fs";
import fastifyPlugin from "fastify-plugin";
import { webcrypto } from "crypto";

const { subtle } = webcrypto;

export async function importKey() {
  try {
    const rawKey = readFileSync(config.KEYPATH);
    const importkey = JSON.parse(rawKey);

    const key = await subtle.importKey(
      "jwk",
      importkey,
      {
        name: "HMAC",
        hash: "SHA-256",
      },
      true,
      ["sign", "verify"]
    );
    return key;
  } catch (error) {
    console.log(`Failed to import Server Key, please check format`);
    throw error;
  }
}

async function generateAndExportKey() {
  try {
    const key = await subtle.generateKey(
      {
        name: "HMAC",
        hash: "SHA-256",
        length: 512,
      },
      true,
      ["sign", "verify"]
    );

    const rawKey = await subtle.exportKey("jwk", key);
    let data = JSON.stringify(rawKey);

    writeFileSync(config.KEYPATH, data);
  } catch (error) {
    console.log(`Failed to Generate and Export Key, please try again.`);
    throw error;
  }
}

const setupServerKey = async function (fastify, options) {
  try {
    //create a test serverkey to support CI
    if (process.env.NODE_ENV === "test") {
      config.KEYPATH = "./serverkey_test";
    }

    if (!existsSync(config.KEYPATH)) {
      //Create a JWK if one does not exist
      await generateAndExportKey();

      fastify.log.info(`Generating Server Key: ${config.KEYPATH}...`);
    }
    const key = await importKey();

    //make available the database across the server by calling "key"
    fastify.decorate("key", key);

    fastify.log.info(`Using Server Key: ${config.KEYPATH}`);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to setup the required Server Key, please try again.");
  }
};

//Wrap as Fastify Plugin
export default fastifyPlugin(setupServerKey, { fastify: "4.x" });
