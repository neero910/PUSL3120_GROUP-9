import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import RoomFilter from '../components/rooms/RoomFilter'
import RoomCard from '../components/rooms/RoomCard'
import FloorPlanView from '../components/rooms/FloorPlanView'
import RoomTableView from '../components/rooms/RoomTableView'
import RoomDetailsModal from '../components/rooms/RoomDetailsModal'
import RoomFormModal from '../components/rooms/RoomFormModal'
import {
  rooms as initialRooms,
  roomTypes,
  roomStatuses,
  housekeepingStatuses,
  roomFloors
} from '../data/rooms'
import { roomsApi } from '../services/api'

function Rooms() {
  const [roomList, setRoomList] = useState(initialRooms)
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'floorplan' | 'table'
  const [isLoading, setIsLoading] = useState(true)

  // Filter States
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedHkStatus, setSelectedHkStatus] = useState('All')
  const [selectedFloor, setSelectedFloor] = useState('All Floors')

  // Modals & Notifications
  const [selectedRoomDetails, setSelectedRoomDetails] = useState(null)
  const [roomToEdit, setRoomToEdit] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Load rooms from API on mount
  useEffect(() => {
    let isMounted = true
    setIsLoading(true)

    roomsApi.getAll()
      .then((res) => {
        if (!isMounted) return
        const data = res?.data || (Array.isArray(res) ? res : initialRooms)
        if (Array.isArray(data) && data.length > 0) {
          setRoomList(data)
        }
      })
      .catch((err) => {
        console.warn('Could not fetch rooms from API, using fallback:', err)
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  // Quick Status change directly from card, table, or modal
  const handleQuickStatusChange = async (roomId, newStatus) => {
    let newHkStatus
    if (newStatus === 'Cleaning') newHkStatus = 'In Progress'
    else if (newStatus === 'Available') newHkStatus = 'Clean & Ready'
    else if (newStatus === 'Maintenance') newHkStatus = 'Out of Order'

    // Optimistic UI update
    setRoomList(prev => prev.map(room => {
      if (String(room.id) === String(roomId) || String(room.roomNumber) === String(roomId)) {
        const updated = {
          ...room,
          status: newStatus,
          housekeepingStatus: newHkStatus || room.housekeepingStatus
        }
        if (selectedRoomDetails && (String(selectedRoomDetails.id) === String(roomId) || String(selectedRoomDetails.roomNumber) === String(roomId))) {
          setSelectedRoomDetails(updated)
        }
        return updated
      }
      return room
    }))

    try {
      const res = await roomsApi.updateStatus(roomId, newStatus, newHkStatus)
      if (res?.data) {
        setRoomList(prev => prev.map(r => (String(r.id) === String(res.data.id) ? res.data : r)))
        if (selectedRoomDetails && String(selectedRoomDetails.id) === String(res.data.id)) {
          setSelectedRoomDetails(res.data)
        }
      }
      showToast(`Room status updated to ${newStatus}`)
    } catch (error) {
      console.warn('API updateStatus failed, relying on local update:', error)
      showToast(`Room status updated to ${newStatus}`)
    }
  }

  // Save new or edited room
  const handleSaveRoom = async (roomData, isEditing) => {
    if (isEditing) {
      // Optimistic update
      setRoomList(prev => prev.map(r => String(r.id) === String(roomData.id) ? roomData : r))
      showToast(`Room ${roomData.roomNumber} details updated successfully`)

      try {
        const res = await roomsApi.update(roomData.id, roomData)
        if (res?.data) {
          setRoomList(prev => prev.map(r => String(r.id) === String(res.data.id) ? res.data : r))
        }
      } catch (err) {
        console.warn('API update failed, local state maintained:', err)
      }
    } else {
      // Optimistic add
      setRoomList(prev => [roomData, ...prev])
      showToast(`New Room ${roomData.roomNumber} created successfully`)

      try {
        const res = await roomsApi.create(roomData)
        if (res?.data) {
          setRoomList(prev => [res.data, ...prev.filter(r => String(r.id) !== String(roomData.id))])
        }
      } catch (err) {
        console.warn('API create failed, local state maintained:', err)
      }
    }
  }

  const handleResetFilters = () => {
    setSearchTerm('')
    setSelectedType('All')
    setSelectedStatus('All')
    setSelectedHkStatus('All')
    setSelectedFloor('All Floors')
  }

  // Filtered rooms logic
  const filteredRooms = useMemo(() => {
    return roomList.filter((room) => {
      const normalizedSearch = searchTerm.trim().toLowerCase()
      const matchesSearch = !normalizedSearch ||
        room.roomNumber.toLowerCase().includes(normalizedSearch) ||
        room.type.toLowerCase().includes(normalizedSearch) ||
        (room.currentGuest && room.currentGuest.toLowerCase().includes(normalizedSearch)) ||
        (room.amenities && room.amenities.some(a => a.toLowerCase().includes(normalizedSearch)))

      const matchesType = selectedType === 'All' || room.type === selectedType
      const matchesStatus = selectedStatus === 'All' || room.status === selectedStatus
      const matchesHk = selectedHkStatus === 'All' || room.housekeepingStatus === selectedHkStatus
      const matchesFloor = selectedFloor === 'All Floors' || `Floor ${room.floor}` === selectedFloor

      return matchesSearch && matchesType && matchesStatus && matchesHk && matchesFloor
    })
  }, [roomList, searchTerm, selectedType, selectedStatus, selectedHkStatus, selectedFloor])

  // Count summaries for interactive KPI filter pills
  const totalCount = roomList.length
  const availableCount = roomList.filter(r => r.status === 'Available').length
  const occupiedCount = roomList.filter(r => r.status === 'Occupied').length
  const reservedCount = roomList.filter(r => r.status === 'Reserved').length
  const cleaningCount = roomList.filter(r => r.status === 'Cleaning').length
  const maintenanceCount = roomList.filter(r => r.status === 'Maintenance').length

  return (
    <div className="page-stack">
      {toastMessage && (
        <div className="toast-notification" role="status">
          <span>✨</span>
          <div>{toastMessage}</div>
        </div>
      )}

      <PageHeader
        title="Rooms Management"
        subtitle="Inventory control, real-time occupancy status, room configurations and rates"
        actions={
          <button
            type="button"
            className="primary-button"
            onClick={() => setShowAddModal(true)}
          >
            + Add New Room
          </button>
        }
      />

      {/* Interactive Quick KPI Filter Pills */}
      <div className="room-kpi-pills-bar">
        <button
          type="button"
          className={`kpi-pill ${selectedStatus === 'All' ? 'active' : ''}`}
          onClick={() => setSelectedStatus('All')}
        >
          <span>All Rooms</span>
          <strong>{totalCount}</strong>
        </button>

        <button
          type="button"
          className={`kpi-pill kpi-pill-available ${selectedStatus === 'Available' ? 'active' : ''}`}
          onClick={() => setSelectedStatus('Available')}
        >
          <span>Available</span>
          <strong>{availableCount}</strong>
        </button>

        <button
          type="button"
          className={`kpi-pill kpi-pill-occupied ${selectedStatus === 'Occupied' ? 'active' : ''}`}
          onClick={() => setSelectedStatus('Occupied')}
        >
          <span>Occupied</span>
          <strong>{occupiedCount}</strong>
        </button>

        <button
          type="button"
          className={`kpi-pill kpi-pill-reserved ${selectedStatus === 'Reserved' ? 'active' : ''}`}
          onClick={() => setSelectedStatus('Reserved')}
        >
          <span>Reserved</span>
          <strong>{reservedCount}</strong>
        </button>

        <button
          type="button"
          className={`kpi-pill kpi-pill-cleaning ${selectedStatus === 'Cleaning' ? 'active' : ''}`}
          onClick={() => setSelectedStatus('Cleaning')}
        >
          <span>Cleaning</span>
          <strong>{cleaningCount}</strong>
        </button>

        <button
          type="button"
          className={`kpi-pill kpi-pill-maintenance ${selectedStatus === 'Maintenance' ? 'active' : ''}`}
          onClick={() => setSelectedStatus('Maintenance')}
        >
          <span>Maintenance</span>
          <strong>{maintenanceCount}</strong>
        </button>
      </div>

      {/* Modern Filter Toolbar */}
      <RoomFilter
        types={roomTypes}
        statuses={roomStatuses}
        housekeepingList={housekeepingStatuses}
        floors={roomFloors}
        selectedType={selectedType}
        selectedStatus={selectedStatus}
        selectedHkStatus={selectedHkStatus}
        selectedFloor={selectedFloor}
        searchTerm={searchTerm}
        viewMode={viewMode}
        onTypeChange={setSelectedType}
        onStatusChange={setSelectedStatus}
        onHkStatusChange={setSelectedHkStatus}
        onFloorChange={setSelectedFloor}
        onSearchChange={setSearchTerm}
        onViewModeChange={setViewMode}
        onResetFilters={handleResetFilters}
        onAddRoom={() => setShowAddModal(true)}
      />

      {/* Render Active View Mode */}
      {viewMode === 'grid' && (
        <div className="room-grid">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onSelectRoom={(r) => setSelectedRoomDetails(r)}
              onEditRoom={(r) => setRoomToEdit(r)}
              onQuickStatusChange={handleQuickStatusChange}
            />
          ))}

          {filteredRooms.length === 0 && !isLoading && (
            <div className="empty-state full-width">
              <strong>No rooms found matching your filters</strong>
              <span>Try clearing search term or status filters</span>
            </div>
          )}
        </div>
      )}

      {viewMode === 'floorplan' && (
        <FloorPlanView
          rooms={filteredRooms}
          onSelectRoom={(r) => setSelectedRoomDetails(r)}
          onQuickStatusChange={handleQuickStatusChange}
        />
      )}

      {viewMode === 'table' && (
        <RoomTableView
          rooms={filteredRooms}
          onSelectRoom={(r) => setSelectedRoomDetails(r)}
          onEditRoom={(r) => setRoomToEdit(r)}
          onQuickStatusChange={handleQuickStatusChange}
        />
      )}

      {/* MODALS */}
      {selectedRoomDetails && (
        <RoomDetailsModal
          room={selectedRoomDetails}
          onClose={() => setSelectedRoomDetails(null)}
          onEdit={(r) => setRoomToEdit(r)}
          onQuickStatusChange={handleQuickStatusChange}
        />
      )}

      {(showAddModal || roomToEdit) && (
        <RoomFormModal
          roomToEdit={roomToEdit}
          onClose={() => {
            setShowAddModal(false)
            setRoomToEdit(null)
          }}
          onSave={handleSaveRoom}
        />
      )}
    </div>
  )
}

export default Rooms
