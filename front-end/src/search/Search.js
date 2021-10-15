import React, { useState } from "react";
import { listReservations } from "../utils/api";
import ReservationsTable from "../dashboard/ReservationsTable";
import ErrorAlert from "../layout/ErrorAlert";

export default function Search() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [reservations, setReservations] = useState([]);

  const [error, setError] = useState(null);

  function handleChange({ target }) {
    setMobileNumber(target.value);
  }

  function handleSubmit(event) {
	event.preventDefault();
	const abortController = new AbortController();
	setError(null);

	listReservations({ mobile_number: mobileNumber }, abortController.signal)
		.then(setReservations)
		.catch(setError);

	return () => abortController.abort();
}

  return (
    <div>
        <h3>Search</h3>
        <form>
			<ErrorAlert error={error} />

			<label htmlFor="mobile_number">Enter a customer's phone number:</label>
			<input 
				name="mobile_number"
				id="mobile_number"
				type="tel"
				onChange={handleChange}
				value={mobileNumber}
				required
			/>

			<button type="submit" onClick={handleSubmit}>Find</button>
		</form>
      <ReservationsTable reservations={reservations} />
    </div>
  );
}
