import React, { useState, useEffect } from 'react';
import './OrderList.css';
import OrderSearch from './OrderSearch';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchFilters, setSearchFilters] = useState({});

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

  const fetchOrders = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query string from filters
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value);
        }
      });
      
      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/orders${queryString ? `?${queryString}` : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(`Failed to fetch orders: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [API_BASE_URL]);

  const calculateItemCount = (items) => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const formatItemsList = (items) => {
    return items.map(item => `${item.name} (${item.quantity})`).join(', ');
  };

  const handleSearch = (filters) => {
    setSearchFilters(filters);
    fetchOrders(filters);
  };

  const handleClearSearch = () => {
    setSearchFilters({});
    fetchOrders({});
  };

  const handleRefresh = () => {
    fetchOrders(searchFilters);
  };

  if (loading) {
    return <div className="order-list-loading">Loading orders...</div>;
  }

  if (error) {
    return (
      <div className="order-list-error">
        <p>{error}</p>
        <button onClick={handleRefresh} className="refresh-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="order-list-container">
      <div className="order-list-header">
        <h2>Order List</h2>
        <button onClick={handleRefresh} className="refresh-button">
          Refresh
        </button>
      </div>
      
      <OrderSearch onSearch={handleSearch} onClear={handleClearSearch} />
      
      {orders.length === 0 ? (
        <div className="no-orders">No orders found.</div>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Customer Number</th>
              <th>Items</th>
              <th>Item Count</th>
              <th>Total</th>
              <th>Order Status</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customerId}</td>
                <td className="items-cell">
                  <div className="items-list" title={formatItemsList(order.items)}>
                    {formatItemsList(order.items)}
                  </div>
                </td>
                <td>{calculateItemCount(order.items)}</td>
                <td>${order.total.toFixed(2)}</td>
                <td className={`status-${order.status}`}>{order.status}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderList;