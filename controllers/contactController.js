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

export const contactSalesController = async (req, res) => {
  try {
    const { name, email, organization, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).send({
        success: false,
        message: "Name, email, and message are required",
      });
    }

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
      from: `"Sales Inquiry - PatientInfo" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Sales Lead - ${organization || "Unknown Organization"}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 10px;">
          <h2>New Sales Inquiry Received</h2>

          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Organization:</b> ${organization || "Not provided"}</p>

          <hr/>

          <h3>Message</h3>
          <p>${message}</p>

          <hr/>

          <p style="color: gray; font-size: 12px;">
            This lead was generated from PatientInfo by Dr Contact Sales form
          </p>
        </div>
      `,
    });

    return res.status(200).send({
      success: true,
      message: "Sales request sent successfully",
    });

  } catch (error) {
    console.error("Sales Contact Error:", error);

    return res.status(500).send({
      success: false,
      message: "Failed to send sales request",
    });
  }
};