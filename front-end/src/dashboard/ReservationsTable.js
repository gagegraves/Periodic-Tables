export default function reservationsTable({ reservations }) {
  if (!reservations || reservations.length < 1) return null;

  const rows = reservations.map(
    (
      {
        reservation_id,
        first_name,
        last_name,
        mobile_number,
        people,
        reservation_date,
        reservation_time,
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
        <td>
				<a href={`/reservations/${reservation_id}/seat`}>
					<button type="button">Seat</button>
				</a>
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
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}
