import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import OrderSearch from './OrderSearch';

describe('OrderSearch Component', () => {
  const mockOnSearch = jest.fn();
  const mockOnClear = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
    mockOnClear.mockClear();
  });

  test('renders search form with all fields', () => {
    render(<OrderSearch onSearch={mockOnSearch} onClear={mockOnClear} />);

    expect(screen.getByLabelText('Customer ID')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
    expect(screen.getByLabelText('Start Date')).toBeInTheDocument();
    expect(screen.getByLabelText('End Date')).toBeInTheDocument();
    expect(screen.getByText('Search Orders')).toBeInTheDocument();
  });

  test('handles form submission with search filters', () => {
    render(<OrderSearch onSearch={mockOnSearch} onClear={mockOnClear} />);

    const customerIdInput = screen.getByLabelText('Customer ID');
    const statusSelect = screen.getByLabelText('Status');
    const searchButton = screen.getByText('Search Orders');

    fireEvent.change(customerIdInput, { target: { value: 'customer-123' } });
    fireEvent.change(statusSelect, { target: { value: 'pending' } });
    fireEvent.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledWith({
      customerId: 'customer-123',
      status: 'pending'
    });
  });

  test('shows clear button when filters are active', () => {
    render(<OrderSearch onSearch={mockOnSearch} onClear={mockOnClear} />);

    const customerIdInput = screen.getByLabelText('Customer ID');
    fireEvent.change(customerIdInput, { target: { value: 'customer-123' } });

    expect(screen.getByText('Clear Filters')).toBeInTheDocument();
  });

  test('handles clear filters', () => {
    render(<OrderSearch onSearch={mockOnSearch} onClear={mockOnClear} />);

    const customerIdInput = screen.getByLabelText('Customer ID');
    fireEvent.change(customerIdInput, { target: { value: 'customer-123' } });

    const clearButton = screen.getByText('Clear Filters');
    fireEvent.click(clearButton);

    expect(mockOnClear).toHaveBeenCalled();
    expect(customerIdInput.value).toBe('');
  });

  test('filters out empty values when searching', () => {
    render(<OrderSearch onSearch={mockOnSearch} onClear={mockOnClear} />);

    const customerIdInput = screen.getByLabelText('Customer ID');
    const statusSelect = screen.getByLabelText('Status');
    const searchButton = screen.getByText('Search Orders');

    fireEvent.change(customerIdInput, { target: { value: 'customer-123' } });
    fireEvent.change(statusSelect, { target: { value: '' } }); // Empty status
    fireEvent.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledWith({
      customerId: 'customer-123'
    });
  });

  test('includes all status options in dropdown', () => {
    render(<OrderSearch onSearch={mockOnSearch} onClear={mockOnClear} />);

    const statusSelect = screen.getByLabelText('Status');
    
    expect(screen.getByDisplayValue('All Statuses')).toBeInTheDocument();
    
    fireEvent.change(statusSelect, { target: { value: 'pending' } });
    expect(statusSelect.value).toBe('pending');
    
    fireEvent.change(statusSelect, { target: { value: 'processing' } });
    expect(statusSelect.value).toBe('processing');
    
    fireEvent.change(statusSelect, { target: { value: 'shipped' } });
    expect(statusSelect.value).toBe('shipped');
    
    fireEvent.change(statusSelect, { target: { value: 'delivered' } });
    expect(statusSelect.value).toBe('delivered');
    
    fireEvent.change(statusSelect, { target: { value: 'cancelled' } });
    expect(statusSelect.value).toBe('cancelled');
  });

  test('handles date range inputs', () => {
    render(<OrderSearch onSearch={mockOnSearch} onClear={mockOnClear} />);

    const startDateInput = screen.getByLabelText('Start Date');
    const endDateInput = screen.getByLabelText('End Date');
    const searchButton = screen.getByText('Search Orders');

    fireEvent.change(startDateInput, { target: { value: '2024-01-01' } });
    fireEvent.change(endDateInput, { target: { value: '2024-12-31' } });
    fireEvent.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledWith({
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    });
  });
});