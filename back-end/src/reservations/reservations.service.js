const knex = require("../db/connection");

function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function list(reservation_date) {
  if (!reservation_date) return knex("reservations").select("*");
  return knex("reservations")
    .select("*")
    .orderBy("reservation_time")
    .where({ reservation_date });
}

function read(reservation_id) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservation_id })
    .first()
}

module.exports = {
  create,
  list,
  read,
};
