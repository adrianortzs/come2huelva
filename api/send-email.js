// { 'IP': [timestamp1, timestamp2, ...], 'IP2': [...] }
const requestLog = {};

// Escapa caracteres peligrosos
function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

// Máximo 5 emails por IP por hora
function checkRateLimit(ip) {
  const now = Date.now();
  const oneHourAgo = now - (60 * 60 * 1000);
  
  // Si esta IP no existe, crear array vacío
  if (!requestLog[ip]) requestLog[ip] = [];
  
  // Limpia solicitudes antiguas (más de 1 hora)
  requestLog[ip] = requestLog[ip].filter(timestamp => timestamp > oneHourAgo);
  
  if (requestLog[ip].length >= 5) return false;
  
  // Registra nueva solicitud
  requestLog[ip].push(now);
  return true;
}

// Obtener IP del cliente
function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0] || req.headers['x-real-ip'] || req.socket.remoteAddress || 'unknown';
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Cambiar * por https://come2huelva.com
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Por seguridad
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  if (req.method !== 'POST')  return res.status(405).json({ error: 'Method not allowed' });

  try {
    const clientIp = getClientIp(req);
    if (!checkRateLimit(clientIp)) return res.status(429).json({ error: 'Too many requests', message: 'Máximo 5 mensajes por hora. Por favor intenta más tarde.', retryAfter: 3600 });

    let { name, email, phone, people, message } = req.body; // Sanitizar inputs
    name = sanitize(name);
    email = sanitize(email);
    phone = sanitize(phone);
    people = sanitize(people);
    message = sanitize(message);

    // Validaciones
    if (!name || !email || !phone || !people || !message) return res.status(400).json({ error: 'Missing required fields', required: ['name', 'email', 'phone', 'people', 'message'] });

    if (name.length > 100) return res.status(400).json({ error: 'Name too long (max 100 chars)' });
    if (phone.length > 20) return res.status(400).json({ error: 'Phone too long (max 20 chars)' });
    if (people.length > 10) return res.status(400).json({ error: 'People number too long' });
    if (message.length > 5000) return res.status(400).json({ error: 'Message too long (max 5000 chars)' });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ error: 'Invalid email format' });

    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(phone)) return res.status(400).json({ error: 'Invalid phone format' });

    if (isNaN(people) || people < 1 || people > 100) return res.status(400).json({ error: 'Invalid number of people' });

    if (!process.env.EMAIL || !process.env.PASSWORD) return res.status(500).json({ error: 'Email service not configured', message: 'Please contact the administrator' });

    // Configuración de Nodemailer
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    });

    // Configuración del email
    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      replyTo: email,
      subject: `Mensaje nuevo de ${name} - Come2Huelva`,
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
            <p>IP del cliente: ${clientIp}</p>
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

        - Mensaje: ${message}

        Detalles del mensaje:
        - Este mensaje fue enviado desde el formulario de contacto de come2huelva.com
        - Fecha: ${new Date().toLocaleString('es-ES')}
        - IP del cliente: ${clientIp}
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully' });

  } catch (error) {
    if (error.code === 'EAUTH') return res.status(500).json({ error: 'Email authentication failed', message: 'Please check email credentials' }); // Error específico de autenticación
    
    res.status(500).json({ error: 'Failed to send email', message: 'Please try again later' });
  }
}
