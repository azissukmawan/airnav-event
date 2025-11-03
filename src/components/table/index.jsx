import React from "react";
import PropTypes from "prop-types";

/**
 * Table component reusable
 * Props:
 * - columns: [{ header: <JSX|string>, accessor: (row, index) => value, className?: string }]
 * - data: array of objects
 */
const Table = ({ columns, data }) => {
  return (
    <div className="shadow-md rounded-lg overflow-hidden mx-4 md:mx-0">
      <table className="w-full  table-auto">
        {/* === HEADER === */}
        <thead className="bg-blue-100 text-blue-900 text-[16px] font-semibold">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className={`px-6 py-4 text-left font-semibold break-words ${
                  col.className || ""
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* === BODY === */}
        <tbody className="bg-white">
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-6 py-4 text-gray-800 text-sm whitespace-normal break-words align-top ${
                      col.className || ""
                    }`}
                  >
                    {col.accessor(row, rowIndex)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-4 text-center text-gray-500"
              >
                Tidak ada data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
        .isRequired,
      accessor: PropTypes.func.isRequired,
      className: PropTypes.string,
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
};

export default Table;
