import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowRight } from 'lucide-react';

/**
 * Search result item component
 * @param {Object} props - Component props
 * @param {Object} props.item - Search result item data
 * @param {Function} props.onSelect - Function to call when item is selected
 * @returns {JSX.Element} Component JSX
 */
const SearchResultItem = ({ item, onSelect }) => (
  <Card className="mb-2 hover:bg-gray-50 transition-colors">
    <CardContent className="p-4 flex justify-between items-center">
      <div>
        <h4 className="font-medium">{item.name}</h4>
        <div className="flex gap-2 mt-1">
          <Badge variant="outline">{item.type}</Badge>
          {item.department && (
            <Badge variant="secondary">{item.department}</Badge>
          )}
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={() => onSelect(item)}>
        View <ArrowRight className="ml-1 h-4 w-4" />
      </Button>
    </CardContent>
  </Card>
);

SearchResultItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    department: PropTypes.string
  }).isRequired,
  onSelect: PropTypes.func.isRequired
};

/**
 * Empty search results component
 * @returns {JSX.Element} Component JSX
 */
const EmptySearchResults = () => (
  <div className="text-center py-8 text-gray-500">
    <p>No results found. Try a different search term.</p>
  </div>
);

/**
 * Search results component for the OrgStructurePage
 * @param {Object} props - Component props
 * @param {Array} props.searchResults - Array of search result items
 * @param {boolean} props.isSearching - Whether search is in progress
 * @param {Function} props.handleSelectSearchResult - Function to handle selecting a search result
 * @returns {JSX.Element} Component JSX
 */
const SearchResults = ({ searchResults, isSearching, handleSelectSearchResult }) => {
  if (isSearching) {
    return (
      <Card>
        <CardContent className="p-4 text-center py-8 text-gray-500">
          <p>Searching...</p>
        </CardContent>
      </Card>
    );
  }

  if (!searchResults || searchResults.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Search Results ({searchResults.length})</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {searchResults.length === 0 ? (
          <EmptySearchResults />
        ) : (
          searchResults.map((item) => (
            <SearchResultItem
              key={item.id}
              item={item}
              onSelect={handleSelectSearchResult}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};

SearchResults.propTypes = {
  searchResults: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      department: PropTypes.string
    })
  ),
  isSearching: PropTypes.bool.isRequired,
  handleSelectSearchResult: PropTypes.func.isRequired
};

export default SearchResults; 