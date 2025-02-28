import { useState } from "react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

function Pagination({
  totalPages = 0,
  totalItems = 0,
  limit = 15,
  currentPage,
  setCurrentPage,
  items,
}) {
  totalPages = totalItems > 0 ? Math.ceil(totalItems / limit) : totalPages;

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Data fetching logic
  };

  const generatePages = () => {
    const pages = [];

    // Always add the first page
    pages.push(1);

    // Add ellipsis if needed before currentPage - 2
    if (currentPage > 4) {
      pages.push("...");
    }

    // Add visible page numbers (middle pages)
    for (
      let i = Math.max(2, currentPage - 2);
      i <= Math.min(totalPages - 1, currentPage + 2);
      i++
    ) {
      pages.push(i);
    }

    // Add ellipsis if needed after currentPage + 2
    // if (currentPage < totalPages - 3) {
    //   pages.push("...");
    // }

    // Always add the last page if there's more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageClick = (page) => {
    if (page !== "...") {
      handlePageChange(page);
    } else {
      handlePageChange(3);
    }
  };

  return (
    <div className="flex justify-between items-center w-full p-4 flex-wrap">
      {/* Left side: showing item range */}
      <div className="font-semibold text-small text-default-400">
        Show {(currentPage - 1) * limit + 1} to{" "}
        {items?.length < limit && currentPage === 1
          ? items?.length
          : Math.min(currentPage * limit, parseInt(totalPages) * limit)}{" "}
        of{" "}
        {items?.length < limit && currentPage === 1
          ? items?.length
          : parseInt(totalPages) * limit}{" "}
        entries
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-end mt-3">
        <div className="m-2 shadow rounded-lg max-w-min flex">
          <button
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage === 1}
            className="join-item px-3 py-2 text-black rounded focus:outline-none hover:bg-gray-200"
          >
            <RiArrowLeftSLine />
          </button>
          {generatePages().map((page) => (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              className={`join-item px-3 py-2 text-sm focus:outline-none transition-colors duration-300 ease-in-out ${
                currentPage === page
                  ? "bg-gray-700 text-white rounded-xl hover:bg-gray-700"
                  : "bg-transparent hover:bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            className="px-3 py-2 text-black join-item rounded focus:outline-none hover:bg-gray-200"
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage >= parseInt(totalPages)}
          >
            <RiArrowRightSLine />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Pagination;
