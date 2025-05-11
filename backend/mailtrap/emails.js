// Import the HTML email template and Mailtrap configuration
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
import { client, sender } from "./mailtrap.config.js";

//------------------------------------- SEND VERIFICATION EMAIL ------------------------------
export const sendVerificationEmail = async (email, verificationToken) => {
  // Prepare the recipient in the format required by Mailtrap
  const recipient = [{ email }];

  try {
    // Send the verification email using Mailtrap
    const response = await client.send({
      from: sender, // Sender info (configured in mailtrap.config.js)
      to: recipient, // Array of recipient objects
      subject: "Verify your email", // Email subject
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}", // Replace placeholder with actual token
        verificationToken
      ),
      category: "Email Verification", // Optional metadata
    });

    // console.log("Email sent successfully.", response);
  } catch (error) {
    console.log("Email verification error:", error.message);
  }
};

//------------------------------------- SEND WELCOME EMAIL --------------------------------------
export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }]; // Prepare recipient format

  try {
    // Send a template-based welcome email using Mailtrap
    const response = await client.send({
      from: sender,
      to: recipient,
      template_uuid: "a991403a-569a-4a55-868e-a050c2ea9c08", // Mailtrap template UUID
      template_variables: {
        company_info_name: "My Company", // Replace variables in template
        name: name, // Personalize with user's name
      },
    });

    // console.log("Welcome email sent successfully.", response);
  } catch (error) {
    console.log("Welcome email error:", error.message);
  }
};

//------------------------------------- SEND PASSWORD RESET EMAIL --------------------------------------
export const sendPasswordResetEmail = async (email, resetUrl) => {
  const recipient = [{ email }];
  try {
    const response = await client.send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetUrl),
      category: "Password Reset",
    });
    console.log("Reset url sent successfully.", response);
  } catch (error) {
    console.log("Password Reset Error :", error.message);
  }
};

//------------------------------------- SEND PASSWORD RESET SUCCESS EMAIL --------------------------------------
export const sendPasswordResetSuccessEmail = async (email) => {
  const recipient = [{ email }];
  try {
    const response = await client.send({
      from: sender,
      to: recipient,
      subject: "Password reset success",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset Success",
    });
    console.log("Password reset successfully.", response);
  } catch (error) {
    console.log("Password Reset unsuccess Error :", error.message);
  }
};
