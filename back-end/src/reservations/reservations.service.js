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

module.exports = {
  create,
  list,
};
