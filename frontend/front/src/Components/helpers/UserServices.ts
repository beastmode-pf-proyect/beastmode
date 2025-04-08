import axios from 'axios';

const API_URL = 'http://localhost:3001'; // Cambia esto a la URL de tu API

export interface UserData {
  name: string;
  email: string;
  imageUrl?: string | null;
  role?: string;
  isActive?: boolean;
}

export const userService = {
  createUser: async (userData: UserData) => {
    try {
      const response = await axios.post(`${API_URL}/users`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};