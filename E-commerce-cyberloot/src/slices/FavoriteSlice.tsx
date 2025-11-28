import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Favorite, FavoriteWithProduct } from '../models/Favorite';
import { axiosInstance } from '../config/supabase';

type FavoriteWithProductOptional = Favorite & {
  product?: {
    id: string;
    title: string;
    description: string;
    price: number;
    image: string;
    category: 'videogames' | 'consoles' | 'accesories' | 'merchandising' | 'components';
    condition: 'new' | 'used' | 'refurbished';
  };
};

interface FavoriteState {
  Favorites: FavoriteWithProductOptional[];
  loading: boolean;
  error: string | null;
}

const initialState: FavoriteState = {
  Favorites: [],
  loading: false,
  error: null,
};

// FETCH by UserId - Con JOIN para obtener datos del producto
export const fetchFavoritesByUserId = createAsyncThunk('Favorite/fetchFavoritesByUserId', async (userId: string) => {
  const response = await axiosInstance.get<FavoriteWithProduct[]>(
    `Favorite?select=*,Product(id,title,description,price,image,category,condition)&user_id=eq.${userId}&order=id.desc`
  );
  return response.data.map((item: any) => ({
    id: item.id,
    user_id: item.user_id,
    product_id: item.product_id,
    product: item.Product ? {
      id: item.Product.id,
      title: item.Product.title,
      description: item.Product.description,
      price: item.Product.price,
      image: item.Product.image,
      category: item.Product.category,
      condition: item.Product.condition,
    } : undefined,
  }));
});

// CHECK - Verificar si un producto está en favoritos
export const checkFavorite = createAsyncThunk('Favorite/checkFavorite', async (data: { user_id: string; product_id: string }) => {
  const response = await axiosInstance.get<Favorite[]>(
    `Favorite?user_id=eq.${data.user_id}&product_id=eq.${data.product_id}`
  );
  return response.data.length > 0 ? response.data[0] : null;
});

// CREATE - Agregar a favoritos
export const addToFavorites = createAsyncThunk('Favorite/addToFavorites', async (favorite: { user_id: string; product_id: string }) => {
  // Verificar si ya existe
  const existingResponse = await axiosInstance.get<Favorite[]>(
    `Favorite?user_id=eq.${favorite.user_id}&product_id=eq.${favorite.product_id}`
  );
  
  if (existingResponse.data && existingResponse.data.length > 0) {
    // Ya existe, retornar el existente
    return existingResponse.data[0];
  }
  
  // Crear nuevo favorito
  const favoriteToSend: any = {
    id: crypto.randomUUID(),
    user_id: favorite.user_id,
    product_id: favorite.product_id,
  };
  
  try {
    const response = await axiosInstance.post<Favorite | Favorite[]>('Favorite', favoriteToSend);
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data[0];
    } else if (response.data && typeof response.data === 'object' && 'id' in response.data && !Array.isArray(response.data)) {
      return response.data as Favorite;
    }
    throw new Error('No se recibió el favorito creado');
  } catch (error: any) {
    console.error('Error al agregar a favoritos:', error);
    if (error.response) {
      throw new Error(`Error del servidor: ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
});

// DELETE - Eliminar de favoritos
export const removeFromFavorites = createAsyncThunk('Favorite/removeFromFavorites', async (data: { user_id: string; product_id: string }) => {
  await axiosInstance.delete(`Favorite?user_id=eq.${data.user_id}&product_id=eq.${data.product_id}`);
  return data.product_id;
});

// DELETE ALL - Eliminar todos los favoritos de un usuario
export const removeAllFavoritesByUserId = createAsyncThunk('Favorite/removeAllFavoritesByUserId', async (userId: string) => {
  await axiosInstance.delete(`Favorite?user_id=eq.${userId}`);
  return userId;
});

// TOGGLE - Alternar favorito (agregar si no existe, eliminar si existe)
export const toggleFavorite = createAsyncThunk('Favorite/toggleFavorite', async (data: { user_id: string; product_id: string }, { dispatch }) => {
  // Verificar si existe
  const existingResponse = await axiosInstance.get<Favorite[]>(
    `Favorite?user_id=eq.${data.user_id}&product_id=eq.${data.product_id}`
  );
  
  if (existingResponse.data && existingResponse.data.length > 0) {
    // Existe, eliminarlo
    await dispatch(removeFromFavorites(data));
    return { favorite: null, isFavorite: false };
  } else {
    // No existe, crearlo
    const result = await dispatch(addToFavorites(data));
    return { favorite: result.payload as Favorite, isFavorite: true };
  }
});

const FavoriteSlice = createSlice({
  name: 'Favorite',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavoritesByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavoritesByUserId.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.Favorites = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchFavoritesByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar favoritos';
      })
      .addCase(checkFavorite.fulfilled, (_state, _action: PayloadAction<Favorite | null>) => {
        // No modifica el estado, solo verifica
      })
      .addCase(addToFavorites.fulfilled, (state, action: PayloadAction<Favorite>) => {
        const exists = state.Favorites.find(f => f.id === action.payload.id);
        if (!exists) {
          state.Favorites.push(action.payload);
        }
      })
      .addCase(removeFromFavorites.fulfilled, (state, action: PayloadAction<string>) => {
        state.Favorites = state.Favorites.filter(f => f.product_id !== action.payload);
      })
      .addCase(toggleFavorite.fulfilled, (state, action: PayloadAction<{ favorite: Favorite | null; isFavorite: boolean }>) => {
        if (action.payload.isFavorite && action.payload.favorite) {
          const exists = state.Favorites.find(f => f.id === action.payload.favorite!.id);
          if (!exists) {
            state.Favorites.push(action.payload.favorite);
          }
        } else {
          // Ya fue eliminado por removeFromFavorites
        }
      })
      .addCase(removeAllFavoritesByUserId.fulfilled, (state) => {
        state.Favorites = [];
      });
  },
});

export default FavoriteSlice.reducer;

