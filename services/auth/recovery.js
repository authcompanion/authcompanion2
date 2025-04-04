// @ts-nocheck

import { makeRefreshtoken } from "../../utils/jwt.js";
import config from "../../config.js";
import { SMTPClient } from "emailjs";
import { eq } from "drizzle-orm";

const emailTemplate = (recoveryUrl, token) => `<!doctype html>
<html>
  <!-- Simplified email template with minimal styling -->
  <body style="font-family: sans-serif; margin: 20px;">
    <p>Hi there,</p>
    <p>You recently requested a password reset. Use this link within 15 minutes:</p>
    <a href="${recoveryUrl}?token=${token}" 
       style="background: #3498db; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px;">
      Reset Password
    </a>
    <p>If you didn't request this, please ignore this email.</p>
    <footer style="margin-top: 40px; color: #999; font-size: 0.9em;">
      <p>Company Inc, 3 Abbey Road, Alexandria Virginia 22305</p>
      <p>Powered by <a href="https://docs.authcompanion.com/">AuthCompanion</a></p>
    </footer>
  </body>
</html>`;

export const recoveryHandler = async function (request, reply) {
  const { email } = request.body.data.attributes;

  const client = new SMTPClient({
    user: config.SMTPUSER,
    password: config.SMTPPASSWORD,
    host: config.SMTPHOSTNAME,
    port: config.SMTPPORT,
    ssl: true,
  });

  try {
    // Find user by email
    const [user] = await this.db
      .select({ uuid: this.users.uuid, email: this.users.email })
      .from(this.users)
      .where(eq(this.users.email, email));

    if (!user) {
      request.log.info("Recovery attempt for non-existent email");
      return reply.code(200).send({ data: { type: "users", detail: "Recovery email sent" } });
    }

    // Generate recovery token
    const { token } = await makeRefreshtoken(user, this.key, this, {
      recoveryToken: "true",
    });

    // Send recovery email
    await client.sendAsync({
      from: config.FROMADDRESS,
      to: user.email,
      subject: "Account Recovery",
      attachment: [
        {
          data: emailTemplate(config.RECOVERYURL, token),
          alternative: true,
        },
      ],
    });
  } catch (error) {
    request.log.error(`Recovery error: ${error.message}`);
  } finally {
    // client.quit();
  }

  return reply.code(200).send({
    data: {
      type: "users",
      detail: "Recovery email sent",
    },
  });
};
