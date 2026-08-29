# Hotel Safron – Phase 1 Frontend Skeleton

## Component Tree

App
├── MainLayout
│   ├── Sidebar
│   ├── Header
│   └── Page Content
│
├── Dashboard
│   ├── StatCard
│   ├── OccupancyChart
│   ├── TodayActivity
│   └── RecentReservations
│
├── Rooms
│   ├── PageHeader
│   ├── KPI Pill Filters
│   ├── RoomFilter
│   ├── RoomCard (Grid View)
│   ├── FloorPlanView (Spatial Matrix)
│   ├── RoomTableView (Dense Table)
│   ├── RoomDetailsModal
│   └── RoomFormModal
│
├── Housekeeping
│   ├── PageHeader
│   ├── KPI Summary Cards
│   ├── HousekeepingTaskCard (Kanban Board)
│   ├── CleaningChecklistModal
│   ├── AssignStaffModal
│   ├── NewMaintenanceModal
│   ├── Staff Roster & Workload
│   ├── Maintenance & Damage Log
│   └── Linen & Supplies Inventory
│
├── Guests
│   └── GuestTable
│
├── Reservations
│   └── ReservationTable
│
├── Check-In
│   └── Form Panel
│
├── Check-Out
│   └── Checkout Summary
│
├── Restaurant
│   ├── Category List
│   └── Order Summary
│
├── Payments
│   └── Payment Table
│
├── Invoices
│   └── Invoice Table
│
├── Reports
│   └── KPI Cards
│
└── Users
    └── User Table

## Planned Future Architecture

React Frontend
      ↓
REST API
      ↓
Node.js + Express
      ↓
Mongoose
      ↓
MongoDB

## Scope Notes

This phase is intentionally limited to a static frontend skeleton. No database, API, authentication, Docker, or WebSocket layers were implemented.
