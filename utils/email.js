// Email utility for sending emails
// This is a mock implementation - replace with actual email service in production

const sendResetPasswordEmail = async (email, resetToken) => {
  try {
    // In a real implementation, you would use a service like:
    // - SendGrid
    // - AWS SES
    // - Nodemailer with SMTP
    // - Mailgun
    
    console.log(`
=== PASSWORD RESET EMAIL ===
To: ${email}
Subject: Password Reset Request - Tahya Misr Students Union

Dear User,

You have requested to reset your password for your Tahya Misr Students Union account.

Please use the following token to reset your password:
${resetToken}

This token will expire in 10 minutes.

If you did not request this password reset, please ignore this email.

Best regards,
Tahya Misr Students Union Team
============================
    `);
    
    return { success: true };
  } catch (error) {
    console.error('Error sending reset password email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendResetPasswordEmail
};