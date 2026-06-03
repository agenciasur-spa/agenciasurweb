import type { APIRoute } from 'astro';
import { Resend } from 'resend';

const resendApiKey = import.meta.env.RESEND_API_KEY;
const turnstileSecretKey = import.meta.env.TURNSTILE_SECRET_KEY;

export const prerender = false;

async function verifyTurnstileToken(token: string, ip: string | null): Promise<boolean> {
  if (!turnstileSecretKey) {
    console.warn('TURNSTILE_SECRET_KEY not configured — skipping verification.');
    return true; // Skip verification if not configured (dev mode)
  }

  if (!token) return false;

  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: turnstileSecretKey,
          response: token,
          ...(ip ? { remoteip: ip } : {}),
        }),
      }
    );

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    const body = await request.formData();

    const nombre = body.get('nombre') as string;
    const email = body.get('email') as string;
    const sector = body.get('sector') as string;
    const necesidad = body.get('necesidad') as string;
    const objetivo = body.get('objetivo') as string;
    const plazo = body.get('plazo') as string;
    const extra = body.get('extra') as string;
    const turnstileToken = body.get('cf-turnstile-response') as string;

    // Validación server-side
    if (!nombre || !email || !sector || !necesidad || !objetivo || !plazo) {
      return new Response(
        JSON.stringify({ error: 'Todos los campos son obligatorios excepto notas adicionales.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Email inválido.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify Turnstile token
    const isValidToken = await verifyTurnstileToken(turnstileToken, clientAddress ?? null);
    if (!isValidToken) {
      return new Response(
        JSON.stringify({ error: 'Verificación anti-spam fallida. Intenta nuevamente.' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!resendApiKey) {
      console.warn('RESEND_API_KEY not configured — email not sent.');
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Mensaje recibido. (Email no enviado — falta configurar RESEND_API_KEY)',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const resend = new Resend(resendApiKey);

    const msgCompleto = `Hola, me llamo ${nombre} y mi correo es ${email}. Trabajo en una empresa del sector ${sector}. Actualmente necesitamos ${necesidad} y queremos lograr ${objetivo}. Nos gustaría empezar ${plazo}.${extra ? ` ${extra}` : ''}`;

    // Email para Agencia Sur (principal)
    await resend.emails.send({
      from: 'Contacto Web <noreply@agenciasur.cl>',
      to: ['contacto@agenciasur.cl'],
      replyTo: email,
      subject: `Nuevo contacto: ${nombre} - ${sector}`,
      html: `
        <h2>Nuevo mensaje desde el sitio web</h2>
        <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
          <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Nombre:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${nombre}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Email:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${email}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Sector:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${sector}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Necesidad:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${necesidad}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Objetivo:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${objetivo}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Plazo:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${plazo}</td></tr>
          ${extra ? `<tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Notas adicionales:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${extra}</td></tr>` : ''}
        </table>
        <h3>Mensaje completo:</h3>
        <p style="line-height: 1.6; white-space: pre-wrap;">${msgCompleto}</p>
      `,
    });

    // Email de confirmación para el usuario (copia)
    await resend.emails.send({
      from: 'Agencia Sur <hola@agenciasur.cl>',
      to: [email],
      subject: `Gracias por contactarnos, ${nombre} ✨`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 16px; color: white; text-align: center;">
            <div style="width: 80px; height: 80px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
            </div>
            <h2 style="margin: 0 0 10px; font-size: 28px;">¡Gracias, ${nombre}!</h2>
            <p style="margin: 0; opacity: 0.9; font-size: 16px;">Hemos recibido tu mensaje correctamente.</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa; border-radius: 12px; margin-top: 20px;">
            <h3 style="margin-top: 0; color: #333; font-size: 18px;">Resumen de tu solicitud</h3>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #667eea;">
              <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${msgCompleto}</p>
            </div>
            
            <div style="margin-top: 25px;">
              <h4 style="margin: 0 0 15px; color: #555; font-size: 16px;">¿Qué pasa ahora?</h4>
              <ul style="margin: 0; padding-left: 20px; color: #666; line-height: 1.8;">
                <li>Te contactaremos en las próximas 24 horas hábiles</li>
                <li>Analizaremos tu necesidad y te daremos una respuesta personalizada</li>
                <li>Si es urgente, puedes escribirnos directamente a contacto@agenciasur.cl</li>
              </ul>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background: #e3f2fd; border-radius: 8px; border: 1px solid #2196f3;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
                <span style="font-weight: 600; color: #1976d2;">Agencia Sur</span>
              </div>
              <p style="margin: 0; color: #1976d2; font-size: 14px;">
                Transformación digital para empresas • contacto@agenciasur.cl
              </p>
            </div>
          </div>
        </div>
      `,
    });

    return new Response(
      JSON.stringify({ success: true, message: 'Mensaje enviado correctamente.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno. Intenta nuevamente.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
