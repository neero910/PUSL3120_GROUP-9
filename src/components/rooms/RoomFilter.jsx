function RoomFilter({
  types,
  statuses,
  housekeepingList,
  floors,
  selectedType,
  selectedStatus,
  selectedHkStatus,
  selectedFloor,
  searchTerm,
  viewMode,
  onTypeChange,
  onStatusChange,
  onHkStatusChange,
  onFloorChange,
  onSearchChange,
  onViewModeChange,
  onResetFilters,
  onAddRoom
}) {
  const hasActiveFilters = searchTerm ||
    selectedType !== 'All' ||
    selectedStatus !== 'All' ||
    selectedHkStatus !== 'All' ||
    selectedFloor !== 'All Floors'

  return (
    <div className="room-toolbar-container">
      {/* Top Filter Row */}
      <div className="toolbar row-gap">
        <div className="search-box">
          <span>⌕</span>
          <input
            type="text"
            placeholder="Search room #, guest, or amenities..."
            aria-label="Search rooms"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <select
          value={selectedType}
          onChange={(event) => onTypeChange(event.target.value)}
          aria-label="Filter by room type"
        >
          {types.map((type) => (
            <option key={type} value={type}>
              {type === 'All' ? 'All Types' : type}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(event) => onStatusChange(event.target.value)}
          aria-label="Filter by room status"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status === 'All' ? 'All Statuses' : status}
            </option>
          ))}
        </select>

        <select
          value={selectedFloor}
          onChange={(event) => onFloorChange(event.target.value)}
          aria-label="Filter by floor"
        >
          {floors.map((floor) => (
            <option key={floor} value={floor}>
              {floor}
            </option>
          ))}
        </select>

        <select
          value={selectedHkStatus}
          onChange={(event) => onHkStatusChange(event.target.value)}
          aria-label="Filter by housekeeping status"
        >
          {housekeepingList.map((hk) => (
            <option key={hk} value={hk}>
              {hk === 'All' ? 'All Clean States' : hk}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <button type="button" className="text-button" onClick={onResetFilters}>
            Clear Filters
          </button>
        )}
      </div>

      {/* Bottom Row: View Mode Switcher and Add Room */}
      <div className="room-controls-row">
        <div className="view-mode-toggle" role="group" aria-label="View Mode">
          <button
            type="button"
            className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => onViewModeChange('grid')}
            title="Grid View"
          >
            🔲 Grid View
          </button>
          <button
            type="button"
            className={`view-toggle-btn ${viewMode === 'floorplan' ? 'active' : ''}`}
            onClick={() => onViewModeChange('floorplan')}
            title="Floor Plan View"
          >
            🗺️ Floor Plan
          </button>
          <button
            type="button"
            className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => onViewModeChange('table')}
            title="Table View"
          >
            📋 Table View
          </button>
        </div>

        <button type="button" className="primary-button" onClick={onAddRoom}>
          + Add New Room
        </button>
      </div>
    </div>
  )
}

export default RoomFilter
