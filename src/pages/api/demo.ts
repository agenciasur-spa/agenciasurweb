import type { APIRoute } from 'astro';
import { Resend } from 'resend';

const resendApiKey = import.meta.env.RESEND_API_KEY;

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.formData();

    const nombre = body.get('nombre') as string;
    const email = body.get('email') as string;
    const empresa = body.get('empresa') as string;
    const solucion = body.get('solucion') as string;
    const mensaje = body.get('mensaje') as string;

    if (!nombre || !email || !solucion) {
      return new Response(
        JSON.stringify({ error: 'Nombre, email y solución son obligatorios.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Email inválido.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!resendApiKey) {
      console.warn('RESEND_API_KEY not configured — email not sent.');
      return new Response(
        JSON.stringify({ success: true, message: 'Solicitud recibida. (Email no enviado — falta RESEND_API_KEY)' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const resend = new Resend(resendApiKey);

    await resend.emails.send({
      from: 'Demo Web <noreply@agenciasur.cl>',
      to: ['contacto@agenciasur.cl'],
      replyTo: email,
      subject: `Solicitud de Demo: ${solucion} — ${nombre}`,
      html: `
        <h2>Nueva solicitud de demo</h2>
        <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
          <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Nombre:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${nombre}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Email:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${email}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Empresa:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${empresa || '—'}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Solución:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${solucion}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Mensaje:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${mensaje || '—'}</td></tr>
        </table>
      `,
    });

    await resend.emails.send({
      from: 'Agencia Sur <hola@agenciasur.cl>',
      to: [email],
      subject: `Tu demo de ${solucion} está en camino ✨`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 16px; color: white; text-align: center;">
            <h2 style="margin: 0 0 10px; font-size: 28px;">¡Gracias, ${nombre}!</h2>
            <p style="margin: 0; opacity: 0.9; font-size: 16px;">Recibimos tu solicitud de demo para <strong>${solucion}</strong>.</p>
          </div>
          <div style="padding: 30px; background: #f8f9fa; border-radius: 12px; margin-top: 20px;">
            <h3 style="margin-top: 0; color: #333;">¿Qué sigue?</h3>
            <ul style="margin: 0; padding-left: 20px; color: #666; line-height: 1.8;">
              <li>Te contactaremos en las próximas 24 horas hábiles</li>
              <li>Agendaremos una demo personalizada para tu equipo</li>
              <li>Si es urgente, escribinos a contacto@agenciasur.cl</li>
            </ul>
          </div>
        </div>
      `,
    });

    return new Response(
      JSON.stringify({ success: true, message: 'Solicitud enviada correctamente.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Demo form error:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno. Intenta nuevamente.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
