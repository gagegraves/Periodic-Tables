import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function NewReservationForm() {
  const history = useHistory();

  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    people: "",
    reservation_date: "",
    reservation_time: "",
  };

  const [formData, setFormData] = useState({ ...initialFormState });
  const [submissionErrors, setSubmissionErrors] = useState([]);
  const [apiError, setApiError] = useState(null);

  const handleChange = ({ target }) => {
    setFormData({ ...formData, [target.name]: target.value });
  };
  //makes the API call to create the reservation in the database once the form is submitted
  async function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    const foundErrors = [];

    if (!validateDate(foundErrors)) {
      //API call here
      await createReservation(formData, abortController.signal)
        .then(() =>
          history.push(`/dashboard?date=${formData.reservation_date}`)
        )
        .catch(setApiError);
    }
    setSubmissionErrors(foundErrors);
    return () => abortController.abort();
  }
  //the validation function to ensure that the date and time being set for the reservation are during the restaurants open hours
  function validateDate(foundErrors) {
    //a string that is a full JS-formatted date/time
    const reserveDate = new Date(
      `${formData.reservation_date}T${formData.reservation_time}:00.000`
    );
      //grab todays date, and the 
    const today = new Date();
    const hours = reserveDate.getHours();  
    const mins = reserveDate.getMinutes();
    
    if (reserveDate.getDay() === 2) {
      foundErrors.push({
        message:
          "Reservation cannot be made: Restaurant is closed on Tuesdays.",
      });
    }
    if (reserveDate < today) {
      foundErrors.push({
        message:
          "Reservation cannot be made: Reservations cannot be set for past dates.",
      });
    }
      if (hours < 10 || (hours === 10 && mins < 30)) {
        foundErrors.push({
          message:
            "Reservation cannot be made: Restaurant is not open until 10:30AM.",
        });
      } else if (hours > 22 || (hours === 22 && mins >= 30)) {
        foundErrors.push({
          message:
            "Reservation cannot be made: Restaurant is closed after 10:30PM.",
        });
      } else if (hours > 21 || (hours === 21 && mins > 30)) {
        foundErrors.push({
          message:
            "Reservation cannot be made: Reservation must be made at least an hour before closing. (10:30PM).",
        });
      }
    return foundErrors.length !== 0;
  }

  const errorsJSX = () => {
    return submissionErrors.map((error, index) => (
      <ErrorAlert key={index} error={error} />
    ));
  };

  return (
    <>
      {errorsJSX()}
      <ErrorAlert error={apiError} />
      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="first_name">
            First Name
            <input
              id="first_name"
              type="text"
              name="first_name"
              onChange={handleChange}
              value={formData.first_name}
              minLength="2"
              required
            />
          </label>
          <label htmlFor="last_name">
            Last Name
            <input
              id="last_name"
              type="text"
              name="last_name"
              onChange={handleChange}
              value={formData.last_name}
              minLength="2"
              required
            />
          </label>
          <label htmlFor="mobile_number">
            Mobile Number
            <input
              id="mobile_number"
              type="number"
              name="mobile_number"
              onChange={handleChange}
              value={formData.mobile_number}
              required
            />
          </label>
          <label htmlFor="reservation_date">
            Reservation Date
            <input
              id="reservation_date"
              type="date"
              name="reservation_date"
              onChange={handleChange}
              value={formData.date}
              required
            />
          </label>
          <label htmlFor="reservation_time">
            Reservation Time
            <input
              id="reservation_time"
              type="time"
              name="reservation_time"
              onChange={handleChange}
              value={formData.time}
              required
            />
          </label>
          <label htmlFor="people">
            Number of Guests
            <input
              id="people"
              type="number"
              name="people"
              onChange={handleChange}
              value={formData.guests}
              min="1"
              required
            />
          </label>
          <br />
          <button type="submit" onClick={(event) => handleSubmit(event)}>
            Submit
          </button>
          <button type="button" onClick={() => history.goBack()}>
            Cancel
          </button>
        </form>
      </div>
    </>
  );
}
