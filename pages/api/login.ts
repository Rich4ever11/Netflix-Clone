import { magicAdmin } from "../../lib/magic";
import { isNewUser, createNewUser } from "../../lib/db/hasura";
import { setTokenCookie } from "../../lib/cookies";
import jwt from "jsonwebtoken";

export default async function login(req: any, res: any) {
  if (req.method === "POST") {
    try {
      const auth = req.headers.authorization;
      const didToken = auth ? auth.substr(7) : "";
      const jwtSecret = process.env.JWT_SECRET || "";

      //Getting the users information from magic
      const metadata = await magicAdmin.users.getMetadataByToken(didToken);
      const { issuer, publicAddress, email } = metadata;

      //create jwt
      const token = jwt.sign(
        {
          issuer,
          publicAddress,
          email,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
          "https://hasura.io/jwt/claims": {
            "x-hasura-allowed-roles": ["user", "admin"],
            "x-hasura-default-role": "user",
            "x-hasura-user-id": `${metadata.issuer}`,
          },
        },
        jwtSecret
      );

      //Check for new user
      const isNewUserQuery = await isNewUser(token, metadata.issuer);
      isNewUserQuery && (await createNewUser(token, metadata));
      setTokenCookie(token, res);
      res.send({ done: true, isNewUserQuery });
    } catch (error) {
      console.error("Something went wrong logging in!", error);
      res.status(500).send({ done: false });
    }
  } else {
    res.send({ done: false });
  }
}
