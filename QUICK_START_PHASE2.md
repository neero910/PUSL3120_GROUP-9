# QUICK START GUIDE - Phase 2

## 🚀 Getting Started with the Hotel Management System

This guide will help you run the complete system (Frontend + Backend) in under 5 minutes.

---

## Prerequisites

- **Node.js** v14+ ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- Ports **5000** and **5173** available
- Terminal/Command Prompt

---

## 📋 Step-by-Step Setup

### Step 1: Open First Terminal (Backend Server)

```bash
cd "c:\xampp\htdocs\fullstack assignment\PUSL3120_GROUP 9\server"
npm install
npm start
```

**Expected Output:**
```
> hotel-safron-api@1.0.0 start
> node server.js

🚀 Hotel Management API running on http://localhost:5000
📡 CORS enabled for: http://localhost:5173
🔧 Environment: development
```

✅ **Backend is running!** Keep this terminal open.

---

### Step 2: Open Second Terminal (Frontend Server)

```bash
cd "c:\xampp\htdocs\fullstack assignment\PUSL3120_GROUP 9"
npm install
npm run dev
```

**Expected Output:**
```
  VITE v8.2.0  ready in 523 ms

  ➜  Local:   http://localhost:5173/
  ➜  Press h + enter to show help
```

✅ **Frontend is running!** Keep this terminal open.

---

### Step 3: Open in Browser

Click or navigate to: **http://localhost:5173**

You will be automatically redirected to the login page.

---

## 🔐 Login

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Administrator | `admin@hotel.com` | `password123` |
| Manager | `manager@hotel.com` | `password123` |
| Receptionist | `receptionist@hotel.com` | `password123` |

**Use any of the above to log in.**

---

## 📍 What You Can Do

After logging in, you can:

### Dashboard
- View system statistics
- See occupancy rates
- Check today's check-ins/check-outs
- View revenue information

### Rooms Management
- View all rooms
- Create new rooms (admin/manager)
- Edit room details
- Delete rooms (admin/manager)
- See occupancy statistics

### Guests Management
- View all registered guests
- Add new guests
- Edit guest information
- View guest details

### Reservations
- View all reservations
- Create new reservations
- Update existing reservations
- Cancel reservations
- System prevents double-booking automatically

### Other Features
- Housekeeping Operations
- Check-In/Check-Out
- Restaurant Management
- Payments & Invoices
- Reports
- User Management

---

## 🔌 Testing the API (Optional)

### Using cURL or Postman

**1. Health Check:**
```bash
curl http://localhost:5000/api/health
```

**2. Login & Get Token:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hotel.com","password":"password123"}'
```

Copy the `token` from the response.

**3. Use Token to Access Protected Routes:**
```bash
# Replace YOUR_TOKEN with the actual token
curl -X GET http://localhost:5000/api/rooms \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🛑 Stopping the System

To stop both servers:

1. **Backend Terminal:** Press `Ctrl+C`
2. **Frontend Terminal:** Press `Ctrl+C`

Or close both terminal windows.

---

## ⚠️ Common Issues & Solutions

### Issue: Port 5000 already in use
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <PID> /F
```

### Issue: Cannot connect to backend from frontend
- Make sure backend server is running (`http://localhost:5000`)
- Check that `.env` file has `VITE_API_BASE_URL=http://localhost:5000/api`
- Verify CORS is enabled (you should see it in backend output)

### Issue: Login fails
- Make sure backend server is running
- Check that you're using correct credentials (listed above)
- Try registering a new account on the login page

### Issue: Cannot install dependencies
```bash
# Clear npm cache and try again
npm cache clean --force
npm install
```

---

## 📚 Documentation

- **Full API Documentation:** [PHASE2_API_DOCUMENTATION.md](PHASE2_API_DOCUMENTATION.md)
- **Completion Summary:** [PHASE2_COMPLETION_SUMMARY.md](PHASE2_COMPLETION_SUMMARY.md)
- **Project README:** [README.md](README.md)

---

## 🎯 Next Steps

Once you're comfortable with Phase 2:

1. Explore the API endpoints
2. Test CRUD operations
3. Try different user roles
4. Read the complete API documentation
5. Review the code structure

Phase 3 will add:
- Database persistence (MongoDB)
- Testing framework (Jest)
- Real-time updates (WebSockets)
- Advanced features

---

## 📞 Support

If you encounter issues:

1. **Check the error message** - It usually tells you what went wrong
2. **Verify ports** - Ensure 5000 and 5173 are not in use
3. **Check .env files** - Ensure environment variables are correct
4. **Read documentation** - Check [PHASE2_API_DOCUMENTATION.md](PHASE2_API_DOCUMENTATION.md)
5. **Review code comments** - Controllers and services are well-commented

---

**🎉 Congratulations! Your Hotel Management System is running!**

For more information, see [PHASE2_COMPLETION_SUMMARY.md](PHASE2_COMPLETION_SUMMARY.md)
