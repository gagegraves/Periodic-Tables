import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

export default function Reservations() {
  const history = useHistory();
  const initialFormState = {
    firstName: "",
    lastName: "",
    phone: "",
    date: "",
    time: "",
    guests: "",
  };

  const [formData, setFormData] = useState({ ...initialFormState });

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
    setFormData({ ...initialFormState });
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
          <label htmlFor="firstName">
            First Name
            <input
              id="firstName"
              type="text"
              name="firstName"
              onChange={handleChange}
              value={formData.firstName}
              minLength="2"
              required
            />
          </label>
          <label htmlFor="lastName">
            Last Name
            <input
              id="lastName"
              type="text"
              name="lastName"
              onChange={handleChange}
              value={formData.lastName}
              minLength="2"
              required
            />
          </label>
          <label htmlFor="phone">
            Phone Number
            <input
              id="phone"
              type="number"
              name="phone"
              onChange={handleChange}
              value={formData.phone}
              required
            />
          </label>
          <label htmlFor="date">
            Date
            <input
              id="date"
              type="date"
              name="date"
              onChange={handleChange}
              value={formData.date}
              required
            />
          </label>
          <label htmlFor="time">
            Time
            <input
              id="time"
              type="time"
              name="time"
              onChange={handleChange}
              value={formData.time}
              required
            />
          </label>
          <label htmlFor="guests">
            Number of Guests
            <input
              id="guests"
              type="number"
              name="guests"
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
