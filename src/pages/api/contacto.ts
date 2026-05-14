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
    const empresa = body.get('empresa') as string;
    const telefono = body.get('telefono') as string;
    const tipoProyecto = body.get('tipo_proyecto') as string;
    const mensaje = body.get('mensaje') as string;
    const turnstileToken = body.get('cf-turnstile-response') as string;

    // Validación server-side
    if (!nombre || !email || !mensaje) {
      return new Response(
        JSON.stringify({ error: 'Nombre, email y mensaje son obligatorios.' }),
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

    const tipoProyectoLabel: Record<string, string> = {
      'levantamiento': 'Levantamiento de procesos',
      'desarrollo': 'Desarrollo web/mobile',
      'sistema': 'Implementación de sistema propio',
      'integracion': 'Integración de sistemas',
      'otro': 'Otro',
    };

    await resend.emails.send({
      from: 'Contacto Web <noreply@agenciasur.cl>',
      to: ['contacto@agenciasur.cl'],
      replyTo: email,
      subject: `Nuevo contacto: ${nombre}${empresa ? ` (${empresa})` : ''}`,
      html: `
        <h2>Nuevo mensaje desde el sitio web</h2>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding: 8px; font-weight: bold;">Nombre:</td><td style="padding: 8px;">${nombre}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${email}</td></tr>
          ${empresa ? `<tr><td style="padding: 8px; font-weight: bold;">Empresa:</td><td style="padding: 8px;">${empresa}</td></tr>` : ''}
          ${telefono ? `<tr><td style="padding: 8px; font-weight: bold;">Teléfono:</td><td style="padding: 8px;">${telefono}</td></tr>` : ''}
          ${tipoProyecto ? `<tr><td style="padding: 8px; font-weight: bold;">Tipo:</td><td style="padding: 8px;">${tipoProyectoLabel[tipoProyecto] || tipoProyecto}</td></tr>` : ''}
        </table>
        <h3>Mensaje:</h3>
        <p>${mensaje.replace(/\n/g, '<br>')}</p>
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
