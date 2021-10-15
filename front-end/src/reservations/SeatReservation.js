import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations, seatTable } from "../utils/api";

export default function SeatReservation({ tables, loadDashboard }) {
  const history = useHistory();

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [table_id, setTableId] = useState(0);
  const [errors, setErrors] = useState([]);
  const [apiErrors, setApiErrors] = useState(null);

  const { reservation_id } = useParams();
  const foundReservation = reservations.find(
    (reservation) => reservation.reservation_id === Number(reservation_id)
  );

  //make an API call to retrieve all reservations on first render
  useEffect(() => {
    const abortController = new AbortController();
    setReservationsError(null);

    listReservations(null, abortController.abort())
      .then(setReservations)
      .catch((error) => console.log(error));

    return () => abortController.abort();
  }, []);

  //if there are either no tables or no reservations returned by the API, return null
  if (!tables || !reservations) return null;

  function handleChange({ target }) {
    setTableId(target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    const foundErrors = [];

    if (validateSeat(foundErrors)) {


      await seatTable(reservation_id, table_id, abortController.signal)
        .then(loadDashboard)
        .then(() => history.push(`/dashboard?date=${foundReservation.reservation_date}`))
        .catch(setApiErrors);
    }

    setErrors(foundErrors);
    return () => abortController.abort();
  }

  function validateSeat(foundErrors) {
    // we will need to use the find method here to get the actual table/reservation objects from their ids

    const foundTable = tables.find(
      (table) => table.table_id === Number(table_id)
    );

    if (!foundTable) {
      foundErrors.push("The table you selected does not exist.");
    }
    else if (!foundReservation) {
      foundErrors.push({message: "This reservation does not exist."});
    }
    else {
      if (foundTable.status === "occupied") {
        foundErrors.push({message: "The table you selected is currently occupied."});
      }

      if (foundTable.capacity < foundReservation.people) {
        foundErrors.push({
          message: `The table you selected cannot seat ${foundReservation.people} people.`,
        });
      }
    }
    // this conditional will either return true or false based off of whether foundErrors is equal to 0
    return foundErrors.length === 0;
  }

  //function that takes the table data from the API and formats it for the table selector in the seat reservations page
  function availableTables() {
    return tables.map((table, index) => (
      <option key={table.table_id} value={table.table_id}>
        {table.table_name} - {table.capacity}
      </option>
    ));
  }

  function errorsJSX() {
    return errors.map((error, index) => (
      <ErrorAlert key={index} error={error} />
    ));
  }

  return (
    <form className="form-select">
      
      {errorsJSX()}
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={apiErrors} />

      <label htnlfor="table_id">Choose Table</label>

      <select
        name="table_id"
        id="table_id"
        value={table_id}
        onChange={handleChange}
      >
        <option value={0}>Choose a Table</option>
        {availableTables()}
      </select>

      <button type="submit" onClick={(event) => handleSubmit(event)}>
        Submit
      </button>

      <button type="button" onClick={history.goBack}>
        Cancel
      </button>

    </form>
  );
}
