export default function tablesTables({ tables }) {
    if (!tables) return null;

  const rows = tables.map(({table_id, table_name, capacity}, index) =>(
    <tr>
      <td>{table_id}</td>
      <td>{table_name}</td>
      <td>{capacity}</td>
    </tr>
  ))
  return (
    <table class="table">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Table Name</th>
          <th scope="col">Capacity</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}
