import { secureCookie } from "./credential.js";
import config from "../config.js";

export function refreshCookie(token) {
  const expireDate = new Date();
  expireDate.setTime(expireDate.getTime() + 7 * 24 * 60 * 60 * 1000); // TODO: Make configurable now, set to 7 days
  return `userRefreshToken=${token}; Path=/; Expires=${expireDate}; SameSite=${
    config.SAMESITE
  }; HttpOnly; ${secureCookie()}`;
}
