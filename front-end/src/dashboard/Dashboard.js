import React, { useEffect, useState } from "react";
import { useHistory  } from "react-router-dom";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, today, next } from "../utils/date-time";
import ReservationsTable from "./ReservationsTable"

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const history = useHistory();
  //reservations holds response from API
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  //useEffect will call the loadDashboard function every time the 'date' variable changes
  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    //abort controller used to avoid race conditions in async calls
    const abortController = new AbortController();
    setReservationsError(null);
    // the first parameter { date } is the search parameter for the database, and also the value of 'date'
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
      // here's where all other abortControllers will dump their async calls
    return () => abortController.abort();
  }

// this return statement already has a component that will show errors if something goes wrong. then, it stringifies the response from the API.
// right now, the stringify will still output some javascript-looking strings. 

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>

      <ErrorAlert error={reservationsError} />
      <ReservationsTable reservations={reservations} />
  
      <button type="button" onClick={() => history.push(`/dashboard?date=${previous(date)}`)}>Previous</button>
			<button type="button" onClick={() => history.push(`/dashboard?date=${today()}`)}>Today</button>
			<button type="button" onClick={() => history.push(`/dashboard?date=${next(date)}`)}>Next</button>
    </main>
  );
}

export default Dashboard;
