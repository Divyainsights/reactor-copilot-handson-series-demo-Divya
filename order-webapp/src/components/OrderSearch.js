import React, { useState } from 'react';
import './OrderSearch.css';

const OrderSearch = ({ onSearch, onClear }) => {
  const [filters, setFilters] = useState({
    customerId: '',
    status: '',
    startDate: '',
    endDate: ''
  });

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Filter out empty values
    const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value.trim() !== '') {
        acc[key] = value.trim();
      }
      return acc;
    }, {});
    
    onSearch(activeFilters);
  };

  const handleClear = () => {
    setFilters({
      customerId: '',
      status: '',
      startDate: '',
      endDate: ''
    });
    onClear();
  };

  const hasActiveFilters = Object.values(filters).some(value => value.trim() !== '');

  return (
    <div className="order-search-container">
      <form onSubmit={handleSearch} className="order-search-form">
        <div className="search-row">
          <div className="search-field">
            <label htmlFor="customerId">Customer Number</label>
            <input
              type="text"
              id="customerId"
              name="customerId"
              value={filters.customerId}
              onChange={handleInputChange}
              placeholder="Enter customer number"
              className="search-input"
            />
          </div>
          
          <div className="search-field">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleInputChange}
              className="search-select"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="search-field">
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={filters.startDate}
              onChange={handleInputChange}
              className="search-input"
            />
          </div>
          
          <div className="search-field">
            <label htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={filters.endDate}
              onChange={handleInputChange}
              className="search-input"
            />
          </div>
        </div>
        
        <div className="search-actions">
          <button type="submit" className="search-button">
            Search Orders
          </button>
          {hasActiveFilters && (
            <button type="button" onClick={handleClear} className="clear-button">
              Clear Filters
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default OrderSearch;