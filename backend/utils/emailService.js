const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send invoice email
const sendInvoiceEmail = async (to, invoiceNumber, pdfPath) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: `Invoice ${invoiceNumber} from VendorBridge`,
      text: `Dear Vendor,\n\nPlease find attached the invoice ${invoiceNumber} for your reference.\n\nPayment is due by the specified date.\n\nIf you have any questions, please contact us.\n\nBest regards,\nVendorBridge Team`,
      attachments: [
        {
          filename: `invoice-${invoiceNumber}.pdf`,
          path: pdfPath,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, message: 'Failed to send email', error: error.message };
  }
};

// Send RFQ notification
const sendRFQNotification = async (to, rfqTitle, deadline) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: `New RFQ: ${rfqTitle}`,
      text: `Dear Vendor,\n\nYou have been invited to submit a quotation for: ${rfqTitle}\n\nDeadline: ${new Date(deadline).toLocaleDateString()}\n\nPlease log in to your portal to submit your quotation.\n\nBest regards,\nVendorBridge Team`,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, message: 'Failed to send email', error: error.message };
  }
};

module.exports = { sendInvoiceEmail, sendRFQNotification };
