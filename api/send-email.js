// Vercel Serverless Function for email sending
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, people, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !people || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['name', 'email', 'phone', 'people', 'message']
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if environment variables are set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Missing email configuration');
      return res.status(500).json({ 
        error: 'Email service not configured',
        message: 'Please contact the administrator'
      });
    }

    // Email configuration
    const nodemailer = require('nodemailer');
    
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'info@come2huelva.com',
      replyTo: email, // Allow direct reply to customer
      subject: `Nuevo mensaje de ${name} - Come2Huelva`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #12271e; border-bottom: 2px solid #af8d54; padding-bottom: 10px;">
            Nuevo mensaje de contacto - Come2Huelva
          </h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #12271e; margin-top: 0;">Información del cliente:</h3>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Teléfono:</strong> ${phone}</p>
            <p><strong>Número de personas:</strong> ${people}</p>
          </div>
          
          <div style="background: #fff; padding: 20px; border-left: 4px solid #af8d54;">
            <h3 style="color: #12271e; margin-top: 0;">Mensaje:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
            <p>Este mensaje fue enviado desde el formulario de contacto de come2huelva.com</p>
            <p>Fecha: ${new Date().toLocaleString('es-ES')}</p>
          </div>
        </div>
      `,
      text: `
Nuevo mensaje de contacto - Come2Huelva

Información del cliente:
- Nombre: ${name}
- Email: ${email}
- Teléfono: ${phone}
- Número de personas: ${people}

Mensaje:
${message}

---
Este mensaje fue enviado desde el formulario de contacto de come2huelva.com
Fecha: ${new Date().toLocaleString('es-ES')}
      `
    };

    await transporter.sendMail(mailOptions);
    
    console.log(`Email sent successfully from ${name} (${email})`);
    
    res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully' 
    });
  } catch (error) {
    console.error('Error sending email:', error);
    
    // More specific error handling
    if (error.code === 'EAUTH') {
      return res.status(500).json({ 
        error: 'Email authentication failed',
        message: 'Please check email credentials'
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to send email',
      message: 'Please try again later'
    });
  }
}
