import Appointment from "../models/Appointment";
import User from "../models/User";
import File from "../models/File";
import * as Yup from "yup";
import { startOfHour, parseISO, isBefore, format, subHours } from "date-fns";
import Notification from "../schemas/notification";
import pt from "date-fns/locale/pt-BR";
import Mail from "../../lib/Mail";

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const appointment = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ["date"],
      limit: 20,
      attributes: ["id", "date"],
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: "provider",
          attributes: ["id", "name"],
          include: [
            {
              model: File,
              as: "avatar",
              attributes: ["id", "path", "url"]
            }
          ]
        }
      ]
    });
    return res.json(appointment);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date.required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    if (provider_id === req.userId) {
      return res
        .status(401)
        .json({ error: "You can not create appointment with yourself" });
    }

    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true }
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: "You can only create appointment with providers" });
    }

    const hourStart = startOfHour(parseISO(date));
    if (isBefore(hourStart, new DATE())) {
      return res.status(400).json({ error: "Past dates are not permited" });
    }

    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart
      }
    });

    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: "Appointment date is no available" });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date
    });
    const user = User.findByPk(req.userId);
    const formattedDate = format(hourStart, "'dia' dd 'de' MMMM', ás' H:mm'h", {
      locale: pt
    });
    await Notification.create({
      content: `Novo agendamento de ${user.name} para o ${formattedDate}`,
      user: provider_id
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "provider",
          attributes: ["name", "email"]
        },
        {
          model: User,
          as: "user",
          attributes: ["name"]
        }
      ]
    });

    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: "You don't have parmission to cancel this appoitment."
      });
    }

    const dateWithSub = subHours(appointment.date, 2);
    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: "You can only cancel appoitments 2 hours in advance."
      });
    }

    appointment.canceled_at = new Date();
    await appointment.save();
    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: "Agendamento Cancelado",
      template: "cancellation",
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(appointment.date, "'dia' dd 'de' MMMM', ás' H:mm'h", {
          locale: pt
        })
      }
    });
    return res.json(appointment);
  }
}
export default new AppointmentController();
