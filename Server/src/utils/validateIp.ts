import { clientIpValidator } from "req-ip-scope";

export const validateIp = (ip: string) => {
  return clientIpValidator(ip) && ip !== "::1" && ip !== "::ffff:127.0.0.1";
};
