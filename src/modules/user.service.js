import User from "./user.model.js";
import bcrypt from "bcryptjs";

export const createUser = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  return await User.create({
    ...data,
    password: hashedPassword,
  });
};

export const findUserByEmail = async (email) => {
  return User.findOne({ email });
};

export const getUserById = async (id) => {
  return User.findById(id).select("-password");
};

export const updateUser = async (id, data) => {
  // prevent password overwrite accidentally
  if (data.password) {
    delete data.password;
  }

  return User.findByIdAndUpdate(id, data, {
    new: true,
  }).select("-password");
};

