import { transporter } from "../config/nodemailer";

export async function sendPasswordResetEmail(to: string, resetURL: string) {
  const htmlContent = `
  <div style="font-family: Arial, sans-serif; background: #f5f6fa; padding: 30px;">
    <div style="max-width: 520px; margin: 0 auto; background: #ffffff; padding: 25px; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
      
      <h2 style="text-align: center; color: #2d3436;">🔐 Restablece tu contraseña</h2>

      <p style="font-size: 15px; color: #636e72;">
        Hemos recibido una solicitud para restablecer tu contraseña.  
        Haz clic en el siguiente botón para continuar:
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetURL}"
          style="
            background: #0984e3;
            color: white;
            padding: 12px 22px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            font-size: 16px;
            display: inline-block;
          ">
          Restablecer contraseña
        </a>
      </div>

      <p style="font-size: 14px; color: #636e72;">
        O si prefieres, copia y pega este enlace en tu navegador:
      </p>

      <p style="
        word-break: break-all;
        background: #dfe6e9;
        padding: 10px;
        border-radius: 6px;
        font-size: 13px;
      ">
        ${resetURL}
      </p>

      <p style="font-size: 14px; color: #b2bec3;">
        Si no solicitaste este cambio, simplemente ignora este mensaje.
      </p>

      <hr style="margin-top: 40px;">
      <p style="font-size: 12px; text-align: center; color: #b2bec3;">
        © ${new Date().getFullYear()} Tu App · Todos los derechos reservados
      </p>

    </div>
  </div>
  `;

  return await transporter.sendMail({
    from: '"Soporte App" <no-reply@tuapp.com>',
    to,
    subject: "Recuperación de contraseña",
    html: htmlContent,
  });
}

