import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../models/User';
import { axiosInstance } from '../config/supabase';

interface UsersState {
  Users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  Users: [],
  loading: false,
  error: null,
};

// FETCH (Read All)
export const fetchUsers = createAsyncThunk('Users/fetchUsers', async () => {
  const response = await axiosInstance.get<User[]>('User?select=*&order=id.desc');
  return response.data;
});

// FETCH by ID
export const fetchUserById = createAsyncThunk('Users/fetchUserById', async (userId: string) => {
  const response = await axiosInstance.get<User[]>(`User?select=*&id=eq.${userId}`);
  if (response.data && response.data.length > 0) {
    return response.data[0];
  }
  throw new Error('Usuario no encontrado');
});

// CREATE
export const createUser = createAsyncThunk('Users/createUser', async (newUser: Omit<User, 'id'>) => {
  const userToSend: any = {
    id: crypto.randomUUID(),
    username: (newUser.username || '').trim(),
    email: (newUser.email || '').trim(),
    fullName: (newUser.fullName || '').trim(),
    photo: newUser.photo || null,
    phone: (newUser.phone || '').trim(),
    address: (newUser.address || '').trim(),
    location: (newUser.location || '').trim(),
  };
  
  if (!userToSend.username || !userToSend.email || !userToSend.fullName) {
    throw new Error('El nombre de usuario, email y nombre completo son campos requeridos');
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userToSend.email)) {
    throw new Error('El email debe tener un formato válido');
  }
  
  try {
    const response = await axiosInstance.post<User | User[]>('User', userToSend);
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data[0];
    } else if (response.data && typeof response.data === 'object' && 'id' in response.data && !Array.isArray(response.data)) {
      return response.data as User;
    }
    throw new Error('No se recibió el usuario creado');
  } catch (error: any) {
    console.error('Error al crear usuario:', error);
    if (error.response) {
      throw new Error(`Error del servidor: ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
});

// DELETE
export const deleteUser = createAsyncThunk('Users/deleteUser', async (userId: string) => {
  await axiosInstance.delete(`User?id=eq.${userId}`);
  return userId;
});

// UPDATE
export const updateUser = createAsyncThunk('Users/updateUser', async (user: User) => {
  const { id, ...updateData } = user;
  
  const userToSend: any = {
    username: updateData.username,
    email: updateData.email,
    fullName: updateData.fullName,
    photo: updateData.photo,
    phone: updateData.phone,
    address: updateData.address,
    location: updateData.location,
  };
  
  const response = await axiosInstance.patch<User[]>(`User?id=eq.${id}`, userToSend);
  if (response.data && response.data.length > 0) {
    return response.data[0];
  }
  return { ...userToSend, id };
});

const UsersSlice = createSlice({
  name: 'Users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.Users = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar usuarios';
      })
      .addCase(fetchUserById.fulfilled, (state, action: PayloadAction<User>) => {
        const index = state.Users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.Users[index] = action.payload;
        } else {
          state.Users.push(action.payload);
        }
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.Users.unshift(action.payload);
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.Users = state.Users.filter(User => User.id !== action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        const index = state.Users.findIndex(User => User.id === action.payload.id);
        if (index !== -1) {
          state.Users[index] = action.payload;
        }
      });
  },
});

export default UsersSlice.reducer;
