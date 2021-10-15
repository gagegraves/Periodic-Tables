import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { listReservations, editReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function EditReservationForm({ loadDashboard }) {
  const history = useHistory();
  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    people: "",
    reservation_date: "",
    reservation_time: "",
  };
  const { reservation_id } = useParams();
  const [formData, setFormData] = useState({ ...initialFormState });
  const [errors, setErrors] = useState([]);
  const [apiError, setApiError] = useState(null);
  const [reservationsError, setReservationsError] = useState([]);

  //this useEffect loads the existing reservation data into the form
  useEffect(() => {
    if (!reservation_id) return null;

    loadReservations()
      .then((response) =>
        response.find(
          (reservation) => reservation.reservation_id === Number(reservation_id)
        )
      )
      .then(fillFields);

    function fillFields(foundReservation) {
      if (!foundReservation || foundReservation.status !== "booked") {
        return <p>Only booked reservations can be edited.</p>;
      }

      const date = new Date(foundReservation.reservation_date);
      const dateString = `${date.getFullYear()}-${(
        "0" +
        (date.getMonth() + 1)
      ).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;

      setFormData({
        first_name: foundReservation.first_name,
        last_name: foundReservation.last_name,
        mobile_number: foundReservation.mobile_number,
        reservation_date: dateString,
        reservation_time: foundReservation.reservation_time,
        people: foundReservation.people,
      });
    }

    async function loadReservations() {
      const abortController = new AbortController();
      return await listReservations(null, abortController.signal).catch(
        setReservationsError
      );
    }
  }, [reservation_id]);

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
      await editReservation(reservation_id, formData, abortController.signal)
        .then(loadDashboard)
        .then(() =>
          history.push(`/dashboard?date=${formData.reservation_date}`)
        )
        .catch(setApiError);
    }

    setErrors(foundErrors);
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
    return errors.map((error, index) => (
      <ErrorAlert key={index} error={error} />
    ));
  }

  return (
    <div>
      <h4>Edit Reservation</h4>
      {errorsJSX()}
      <ErrorAlert error={apiError} />
      {reservationsError.length > 0 && <ErrorAlert error={reservationsError} />}
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
              type="tel"
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
              value={formData.reservation_date}
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
              value={formData.reservation_time}
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
              value={formData.people}
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
    </div>
  );
}
