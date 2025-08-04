const getOTPEmailTemplate = (otpCode, userEmail) => {
  return {
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 0;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">
                    🔐 Email Verification
                  </h1>
                  <p style="color: #e8f0fe; margin: 10px 0 0 0; font-size: 16px;">
                    Complete your account registration
                  </p>
                </div>
                
                <!-- Main Content -->
                <div style="padding: 40px 30px;">
                  <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
                    Welcome to Client Pulse! 👋
                  </h2>
                  
                  <p style="color: #666666; margin: 0 0 25px 0; font-size: 16px; line-height: 1.5;">
                    Thank you for signing up! To complete your account registration and ensure the security of your account, please verify your email address using the OTP code below.
                  </p>
                  
                  <!-- OTP Box -->
                  <div style="background-color: #f8f9fa; border: 2px dashed #667eea; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
                    <p style="color: #333333; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
                      Your Verification Code
                    </p>
                    <div style="background-color: #667eea; color: #ffffff; font-size: 32px; font-weight: bold; padding: 15px 25px; border-radius: 8px; display: inline-block; letter-spacing: 4px; font-family: 'Courier New', monospace;">
                      ${otpCode}
                    </div>
                    <p style="color: #888888; margin: 15px 0 0 0; font-size: 14px;">
                      This code will expire in 10 minutes
                    </p>
                  </div>
                  
                  <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 25px 0;">
                    <p style="color: #856404; margin: 0; font-size: 14px; line-height: 1.4;">
                      ⚠️ <strong>Security Notice:</strong> Never share this code with anyone. Client Pulse team will never ask for your OTP code via phone or email.
                    </p>
                  </div>
                  
                  <p style="color: #666666; margin: 25px 0 0 0; font-size: 15px; line-height: 1.5;">
                    If you didn't request this verification code, please ignore this email or contact our support team if you have concerns about your account security.
                  </p>
                </div>
                
                <!-- Footer -->
                <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                  <p style="color: #888888; margin: 0 0 10px 0; font-size: 14px;">
                    Need help? Contact us at 
                    <a href="mailto:support@clientpulse.com" style="color: #667eea; text-decoration: none;">support@clientpulse.com</a>
                  </p>
                  <p style="color: #aaaaaa; margin: 0; font-size: 12px;">
                    © 2024 Client Pulse. All rights reserved.
                  </p>
                  <div style="margin-top: 20px;">
                    <a href="#" style="color: #667eea; text-decoration: none; margin: 0 10px; font-size: 12px;">Privacy Policy</a>
                    <a href="#" style="color: #667eea; text-decoration: none; margin: 0 10px; font-size: 12px;">Terms of Service</a>
                    <a href="#" style="color: #667eea; text-decoration: none; margin: 0 10px; font-size: 12px;">Unsubscribe</a>
                  </div>
                </div>
                
              </div>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    text: `
Welcome to Client Pulse!

Your email verification code is: ${otpCode}

Please enter this code to complete your account registration. This code will expire in 10 minutes.

For security reasons, never share this code with anyone.

If you didn't request this code, please ignore this email.

Need help? Contact us at support@clientpulse.com

© 2024 Client Pulse. All rights reserved.
    `
  };
};

// You can add more email templates here in the future
const getWelcomeEmailTemplate = (userName) => {
  return {
    html: `<!-- Welcome email template -->`,
    text: `Welcome to Client Pulse, ${userName}!`
  };
};

const getPasswordResetTemplate = (resetLink) => {
  return {
    html: `<!-- Password reset template -->`,
    text: `Reset your password: ${resetLink}`
  };
};

module.exports = {
  getOTPEmailTemplate,
  getWelcomeEmailTemplate,
  getPasswordResetTemplate
}; 