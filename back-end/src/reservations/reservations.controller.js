const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//makes sure the data  sent from the request exists
async function validateDataExists(req, res, next) {
  if (!req.body.data) {
    return next({ status: 400, message: "Body must include a data object" });
  }

  next();
}

//makes sure the data properties in the body are what we expect them to be
function validateRequiredProperties(req, res, next) {
  const reservation = req.body.data;
  const REQUIRED_FIELDS = [
    "first_name",
    "last_name",
    "mobile_number",
    "people",
    "reservation_date",
    "reservation_time",
  ];

  for (const field of REQUIRED_FIELDS) {
    if (!reservation.hasOwnProperty(field) || reservation[field] === "") {
      return next({
        status: 400,
        message: `Field required: '${field}'`,
      });
    }
  }

  if (typeof reservation.people !== "number") {
    return next({
      status: 400,
      message: "Reservation cannot be made: 'people' field must be a number",
    });
  }

  if (reservation.people <= 0) {
    return next({
      status: 400,
      message: "Reservation cannot be made: 'people' field must be at least 1",
    });
  }

  if (reservation.status && reservation.status !== "booked") {
    return next({
      status: 400,
      message: `'status' field cannot be ${reservation.status}`,
    });
  }

  next();
}

//makes sure that a reservation that's being requested exists
async function validateReservationId(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await service.read(Number(reservation_id));
  if (!reservation) {
    return next({
      status: 404,
      message: `reservation_id ${reservation_id} does not exist`,
    });
  }

  res.locals.reservation = reservation;

  next();
}

//makes sure the data sent in from the request matches the restaurants rules for reservations
function validateReservationDate(req, res, next) {
  const reservation = req.body.data;
  const reserveDate = new Date(`${reservation.reservation_date}T${reservation.reservation_time}:00.000`);
  const today = new Date();
  const hours = reserveDate.getHours();
  const mins = reserveDate.getMinutes();

  if (reserveDate.getDay() === 2) {
    return next({
      status: 400,
      message: "Reservation cannot be made: Restaurant is closed on Tuesdays",
    });
  }

  if (reserveDate < today) {
    return next({
      status: 400,
      message:
        "Reservation cannot be made: Reservations must be set for a future date",
    });
  }

  if (hours < 10 || (hours === 10 && mins < 30)) {
    return next({
      status: 400,
      message:
        "Reservation cannot be made: Restaurant is not open until 10:30AM",
    });
  } else if (hours > 22 || (hours === 22 && mins >= 30)) {
    return next({
      status: 400,
      message: 
        "Reservation cannot be made: Restaurant is closed after 10:30PM",
    });
  } else if (hours > 21 || (hours === 21 && mins > 30)) {
    return next({
      status: 400,
      message:
        "Reservation cannot be made: Reservation must be made at least an hour before closing time (10:30PM)",
    });
  }

  if (!Date.parse(reserveDate)) {
    return next({
      status: 400,
      message:
        "Reservation cannot be made: Invalid reservation_date/reservation_time",
    });
  }

  next();
}

//verifies that the status of the reservation  in a update request allows it to be updated, i.e. it's
//not already a finished table
async function validateUpdateBody(req, res, next) {
  const reservation = req.body.data;
  const VALID_STATUSES = ["booked", "seated", "finished", "cancelled"];

  if (!reservation.status) {
    next({
      status: 400,
      message: "body must include a status field",
    });
  }

  if (!VALID_STATUSES.includes(reservation.status)) {
    next({
      status: 400,
      message: `invalid reservation status: ${reservation.status}`,
    });
  }

  if (res.locals.reservation.status === "finished") {
    next({
      status: 400,
      message: "A finished reservation cannot be updated",
    });
  }

  next();
}

//return a list of all reservations from db
async function list(req, res) {
  let { date = null } = req.query;
  let {mobile_number = null} = req.query;

  const reservations = await service.list(date, mobile_number);

  const response = reservations.filter((res) => res.status !== "finished")
  
  res.json({ data: response });
}

//returns a specific reservation from db
async function read(req, res) {
  res.status(200).json({ data: res.locals.reservation });
}

//creates a new reservation in the db with the data from the request
async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

//updates a reservation's status with the status that was sent in the update request
async function updateReservation(req, res) {
  await service.updateReservation(
    res.locals.reservation.reservation_id,
    req.body.data.status
  );
  res.status(200).json({ data: { status: req.body.data.status } });
}

module.exports = {
  list: asyncErrorBoundary(list),

  read: [asyncErrorBoundary(validateReservationId), asyncErrorBoundary(read)],

  create: [
    asyncErrorBoundary(validateDataExists),
    asyncErrorBoundary(validateRequiredProperties),
    asyncErrorBoundary(validateReservationDate),
    asyncErrorBoundary(create),
  ],

  updateReservation: [
    asyncErrorBoundary(validateDataExists),
    asyncErrorBoundary(validateReservationId),
    asyncErrorBoundary(validateUpdateBody),
    asyncErrorBoundary(updateReservation),
  ],
};
