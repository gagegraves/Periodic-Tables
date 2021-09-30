import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

export default function NewReservationForm() {
  const history = useHistory();
  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_phone: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };

  const [formData, setFormData] = useState({ ...initialFormState });

  

  const handleChange = ({ target }) => {
    setFormData({ ...formData, [target.name]: target.value });
  };

 async function handleSubmit(event) {
    event.preventDefault();
    
    setFormData({ ...initialFormState });
    history.push(`/dashboard?date=${formData.reservation_date}`)
  };

  //   const submitHandler = async (event) => {
  //     event.preventDefault();
  //     const response = await fetch(
  //       `https://jsonplaceholder.typicode.com/users/${user.id}`,
  //       {
  //         method: "PUT",
  //         body: JSON.stringify(user),
  //       }
  //     );
  //     const savedData = await response.json();
  //     console.log("Saved user!", savedData);
  //   };

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
          <label htmlFor="mobile_phone">
            Mobile Phone
            <input
              id="mobile_phone"
              type="tel"
              name="mobile_phone"
              onChange={handleChange}
              value={formData.mobile_phone}
              required
            />
          </label>
          <label htmlFor="date">
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
          <label htmlFor="time">
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
          <button type="submit" onClick={() => history.push("/dashboard")}>Submit</button>
          <button type="button" onClick={() => history.goBack()}>
            Cancel
          </button>
        </form>
      </div>
    </>
  );
}
