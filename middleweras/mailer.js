import nodemailer from 'nodemailer';
 
//configuracion de nodemailer
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "scanma24@gmail.com",
      pass: "Proyecto2024",
    },
  });


  const EnviarMail = async (destinatario, token) => {
    const linkRecuperacion = `http://tu-dominio.com/restablecer-password?token=${token}`;


    const mailOptions = {
        from: '"Scanma!" <scanma24@gmail.com>',
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

