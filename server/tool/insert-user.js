import mongoose from 'mongoose';
import User from '../src/models/user.model.js';
import configs from '../src/configs.js';

// Kết nối đến MongoDB
mongoose.connect(configs.mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
    insertUser(); // Gọi hàm insertUser khi kết nối thành công
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
  });

async function insertUser() {
  try {
    const userData = {
      _id: mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),  // Một ObjectId hợp lệ với chuỗi hex 24 ký tự
      firstName: 'John',
      lastName: 'Doe',
      gender: 'male',
      dob: new Date('1990-01-01T00:00:00Z'), 
      email: 'admin@example.com',
      phone: '0974117373',
      username: 'admin',
      password: "$2b$10$tehb4MM8EhTA9PICl9LRNOCSOVEgX25vFwKqyG6qiDVb76DeQtT62",
      role: 'admin',
      addresses: [],
      status: 'active',
      avatar: 'https://example.com/avatar/johndoe.jpg'
    };

    // Tạo một tài khoản người dùng mới
    const newUser = new User(userData);

    // Lưu vào MongoDB
    await newUser.save();
    console.log(`Inserted user: ${newUser.username}`);
  } catch (error) {
    console.error('Error inserting user:', error);
  } finally {
    mongoose.connection.close(); // Đóng kết nối sau khi hoàn thành
  }
}
