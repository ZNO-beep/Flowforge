/**
 * Performs a search on all items based on the search query
 * @param {Object} params - Parameters for searching
 * @returns {Array} Search results
 */
export const performSearch = ({
  searchQuery,
  allItems,
  setSearchResults,
  setIsSearching
}) => {
  if (!searchQuery.trim()) {
    setSearchResults([]);
    return [];
  }
  
  setIsSearching(true);
  
  const query = searchQuery.toLowerCase();
  const results = allItems.filter(item => 
    item.name.toLowerCase().includes(query) || 
    (item.description && item.description.toLowerCase().includes(query))
  );
  
  setSearchResults(results);
  setIsSearching(false);
  
  return results;
};

/**
 * Clears the search query and results
 * @param {Object} params - Parameters for clearing search
 * @returns {void}
 */
export const clearSearch = ({
  setSearchQuery,
  setSearchResults
}) => {
  setSearchQuery('');
  setSearchResults([]);
};

/**
 * Gets type-specific styling for search results
 * @param {string} type - Type of the item (department, role, function)
 * @returns {string} CSS class names for styling
 */
export const getTypeStyles = (type) => {
  switch (type) {
    case 'department':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'role':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'function':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
}; 