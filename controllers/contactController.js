import nodemailer from "nodemailer";

export const contactController = async (req, res) => {
  try {
    const { subject, name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Contact Form" <${email}>`,
      to: `<${process.env.EMAIL_USER}>`,
      subject: subject || "New Contact Message from Auth System",
      html: `
        <h3>New Message Received</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });

    return res.status(200).send({
      success: true,
      message: "Message sent successfully",
    });

  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};