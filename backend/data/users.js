/**
 * Temporary Users Data Store
 * Phase 2: In-Memory Storage (Will be replaced by MongoDB in Phase 3)
 */

export let users = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@hotel.com',
    password: '$2a$10$DRpFIHM23kdiDcvfsNx0OOQWR164sgruXvwJeDBQpAp/xq4A4I.pS', // hashed: password123
    role: 'Administrator',
    status: 'Active',
    createdAt: '2026-01-15'
  },
  {
    id: '2',
    name: 'Manager User',
    email: 'manager@hotel.com',
    password: '$2a$10$DRpFIHM23kdiDcvfsNx0OOQWR164sgruXvwJeDBQpAp/xq4A4I.pS', // hashed: password123
    role: 'Manager',
    status: 'Active',
    createdAt: '2026-01-15'
  },
  {
    id: '3',
    name: 'Receptionist User',
    email: 'receptionist@hotel.com',
    password: '$2a$10$DRpFIHM23kdiDcvfsNx0OOQWR164sgruXvwJeDBQpAp/xq4A4I.pS', // hashed: password123
    role: 'Receptionist',
    status: 'Active',
    createdAt: '2026-01-15'
  }
];

export function addUser(user) {
  const newUser = {
    id: String(Math.max(...users.map(u => parseInt(u.id) || 0)) + 1),
    ...user,
    createdAt: new Date().toISOString().split('T')[0]
  };
  users.push(newUser);
  return newUser;
}

export function findUserByEmail(email) {
  return users.find(u => u.email === email);
}

export function findUserById(id) {
  return users.find(u => u.id === id);
}
