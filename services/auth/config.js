const defaultAuthMethods = ["password", "passkey"];

const availableAuthMethods = [...defaultAuthMethods];
const authOptions = {};

export function registerAuthMethod(methodName, methodConfig) {
  availableAuthMethods.push(methodName);
  authOptions[methodName] = methodConfig;
}

export function resetAuthMethods() {
  availableAuthMethods = defaultAuthMethods;
  authOptions = {};
}

export const configHandler = async function (request, reply) {
  return {
    auth_methods: availableAuthMethods,
    auth_options: authOptions,
  };
};
