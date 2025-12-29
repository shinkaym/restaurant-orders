import React from 'react';

interface ManagementSearchBarProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  onRefresh: () => void;
}

const ManagementSearchBar: React.FC<ManagementSearchBarProps> = ({ selectedDate, onDateChange, onRefresh }) => {
  // Convert MM-DD-YYYY to YYYY-MM-DD for date input
  const getInputValue = () => {
    const parts = selectedDate.split('-');
    if (parts.length === 3 && parts[0].length === 2) {
      // MM-DD-YYYY format
      return `${parts[2]}-${parts[0]}-${parts[1]}`;
    }
    return selectedDate;
  };

  // Convert YYYY-MM-DD to MM-DD-YYYY when changed
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [year, month, day] = e.target.value.split('-');
    onDateChange(`${month}-${day}-${year}`);
  };

  return (
    <div className="search-bar">
      <i className="fas fa-calendar"></i>
      <input type="date" value={getInputValue()} onChange={handleDateChange} />
      <button className="refresh-btn" onClick={onRefresh} title="Refresh data">
        <i className="fas fa-redo"></i>
      </button>
    </div>
  );
};

export default ManagementSearchBar;
