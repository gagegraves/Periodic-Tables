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
  if (data.first_name.length > 20 || data.first_name < 2)
    return next({
      status: 400,
      message: "First name must be between 2 and 20 characters.",
    });
  if (data.last_name.length > 20 || data.last_name < 2)
    return next({
      status: 400,
      message: "Last name must be between 2 and 20 characters.",
    });
    if (data.mobile_number.length < 9)
    return next({
      status: 400,
      message: "Please enter a valid mobile number.",
    });
    if (data.people <= 0)
    return next({
      status: 400,
      message: "There must be at least 1 person attending a reserved table.",
    });
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
