import React from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, today, next } from "../utils/date-time";
import ReservationsTable from "./ReservationsTable";
import TablesTable from "./TablesTable";

//defines the dashboard page
function Dashboard({ date, reservations, reservationsError, tables, tablesError , loadDashboard}) {
  const history = useHistory();

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>

      <ErrorAlert error={reservationsError} />
      <ReservationsTable reservations={reservations} />

      <h4 className="mb-0">Tables</h4>
      <ErrorAlert error={tablesError} />
      <TablesTable tables={tables}/>

      <button type="button" onClick={() => history.push(`/dashboard?date=${previous(date)}`)}>Previous</button>
      <button type="button" onClick={() => history.push(`/dashboard?date=${today()}`)}>Today</button>
      <button type="button" onClick={() => history.push(`/dashboard?date=${next(date)}`)}>Next</button>
    </main>
  );
}

export default Dashboard;
