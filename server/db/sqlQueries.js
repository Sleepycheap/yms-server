function populateTable(customerName) {}

export function DeleteAll(tablename) {
  const table = tablename;
  const query = `DELETE FROM ${tablename}`;
  return query;
}
