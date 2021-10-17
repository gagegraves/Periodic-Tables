import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function NewReservationForm({ loadDashboard }) {
  const history = useHistory();

  //object that we can use the clear th form, i.e. upon re-render
  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    people: "",
    reservation_date: "",
    reservation_time: "",
  };

  //dynamic variables we want to keep track of
  const [formData, setFormData] = useState({ ...initialFormState });
  const [submissionErrors, setSubmissionErrors] = useState([]);
  const [apiError, setApiError] = useState(null);

  function handleChange({ target }) {
    setFormData({
      ...formData,
      [target.name]:
        target.name === "people" ? Number(target.value) : target.value,
    });
  }

  //makes the API call to create the reservation in the database once the form is submitted
  async function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    const foundErrors = [];

    if (validateDate(foundErrors) && validateFields(foundErrors)) {
      //* API call here
      await createReservation(formData, abortController.signal)
        .then(loadDashboard)
        .then(() =>
          history.push(`/dashboard?date=${formData.reservation_date}`)
        )
        .catch(setApiError);
    }

    if (foundErrors.length > 0) setSubmissionErrors(foundErrors);

    return () => abortController.abort();
  }

  //the validation function to ensure that the date and time being set for the reservation are during the restaurants open hours
  function validateDate(foundErrors) {
    //a string that is a full JS-formatted date/time
    const reserveDate = new Date(
      `${formData.reservation_date}T${formData.reservation_time}:00.000`
    );
    //grab todays date, and the hours/mniutes of the submitted reservation time for reference/validation
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
          "Reservation cannot be made: Reservations must be set for a future date.",
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
    return foundErrors.length === 0;
  }

  //verifies all required fields exist and contain valid data
  function validateFields(foundErrors) {
    for (const field in formData) {
      if (formData[field] === "") {
        foundErrors.push({
          message: `Reservation cannot be made: ${field
            .split("_")
            .join(" ")} cannot be left blank.`,
        });
      }
    }

    if (formData.people <= 0) {
      foundErrors.push({
        message: "Reservation cannot be made: Must have at least 1 guest.",
      });
    }

    return foundErrors.length === 0;
  }

  function errorsJSX() {
    return submissionErrors.map((error, index) => (
      <ErrorAlert key={index} error={error} />
    ));
  }

  return (
    <div>
      <div>
        <h3 className="mb-3 pt-2">New Reservation</h3>
      </div>
      {errorsJSX()}
      <ErrorAlert error={apiError} />
      <div>
        <form className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="first_name" className="form-label">
              First Name
            </label>
            <input
              className="form-control"
              id="first_name"
              type="text"
              name="first_name"
              onChange={handleChange}
              value={formData.first_name}
              minLength="2"
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="last_name" className="form-label">
              Last Name
            </label>
            <input
              className="form-control"
              id="last_name"
              type="text"
              name="last_name"
              onChange={handleChange}
              value={formData.last_name}
              minLength="2"
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="mobile_number" className="form-label">
              Mobile Number
            </label>
            <input
              className="form-control"
              id="mobile_number"
              type="tel"
              name="mobile_number"
              onChange={handleChange}
              value={formData.mobile_number}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="reservation_date" className="form-label">
              Reservation Date
            </label>
            <input
              className="form-control"
              id="reservation_date"
              type="date"
              name="reservation_date"
              onChange={handleChange}
              value={formData.reservation_date}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="reservation_time" className="form-label">
              Reservation Time
            </label>
            <input
              className="form-control"
              id="reservation_time"
              type="time"
              name="reservation_time"
              onChange={handleChange}
              value={formData.reservation_time}
              required
            />
          </div>
          <div className="col-md-6 c">
            <label htmlFor="people" className="form-label">
              Number of Guests
            </label>
            <input
              className="form-control"
              id="people"
              type="number"
              name="people"
              onChange={handleChange}
              value={formData.people}
              min="1"
              required
            />
          </div>
          <div className="btn-group col-md-3">
            <button
              className="btn btn-success p-1"
              type="submit"
              onClick={handleSubmit}
            >
              Submit
            </button>
            <button
              className="btn btn-danger p-1"
              type="button"
              onClick={() => history.goBack()}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
