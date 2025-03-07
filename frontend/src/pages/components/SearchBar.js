import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Loader2, Search, X } from 'lucide-react';

/**
 * Search input component
 * @param {Object} props - Component props
 * @param {string} props.searchQuery - Current search query
 * @param {Function} props.setSearchQuery - Function to update search query
 * @param {Function} props.handleSearch - Function to handle search
 * @param {Function} props.clearSearch - Function to clear search
 * @returns {JSX.Element} Component JSX
 */
const SearchInput = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  clearSearch
}) => (
  <div className="relative flex-1">
    <Input
      placeholder="Search departments, roles, or functions..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      className="pl-10"
    />
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
    {searchQuery && (
      <button 
        onClick={clearSearch}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        <X className="h-4 w-4" />
      </button>
    )}
  </div>
);

SearchInput.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  clearSearch: PropTypes.func.isRequired
};

/**
 * Search button component
 * @param {Object} props - Component props
 * @param {Function} props.onClick - Function to call when the button is clicked
 * @param {boolean} props.isSearching - Whether search is in progress
 * @returns {JSX.Element} Component JSX
 */
const SearchButton = ({ onClick, isSearching }) => (
  <Button onClick={onClick} disabled={isSearching}>
    {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
  </Button>
);

SearchButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  isSearching: PropTypes.bool.isRequired
};

/**
 * Search bar component for the OrgStructurePage
 * @param {Object} props - Component props
 * @param {string} props.searchQuery - Current search query
 * @param {Function} props.setSearchQuery - Function to update search query
 * @param {Function} props.handleSearch - Function to handle search
 * @param {Function} props.clearSearch - Function to clear search
 * @param {boolean} props.isSearching - Whether search is in progress
 * @returns {JSX.Element} Component JSX
 */
const SearchBar = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  clearSearch,
  isSearching
}) => (
  <div className="mb-6 flex gap-2">
    <SearchInput
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      handleSearch={handleSearch}
      clearSearch={clearSearch}
    />
    <SearchButton onClick={handleSearch} isSearching={isSearching} />
  </div>
);

SearchBar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  clearSearch: PropTypes.func.isRequired,
  isSearching: PropTypes.bool.isRequired
};

export default SearchBar; 