import React from "react";
import DataTable from "react-data-table-component";
import { ArrowLeftIcon, ArrowRightIcon } from "./Icons";

interface CustomDataTableProps {
  columns: any[];
  data: any[];
  isLoading?: boolean;
  error?: any;
  noDataMessage?: string;
  paginationPerPage?: number;
  paginationRowsPerPageOptions?: number[];
}

const CustomDataTable: React.FC<CustomDataTableProps> = ({
  columns,
  data,
  isLoading = false,
  error = null,
  noDataMessage = "No data found",
  paginationPerPage = 10,
  paginationRowsPerPageOptions = [10, 20, 30],
}) => {
  const customStyles = {
    table: {
      style: {
        backgroundColor: "transparent",
      },
    },
    headRow: {
      style: {
        backgroundColor: "#f1f5f9",
        borderRadius: "0.5rem",
        padding: "0.75rem",
        fontSize: "1rem",
        fontWeight: 600,
        color: "#1e293b",
        borderBottom: "none",
      },
    },
    headCells: {
      style: {
        paddingLeft: "0.75rem",
        paddingRight: "0.75rem",
        fontSize: "1rem",
        fontWeight: 600,
        color: "#1e293b",
      },
    },
    rows: {
      style: {
        fontSize: "1rem",
        padding: "0.75rem",
        color: "#1e293b",
        borderBottom: "1px solid #e2e8f0",
        "&:hover": {
          backgroundColor: "#f8fafc",
        },
      },
    },
    cells: {
      style: {
        paddingLeft: "0.75rem",
        paddingRight: "0.75rem",
      },
    },
    pagination: {
      style: {
        backgroundColor: "transparent",
        borderTop: "1px solid #e2e8f0",
        padding: "1rem 0",
        marginTop: "1.5rem",
      },
    },
  };

  const CustomPagination = ({ currentPage, rowsPerPage, rowCount, onChangePage }: any) => {
    const totalPages = Math.ceil(rowCount / rowsPerPage);
    return (
      <div className="flex justify-between items-center mt-6 px-2">
        <div className="text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex gap-4 items-center">
          <button
            aria-label="Previous page"
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => onChangePage(currentPage - 1)}
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <button
            aria-label="Next page"
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => onChangePage(currentPage + 1)}
          >
            <ArrowRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error loading data</div>;
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      customStyles={customStyles}
      pagination
      paginationPerPage={paginationPerPage}
      paginationRowsPerPageOptions={paginationRowsPerPageOptions}
      highlightOnHover
      responsive
      noDataComponent={<div className="text-center py-8 text-gray-500">{noDataMessage}</div>}
      paginationComponent={CustomPagination}
    />
  );
};

export default CustomDataTable;
