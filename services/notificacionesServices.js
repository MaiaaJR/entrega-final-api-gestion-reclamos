import fs from 'fs'; 
import path from 'path'; 
import handlebars from 'handlebars'; 
import nodemailer from 'nodemailer'; 
import { fileURLToPath } from 'url'; 

export default class NotificacionesService { 
    constructor() { 
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.CORREO,
                pass: process.env.CLAVE
            }
        }); 
    }

    enviarCorreo = async (datosCorreo) => { 
        const __filename = fileURLToPath(import.meta.url); 
        const __dirname = path.dirname(__filename); 
        const plantillaPath = path.join(__dirname, '../utiles/plantilla.hbs'); 
        const plantilla = fs.readFileSync(plantillaPath, 'utf-8'); 

        const template = handlebars.compile(plantilla);
        const datos = { 
            reclamo: datosCorreo.reclamo, 
            estado: datosCorreo.estado 
        };
        const correoHtml = template(datos); 

        const mailOptions = { 
            to: datosCorreo.correoElectronico, 
            subject: "NOTIFICACION PROG3", 
            html: correoHtml 
        };

        try { 
            const info = await this.transporter.sendMail(mailOptions); 
            return { estado: true, mensaje: 'Correo electrónico enviado.' }; 
        } catch (error) {
            return { estado: false, mensaje: 'Correo electrónico no enviado.' };
        } 
    }
}