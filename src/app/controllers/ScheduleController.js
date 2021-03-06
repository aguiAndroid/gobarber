import User from "../models/User";
import Appointments from "../models/Appointment";
import { startOfDay, endOfDay, parseISO } from "date-fns";
import { Op } from "sequelize";

class ScheduleController {
  async index(req, res) {
    const checkUserProvider = await User.findOne({
      where: { id: req.userId, provider: true }
    });

    if (!checkUserProvider) {
      return res.status(401).json({ error: "User is not a provider" });
    }
    const { date } = req.query;
    const parsedDate = parseISO(date);
    const appoitments = Appointments.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)]
        }
      },
      order: ["date"]
    });
    return res.json(appoitments);
  }
}

export default new ScheduleController();
