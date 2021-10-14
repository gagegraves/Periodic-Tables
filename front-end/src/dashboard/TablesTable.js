import { freeTable } from "../utils/api";

export default function TablesTables({ tables, loadDashboard }) {
  if (!tables || tables.length < 1) return null;

   async function handleFinish({ target }) {
    if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
      const abortController = new AbortController();

      await freeTable(target.value, abortController.signal).then(loadDashboard);

      return () => abortController.abort(); 
    }
  }

  const rows = tables.map(
    ({ table_id, table_name, capacity, status }, index) => (
      <tr key={table_id}>
        <td>{table_id}</td>
        <td>{table_name}</td>
        <td>{capacity}</td>
        <td data-table-id-status={table_id}>{status}</td>
        {status === "occupied" && (
          <td>
            <button 
              data-table-id-finish={table_id}
              value ={table_id}
              onClick={handleFinish} 
              type="button"
              >
              Finish
            </button>
          </td>
        )}
      </tr>
    )
  );

  return (
    <table className="table">
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
