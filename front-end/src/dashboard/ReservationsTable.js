import { updateReservationStatus } from "../utils/api";

export default function ReservationsTable({ reservations, loadDashboard }) {
  if (!reservations || reservations.length < 1)
    return <p>No reservations found.</p>;

  function handleCancel({ target }) {
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      const abortController = new AbortController();

      updateReservationStatus(
        target.value,
        "cancelled",
        abortController.status
      ).then(loadDashboard);

      return () => abortController.abort();
    }
  }

  const filteredReservations = [];

  for (const reservation of reservations) {
    if (reservation.status !== "cancelled") filteredReservations.push(reservation);
  }

  if (filteredReservations.length === 0 || !filteredReservations)
    return <p>No reservations found.</p>;

  const rows = filteredReservations.map(
    (
      {
        reservation_id,
        first_name,
        last_name,
        mobile_number,
        people,
        reservation_date,
        reservation_time,
        status,
      },
      index
    ) => (
      <tr key={reservation_id}>
        <td>{first_name}</td>
        <td>{last_name}</td>
        <td>{mobile_number}</td>
        <td>{people}</td>
        <td>{reservation_date}</td>
        <td>{reservation_time}</td>
        <td data-reservation-id-status={reservation_id}>{status}</td>

        {status === "booked" && (
          <td>
            <a href={`/reservations/${reservation_id}/seat`}>
              <button type="button">Seat</button>
            </a>
          </td>
        )}

        <td>
          <a href={`/reservations/${reservation_id}/edit`}>
            <button type="button">Edit</button>
          </a>
        </td>
        <td>
          <button
            type="button"
            onClick={handleCancel}
            data-reservation-id-cancel={reservation_id}
            value={reservation_id}
          >
            Cancel
          </button>
        </td>
      </tr>
    )
  );

  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">First Name</th>
          <th scope="col">Last Name</th>
          <th scope="col">Mobile Number</th>
          <th scope="col">People</th>
          <th scope="col">Reservation Date</th>
          <th scope="col">Reservation Time</th>
          <th scope="col">Status</th>
          {/* <th scope="col">Seat</th>
          <th scope="col">Edit</th>
          <th scope="col">Cancel</th> */}
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}
