export default function reservationsTable({ reservations }) {
  const rows = reservations.map(
    (
      {
        first_name,
        last_name,
        mobile_number,
        people,
        reservation_date,
        reservation_time,
      },
      index
    ) => (
      <tr key={index}>
        <td>{first_name}</td>
        <td>{last_name}</td>
        <td>{mobile_number}</td>
        <td>{people}</td>
        <td>{reservation_date}</td>
        <td>{reservation_time}</td>
      </tr>
    )
  );

  return (
    <table>
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Mobile Number</th>
          <th>People</th>
          <th>Reservation Date</th>
          <th>Reservation Time</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}
