import User from '../models/User.js';

export async function getUsers(req, res, next) {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    return next(error);
  }
}