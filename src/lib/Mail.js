import nodemailer from "nodemailer";
import mailerConfig from "../config/mail";
import { resolve } from "path";
import exphbs from "express-handlebars";
import nodemailerhbs from "nodemailer-express-handlebars";

class Mail {
  constructor() {
    const { host, port, secure, auth } = mailerConfig;
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null
    });
  }

  configureTemplates() {
    const viewPath = resolve(__dirname, "..", "app", "views", "emails");
    this.transporter.use(
      "compile",
      nodemailerhbs({
        viewEgine: exphbs.create({
          layoutsDir: resolve(viewPath, "layouts"),
          partialsDir: resolve(viewPath, "partials"),
          defaultLayout: "default",
          extname: ".hbs"
        }),
        viewPath,
        extName: ".hbs"
      })
    );
  }

  sendMail(message) {
    return this.transporter.sendMail({
      ...mailerConfig,
      ...message
    });
  }
}

export default new Mail();
