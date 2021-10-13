const knex = require("../db/connection");

function list() {
  return knex("tables").select("*").orderBy("table_name");
}

function readTable(table_id) {
  return knex("tables").select("*").where({ table_id: table_id }).first();
}

function readReservation(reservation_id) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservation_id })
    .first();
}

function occupy(table_id, reservation_id) {
  return knex("tables")
    .where({ table_id: table_id })
    .update({ reservation_id: reservation_id, status: "occupied" });
}

function updateReservation(reservation_id, status) {
  return knex("reservations")
    .where({ reservation_id: reservation_id })
    .update({ status: status });
}

function create(table) {
	return knex("tables")
		.insert(table)
		.returning("*");
}

module.exports = {
  list,
  occupy,
  create,
  readTable,
  readReservation,
  updateReservation,
};
