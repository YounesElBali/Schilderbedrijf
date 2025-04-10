import nodemailer from 'nodemailer';

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: '89e6a9003@smtp-brevo.com',
    pass: 'jvHp8cAnxEm3JYwO',
  },
});

// Function to send order confirmation email
export async function sendOrderConfirmationEmail( orderData: any, createdOrder: any) {
  try {
    // Get the email from the orderData (assuming it's stored there)
    const email = orderData.email;

    // Email content
    const mailOptions = {
      from: 'info@pastoolz.nl', // Sender address
      to: email, // Recipient address (customer email)
      subject: `Bestelling order bevestiging`, // Subject line
      html: `
    <div style="font-family: Arial, sans-serif; padding: 16px;">
      <h2 style="color: #333;">Bedankt voor je bestelling!</h2>
      <p>
        We hebben je bestelling succesvol ontvangen. We gaan zo snel mogelijk aan de slag om je producten te verpakken en te verzenden.
      </p>
      <p>
        Heb je vragen? Neem gerust contact op met onze klantenservice via <a href="mailto:info@pastoolz.nl">info@pastoolz.nl</a>.
      </p>
      <p style="margin-top: 32px;">
        Met vriendelijke groet,<br/>
        <strong>Team Pastoolz</strong>
      </p>
    </div>
    `,
  };


    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, error };
  }
}

// Function to send track and trace email
export async function sendTrackAndTraceEmail(orderData: any, trackingInfo: any) {
  try {
    const email = orderData.email;
    const { trackingNumber, trackingLink } = trackingInfo;

    const mailOptions = {
      from: 'info@pastoolz.nl',
      to: email,
      subject: `Track & Trace informatie voor je bestelling`,
      html: `
      <div style="font-family: Arial, sans-serif; padding: 16px;">
        <h2 style="color: #333;">Je bestelling is verzonden!</h2>
        <p>
          Goed nieuws! Je bestelling is onderweg. Hieronder vind je de Track & Trace gegevens om je pakket te volgen.
        </p>
        <p>
          <strong>Trackingnummer:</strong> ${trackingNumber}<br/>
          <strong>Volg je pakket:</strong> <a href="${trackingLink}" target="_blank">${trackingLink}</a>
        </p>
        <p>
          Als je vragen hebt over je levering, neem gerust contact met ons op via <a href="mailto:info@pastoolz.nl">info@pastoolz.nl</a>.
        </p>
        <p style="margin-top: 32px;">
          Met vriendelijke groet,<br/>
          <strong>Team Pastoolz</strong>
        </p>
      </div>
    `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Track & Trace email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending Track & Trace email:', error);
    return { success: false, error };
  }
}
