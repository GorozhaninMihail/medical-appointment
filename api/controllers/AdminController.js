/**
 * AdminController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
/* global sails Speciality Doctor Clinic */
const {format, parse, isAfter} = require('date-fns');
const uniq = require('lodash/uniq');

module.exports = {
  async getStats(req, res) {
    const consultationsCount = (await sails.sendNativeQuery(
      'SELECT COUNT(*) FROM consultations',
    )).rows[0].count;

    const consultationsMade = (await sails.sendNativeQuery(
      'SELECT COUNT(*) FROM consultations WHERE completed = true',
    )).rows[0].count;

    const doctorsCount = (await sails.sendNativeQuery(
      'SELECT COUNT(*) FROM doctors',
    )).rows[0].count;

    const clinicsCount = (await sails.sendNativeQuery(
      'SELECT COUNT(*) FROM medical_centres',
    )).rows[0].count;

    const ordersCount = (await sails.sendNativeQuery(
      'SELECT COUNT(*) FROM orders',
    )).rows[0].count;

    const ordersCompleted = (await sails.sendNativeQuery(
      'SELECT COUNT(*) FROM orders WHERE status = 1',
    )).rows[0].count;

    const specialitiesCount = (await sails.sendNativeQuery(
      'SELECT COUNT(*) FROM specialities',
    )).rows[0].count;

    const userCount = (await sails.sendNativeQuery(
      'SELECT COUNT(*) FROM users WHERE type = $1',
      ['user'],
    )).rows[0].count;

    return res.send({
      consultationsCount,
      consultationsMade,
      doctorsCount,
      clinicsCount,
      ordersCount,
      ordersCompleted,
      specialitiesCount,
      userCount,
    });
  },

  async postAddSpeciality(req, res) {
    const {name} = req.body;

    if (!name
      || name.length < 3
      || name.length > 50) {
      return res.badRequest('Название специальности слишком короткое или слишком длинное.');
    }

    const existingSpeciality = (await sails.sendNativeQuery(
      'SELECT * FROM specialities WHERE name = $1',
      [name],
    )).rows[0];

    if (existingSpeciality) {
      return res.badRequest('Специальность с таким именем уже существует.');
    }

    const newSpeciality = await Speciality.create({
      name,
    }).fetch();

    return res.json(newSpeciality);
  },

  async postDeleteSpeciality(req, res) {
    const {id} = req.body;

    if (!id) {
      return res.badRequest('Не указана специальность.');
    }

    const speciality = await Speciality.findOne({id});

    if (!speciality) {
      return res.badRequest('Такой специальности не существует.');
    }

    const doctors = await Doctor.find({
      speciality: id,
    });

    if (doctors.length) {
      return res.badRequest('Некоторые врачи имеют такую специальность.');
    }

    await Speciality.destroyOne({id});

    return res.send();
  },

  async getAllSpecialities(req, res) {
    const allSpecialities = await Speciality.find();
    return res.json(allSpecialities);
  },

  async postAddTimesheetRecord(req, res) {
    const {doctorId, clinicId, time, date: rawDate} = req.body;

    if (!doctorId) {
      return res.badRequest('Укажите врача.');
    }

    if (!clinicId) {
      return res.badRequest('Выберите клинику.');
    }

    if (!rawDate || !time) {
      return res.badRequest('Укажите дату и время.');
    }

    const doctor = await Doctor.findOne({
      id: doctorId,
      active: true,
    });

    if (!doctor) {
      return res.badRequest('Такой врач не найден, или в данный момент он не работает в клинике.');
    }

    const clinic = await Clinic.findOne({
      id: clinicId,
    });

    if (!clinic) {
      return res.badRequest('Такая клиника не найдена.');
    }

    const date = parse(+rawDate);

    const timeRegex = /([0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]/;

    let times = uniq(
      time
        .split(',')
        .filter(t => t.trim().match(timeRegex)),
    ).filter(t => {
      const [hours, mins] = t.split(':');
      date.setHours(+hours);
      date.setMinutes(+mins);
      return isAfter(date, new Date());
    });

    const formattedDate = format(date, 'YYYY-MM-DD');

    const busyTime = (await Promise.all(
      times.map(t => sails.sendNativeQuery(
        'SELECT * FROM timesheet WHERE doctor_id = $1 AND mc_id = $2 AND date = $3 AND start = $4',
        [doctorId, clinicId, formattedDate, t],
      )),
    )).map(result => !!result.rowCount);

    const freeTime = times.filter((t, i) => !busyTime[i]);

    if (!freeTime.length) {
      return res.badRequest('Не введено ни одной корректной даты.');
    }

    await Promise.all(
      times.map((t, i) => {
        const promise = busyTime[i]
          ? Promise.resolve()
          : sails.sendNativeQuery(
            'INSERT INTO timesheet (doctor_id, mc_id, date, start) VALUES($1, $2, $3, $4)',
            [doctorId, clinicId, formattedDate, t],
          );
        return promise;
      }),
    );

    const addedTimes = freeTime.join(', ');

    return res.json(`Добавлено следующее время: ${addedTimes}`);
  },
};
