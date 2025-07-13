// middleware/GoogleAuthMiddleware.js
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
dotenv.config();

const client = new OAuth2Client(process.env.CLIENT_ID_GOOGLE);

export const verifyGoogleToken = async (req, res, next) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ message: "Missing Google credential token" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.CLIENT_ID_GOOGLE,
    });

    const payload = ticket.getPayload();
    req.googleUser = {
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
    };

    next();
  } catch (error) {
    res
      .status(401)
      .json({ message: "Invalid Google token", error: error.message });
  }
};
