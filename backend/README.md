# Hotel Management System - Express Backend Server

## Overview

This is the Node.js + Express backend server for the Hotel Management System Phase 2 (API Integration).

**Status:** Phase 2 - REST API Implementation
**Data Storage:** Temporary in-memory (will be upgraded to MongoDB in Phase 3)

---

## Project Structure

```
server/
├── controllers/
│   ├── authController.js          # Authentication logic
│   ├── roomController.js          # Rooms CRUD operations
│   ├── guestController.js         # Guests CRUD operations
│   ├── reservationController.js   # Reservations CRUD operations
│   └── dashboardController.js     # Dashboard summary data
├── routes/
│   ├── authRoutes.js              # Auth endpoints
│   ├── roomRoutes.js              # Rooms endpoints
│   ├── guestRoutes.js             # Guests endpoints
│   ├── reservationRoutes.js       # Reservations endpoints
│   └── dashboardRoutes.js         # Dashboard endpoints
├── middleware/
│   ├── authMiddleware.js          # JWT verification & role authorization
│   └── errorMiddleware.js         # Error handling utilities
├── data/
│   ├── users.js                   # Temporary users data
│   ├── rooms.js                   # Temporary rooms data
│   ├── guests.js                  # Temporary guests data
│   └── reservations.js            # Temporary reservations data
├── server.js                       # Express app setup & server start
├── package.json                    # Dependencies
├── .env                            # Environment variables (local)
├── .env.example                    # Example environment variables
└── README.md                       # This file
```

---

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

This installs:
- **express** - Web framework
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Environment variable management
- **jsonwebtoken** - JWT token generation and verification
- **bcryptjs** - Password hashing

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_SECRET=hotel_management_secret_key_2026
```

### 3. Start the Server

**Development Mode (with auto-restart on file changes):**

```bash
npm run dev
```

**Production Mode:**

```bash
npm start
```

The server will start on `http://localhost:5000`

---

## API Endpoints Summary

### Health Check
- **GET** `/api/health` - Server status

### Authentication
- **POST** `/api/auth/register` - Register new user
- **POST** `/api/auth/login` - Login user
- **POST** `/api/auth/verify` - Verify JWT token
- **GET** `/api/auth/me` - Get current user (requires auth)

### Rooms (CRUD)
- **GET** `/api/rooms` - Get all rooms
- **GET** `/api/rooms/:id` - Get room by ID
- **POST** `/api/rooms` - Create room (admin/manager)
- **PUT** `/api/rooms/:id` - Update room (admin/manager)
- **DELETE** `/api/rooms/:id` - Delete room (admin/manager)
- **GET** `/api/rooms/stats/summary` - Room statistics

### Guests (CRUD)
- **GET** `/api/guests` - Get all guests
- **GET** `/api/guests/:id` - Get guest by ID
- **POST** `/api/guests` - Create guest (receptionist+)
- **PUT** `/api/guests/:id` - Update guest (receptionist+)
- **DELETE** `/api/guests/:id` - Delete guest (admin/manager)
- **GET** `/api/guests/stats/summary` - Guest statistics

### Reservations (CRUD)
- **GET** `/api/reservations` - Get all reservations
- **GET** `/api/reservations/:id` - Get reservation by ID
- **POST** `/api/reservations` - Create reservation (receptionist+)
- **PUT** `/api/reservations/:id` - Update reservation (receptionist+)
- **DELETE** `/api/reservations/:id` - Cancel reservation (admin/manager)
- **GET** `/api/reservations/guest/:guestId` - Get guest reservations
- **GET** `/api/reservations/stats/summary` - Reservation statistics

### Dashboard
- **GET** `/api/dashboard/summary` - Summary statistics (auth required)
- **GET** `/api/dashboard/occupancy` - Occupancy by room type (auth required)
- **GET** `/api/dashboard/revenue` - Revenue data (auth required)

---

## Default Test Credentials

Three demo users are pre-configured:

### Administrator
```
Email: admin@hotel.com
Password: password123
Role: Administrator
```

### Manager
```
Email: manager@hotel.com
Password: password123
Role: Manager
```

### Receptionist
```
Email: receptionist@hotel.com
Password: password123
Role: Receptionist
```

---

## Authentication Flow

1. **Register/Login**
   ```bash
   POST /api/auth/login
   Body: { "email": "admin@hotel.com", "password": "password123" }
   Response: { "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
   ```

2. **Store Token**
   - Frontend stores token in localStorage
   - Attach to all subsequent requests

3. **Make Authenticated Request**
   ```bash
   GET /api/rooms
   Header: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **Token Verification**
   - Middleware verifies JWT signature
   - Extracts user information
   - Checks user role for authorization

---

## User Roles & Permissions

| Action | Administrator | Manager | Receptionist | Restaurant Staff |
|--------|---|---|---|---|
| Create/Edit/Delete Rooms | ✅ | ✅ | ❌ | ❌ |
| Create/Edit Guests | ✅ | ✅ | ✅ | ❌ |
| Delete Guests | ✅ | ✅ | ❌ | ❌ |
| Create/Edit Reservations | ✅ | ✅ | ✅ | ❌ |
| Cancel Reservations | ✅ | ✅ | ❌ | ❌ |
| View Dashboard | ✅ | ✅ | ❌ | ❌ |
| Manage Users | ✅ | ❌ | ❌ | ❌ |

---

## Testing with cURL

### 1. Check Server Health
```bash
curl http://localhost:5000/api/health
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@hotel.com",
    "password": "password123"
  }'
```

### 3. Get Rooms (using token from login response)
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/rooms
```

### 4. Create a Room
```bash
curl -X POST http://localhost:5000/api/rooms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "roomNumber": "301",
    "type": "Standard",
    "capacity": 2,
    "price": 10000,
    "floor": 3
  }'
```

### 5. Get Dashboard Summary
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/dashboard/summary
```

---

## Error Handling

All error responses include a `success: false` flag and descriptive message:

```json
{
  "success": false,
  "message": "Room is already reserved for the selected dates"
}
```

HTTP Status Codes:
- **200** - OK
- **201** - Created
- **400** - Bad Request (validation error)
- **401** - Unauthorized (invalid/missing token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found
- **409** - Conflict (business rule violation)
- **500** - Internal Server Error

---

## Features Implemented

### ✅ Phase 2 Complete

- [x] Express server setup with CORS
- [x] JWT authentication (register/login)
- [x] Password hashing with bcryptjs
- [x] Role-based access control (RBAC)
- [x] Rooms CRUD API
- [x] Guests CRUD API
- [x] Reservations CRUD with double-booking prevention
- [x] Dashboard summary endpoint
- [x] Input validation
- [x] Error handling middleware
- [x] Temporary in-memory data storage
- [x] API documentation
- [x] Environment configuration

### ❌ Phase 3 (Not Implemented)

- [ ] MongoDB integration
- [ ] Mongoose schemas
- [ ] Data persistence
- [ ] Advanced validation
- [ ] Logging system
- [ ] Rate limiting
- [ ] JWT refresh tokens

---

## Important Notes

### Data Persistence

⚠️ **IMPORTANT:** This Phase 2 implementation uses temporary in-memory data storage.

- All data is stored in JavaScript arrays in memory
- Data will be **lost when the server restarts**
- Suitable for testing and development only
- **NOT suitable for production**

MongoDB integration will be added in Phase 3 for persistent storage.

### Security Considerations

✅ **Implemented:**
- Passwords hashed with bcryptjs (10 rounds)
- JWT tokens signed with secret key
- CORS protection
- Role-based authorization

⚠️ **To Improve (Phase 3+):**
- HTTPS enforcement
- Rate limiting
- Input sanitization
- SQL injection prevention (when using database)
- API key management
- Logging and monitoring
- Secrets management in production

---

## Debugging

### Enable Debug Output

Set `NODE_ENV=development` in `.env` to see detailed error messages.

### Check Server Logs

The server logs all requests and errors to the console:

```
🚀 Hotel Management API running on http://localhost:5000
📡 CORS enabled for: http://localhost:5173
🔧 Environment: development
```

### Verify Token Expiry

JWT tokens expire after 24 hours. Expired tokens will return 401 Unauthorized.

---

## Troubleshooting

### Port Already in Use

If port 5000 is already in use:

```bash
# Change port in .env
PORT=5001
```

Or kill the process using the port:

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### CORS Errors

Ensure `CLIENT_URL` in `.env` matches your frontend URL:

```env
CLIENT_URL=http://localhost:5173
```

### Authentication Issues

1. Check token is being sent: `Authorization: Bearer <token>`
2. Verify token hasn't expired (24 hour limit)
3. Check user role has permission for the action
4. Ensure `JWT_SECRET` is the same in `.env`

---

## Next Steps (Phase 3)

1. Replace temporary data storage with MongoDB
2. Implement Mongoose models
3. Add data validation with Joi or Yup
4. Add logging system (Winston/Morgan)
5. Implement JWT refresh tokens
6. Add rate limiting
7. Add request sanitization
8. Write comprehensive tests
9. Deploy to production server

---

## Support

For issues or questions about the API:
- Check the API documentation: `PHASE2_API_DOCUMENTATION.md`
- Review error messages in server logs
- Check user role permissions
- Verify network connectivity to `http://localhost:5000`

---

## License

ISC

## Author

Group 9 - PUSL3120
