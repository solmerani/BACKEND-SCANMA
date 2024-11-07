import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
//configuracion de nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
      user: "Elopez@satrendy.com.ar",
      pass:process.env.APP_PASSWORD
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  });


  const EnviarMail = async (destinatario, token) => {
    const linkRecuperacion = `http://tu-dominio.com/restablecer-password?token=${token}`;


    const mailOptions = {
        from: '"Scanma!" <Elopez@satrendy.com.ar>',
        to: destinatario,
        subject: "Recuperación de Contraseña",
        html: `<p>Haga clic en el siguiente enlace para restablecer su contraseña:</p><a href="${linkRecuperacion}">Restablecer Contraseña</a>`,
      };
      try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Mensaje enviado: %s", info.messageId);
      } catch (error) {
        console.error("Error al enviar el correo:", error);
      }
     
  };


  export default EnviarMail;

