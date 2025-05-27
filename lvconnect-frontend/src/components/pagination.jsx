import React from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import '../components/ui_styling/pagination.css'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="pagination-container">
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-button pagination-prev"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Page Buttons */}
      {[...Array(totalPages).keys()].map((num) => {
        const page = num + 1;
        const isActive = page === currentPage;
        return (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`pagination-button pagination-page ${
              isActive ? 'pagination-active' : ''
            }`}
          >
            {page}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-button pagination-next"
      >
        <ChevronRight size={16} />
      </button>

      {/* Page Selector */}
      <div className="pagination-select-wrapper">
        <select
          className="pagination-select"
          value={currentPage}
          onChange={(e) => handlePageChange(Number(e.target.value))}
        >
          {[...Array(totalPages).keys()].map((num) => (
            <option key={num + 1} value={num + 1}>
              {num + 1}
            </option>
          ))}
        </select>
        <ChevronDown className="pagination-select-icon" size={16} />
      </div>

      {/* Page Label */}
      <span className="pagination-page-label">/Page</span>
    </div>
  );
};

export default Pagination;
