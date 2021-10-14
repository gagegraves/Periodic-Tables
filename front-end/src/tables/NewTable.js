import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";

export default function NewTable({ loadDashboard }) {
  const history = useHistory();

  const [error, setError] = useState(null);

  // initial (default) data
  const [formData, setFormData] = useState({
    table_name: "",
    capacity: 1,
  });

  //updates form data as the user types into the form
  function handleChange({ target }) {
	setFormData({ ...formData, [target.name]: target.name === "capacity" ? Number(target.value) : target.value });
}

  //submit handler for the new table form
  async function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();

    if (!validateFields()) {
      createTable(formData, abortController.abort())
        .then(loadDashboard)
        .then(() => history.push(`/dashboard`))
        .catch(setError);
    }
    return () => abortController.abort();
  }

  //makes sure both fields are filled in correctly
  function validateFields() {
    let foundError = null;

    if (formData.table_name === "" || formData.capacity === "") {
      foundError = { message: "Please fill out all fields." };
    } else if (formData.table_name.length < 2) {
      foundError = { message: "Table name must be at least 2 characters." };
    }

	if(formData.capacity < 1) {
		console.log("Capacity on submission: ", formData.capacity)
		foundError = { message: "Capacity cannot be less than 1."}
	}

    setError(foundError);

    return foundError !== null;
  }

  return (
    <form>
      <ErrorAlert error={error} />

      <label htmlFor="table_name">Table Name:&nbsp;</label>
      <input
        name="table_name"
        id="table_name"
        type="text"
        onChange={handleChange}
        value={formData.table_name}
        required
      />

      <label htmlFor="capacity">Capacity:&nbsp;</label>
      <input
        name="capacity"
        id="capacity"
        type="number"
        min="1"
        onChange={handleChange}
        value={formData.capacity}
        required
      />

      <button type="submit" onClick={handleSubmit}>
        Submit
      </button>
      <button type="button" onClick={history.goBack}>
        Cancel
      </button>
    </form>
  );
}
