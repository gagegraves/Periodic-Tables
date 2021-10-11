const service = require("./reservations.service");
const hasProperties = require("../errors/hasProperties");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "people",
  "reservation_date",
  "reservation_time",
];

const hasRequiredProperties = hasProperties(VALID_PROPERTIES);

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length > 0) {
    console.log(
      "rejection in reservations.controller.hasOnlyValidProperties()"
    );
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

function dataValidation(req, res, next) {
  const data = req.body.data;

  for (const field in data) {
    if (data[field] === "") {
      return next({
        status: 400,
        message: `Reservation cannot be made: ${field
          .split("_")
          .join(" ")} cannot be left blank.`,
      });
    }
  }

  const reserveDate = new Date(
    `${data.reservation_date}T${data.reservation_time}:00.000`
  );
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

  if (typeof data.people !== "number") {
    return next({
      status: 400,
      message: "Reservation cannot be made: 'people' field must be a number",
    });
  }

  if (data.people <= 0) {
    return next({
      status: 400,
      message: "Reservation cannot be made: 'people' field must be at least 1",
    });
  }

  next();
}

async function list(req, res) {
  let { date = null } = req.query;
  const data = await service.list(date);
  res.json({ data });
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    asyncErrorBoundary(hasOnlyValidProperties),
    asyncErrorBoundary(hasRequiredProperties),
    asyncErrorBoundary(dataValidation),
    asyncErrorBoundary(create),
  ],
};
