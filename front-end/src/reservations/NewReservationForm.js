import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {createReservation} from "../utils/api"

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

  const handleChange = ({ target }) => {
    setFormData({ ...formData, [target.name]: target.value });
  };

  function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();

    createReservation(formData, abortController.signal);
    setFormData({ ...initialFormState });
    history.push(`/dashboard?date=${formData.reservation_date}`)
  };

  return (
    <>
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
            Mobile Phone
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
          <button type="submit" onClick={(event)=>handleSubmit(event)}>Submit</button>
          <button type="button" onClick={() => history.goBack()}>
            Cancel
          </button>
        </form>
      </div>
    </>
  );
}
