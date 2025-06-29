const formate = (email, otp) => {
  return {
    from: '"EchoDraft Support" <bibekjana68@gmail.com>',
    to: email,
    subject: "EchoDraft - Your One-Time Password (OTP)",
    text: `Hello,

Thank you for signing up with EchoDraft.

Your One-Time Password (OTP) is: ${otp}

This OTP is valid for 10 minutes. Please do not share it with anyone.

If you did not request this, please ignore this email or contact support.

Regards,
The EchoDraft Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color: #3f51b5;">Welcome to EchoDraft</h2>
        <p>Hi there,</p>
        <p>Thank you for signing up with <strong>EchoDraft</strong>.</p>
        <p>Your One-Time Password (OTP) is:</p>
        <h1 style="background: #f0f0f0; padding: 10px 20px; display: inline-block; border-radius: 8px;">${otp}</h1>
        <p>This OTP is valid for <strong>10 minutes</strong>.</p>
        <p style="color: #777;">Please do not share this OTP with anyone. If you did not request this email, you can safely ignore it or contact our support team.</p>
        <br/>
        <p>Warm regards,</p>
        <p><strong>EchoDraft Team</strong></p>
      </div>
    `,
  };
};

module.exports = formate;
