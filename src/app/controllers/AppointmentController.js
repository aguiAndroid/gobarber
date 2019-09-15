import Appointment from "../models/Appointments";
import User from "../models/User";
import * as Yup from "yup";
import { startOfHour, parseISO, isBefore } from "date-fns";
import { DATE } from "sequelize/types";

class AppointmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date.required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true }
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: "You cam only create appointment with providers" });
    }

    const hourStart = startOfHour(parseISO(date));
    if(isBefore(hourStart, new DATE())) {
      return res.status(400).json({ error: })
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date
    });

    return res.json();
  }
}
export default new AppointmentController();
