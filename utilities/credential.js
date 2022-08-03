import * as argon2 from "argon2";
import * as crypto from "crypto";

const hashingConfig = {
  // based on OWASP cheat sheet recommendations (as of March, 2022)
  parallelism: 1,
  memoryCost: 64000, // 64 mb
  timeCost: 3, // number of itetations
};

export async function hashPassword(password) {
  let salt = crypto.randomBytes(16);
  return await argon2.hash(password, {
    ...hashingConfig,
    salt,
  });
}

export async function verifyPasswordWithHash(password, hash) {
  return await argon2.verify(hash, password, hashingConfig);
}

// Describes how to use!
// hashPassword("somePassword").then(async (hash) => {
//     console.log("Hash + salt of the password:", hash)
//     console.log("Password verification success:", await verifyPasswordWithHash("somePassword", hash));
// });
