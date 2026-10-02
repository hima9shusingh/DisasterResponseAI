const Table = ({ headers, data, renderRow }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-soft border border-neutral-200">
      <table className="w-full text-left text-sm text-neutral-600">
        <thead className="text-xs text-neutral-500 uppercase bg-neutral-50 border-b border-neutral-200">
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} scope="col" className="px-6 py-3 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, idx) => (
              <tr key={idx} className="border-b border-neutral-100 hover:bg-neutral-50/50 transition-colors">
                {renderRow(item)}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} className="px-6 py-8 text-center text-neutral-400">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
