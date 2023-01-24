import { verifyToken } from "../lib/utils";

export default async function useRedirectUser(context) {
  const cookiesToken = context?.req ? context?.req?.cookies?.token : null;
  const userId = await verifyToken(cookiesToken);
  return { userId, cookiesToken };
}
