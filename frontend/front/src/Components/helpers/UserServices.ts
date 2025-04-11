const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL; // Cambia esto a la URL de tu API

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
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        // Manejo de errores
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear el usuario");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },
};
