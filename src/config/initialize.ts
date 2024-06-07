export { };
import { User } from "../models";
const bcrypt = require("bcryptjs");

exports.test = async () => {
  try {
    const existingAdmin = await User.countDocuments({ role: 'admin' });
    // Check if there are less than 1 admin, create the default ones
    if (existingAdmin < 1) {
      await new User(
        {
          email: 'rania@gmail.com',
          password: await bcrypt.hash('rania', 12),
          role: 'admin',
          phoneNumber: '12345678',
          name: 'defaultAdmin',
          adress: 'sahloul',
        }).save();
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
}