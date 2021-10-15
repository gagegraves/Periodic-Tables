const knex = require("../db/connection");

function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function list(date, mobile_number) {
  if (date) {
    return knex("reservations")
      .select("*")
      .where({ reservation_date: date })
      .orderBy("reservation_time");
  }

  if (mobile_number) {
    return knex("reservations")
      .select("*")
      .where("mobile_number", "like", `${mobile_number}%`);
  }

  return knex("reservations").select("*");
}

function read(reservation_id) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservation_id })
    .first();
}

function updateReservation(reservation_id, status) {
  return knex("tables")
    .where({ reservation_id: reservation_id })
    .update({ status: status });
}

module.exports = {
  create,
  list,
  read,
  updateReservation,
};
