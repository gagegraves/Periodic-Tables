import React, { useState, useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { today } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import Dashboard from "../dashboard/Dashboard";
import NewTable from "../tables/NewTable";
import NewReservationForm from "../reservations/NewReservationForm";
import SeatReservation from "../reservations/SeatReservation";
import Search from "../search/Search"
import NotFound from "./NotFound";
import { listReservations, listTables } from "../utils/api";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */

function Routes() {
  const query = useQuery();
  const date = query.get("date") ? query.get("date") : today();

  //these values will be defined by an API call and passed down as props to all the components that require them
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  //useEffect will call the loadDashboard function every time the 'date' variable changes
  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    //abort controller used to avoid race conditions in async calls
    setReservations([]);
    setTables([]);
    setReservationsError(null);
    setTablesError(null);
    const abortController = new AbortController();

    // the first parameter { date } is the search parameter for the database, and also the value of 'date'
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    listTables(abortController.signal).then(setTables).catch(setTablesError);

    // here's where all other abortControllers will dump their async calls
    return () => abortController.abort();
  }

  return (
    <Switch>
      <Route exact={true} path="/reservations/:reservation_id/seat">
        <SeatReservation
          tables={tables}
          loadDasboard={loadDashboard}
        />
      </Route>
      
      <Route exact={true} path="/reservations/new">
        <NewReservationForm />
      </Route>

      <Route exact={true} path="/tables/new">
        <NewTable loadDashboard={loadDashboard} />
      </Route>

      <Route path="/search">
        <Search reservations={reservations} />
      </Route>

      <Route path="/dashboard">
        <Dashboard
          date={date ? date : today()}
          reservations={reservations}
          reservationsError={reservationsError}
          tables={tables}
          tablesError={tablesError}
          loadDashboard={loadDashboard}
        />
      </Route>

      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>

      <Route>
        <NotFound />
      </Route>

    </Switch>
  );
}

export default Routes;
