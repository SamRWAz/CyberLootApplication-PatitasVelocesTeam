import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Cart, CartWithProduct } from '../models/Cart';
import { axiosInstance } from '../config/supabase';

type CartWithProductOptional = Cart & {
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

interface CartState {
  Cart: CartWithProductOptional[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  Cart: [],
  loading: false,
  error: null,
};

// FETCH by UserId - Con JOIN para obtener datos del producto
export const fetchCartByUserId = createAsyncThunk('Cart/fetchCartByUserId', async (userId: string) => {
  const response = await axiosInstance.get<CartWithProduct[]>(
    `Cart?select=*,Product(id,title,description,price,image,category,condition)&user_id=eq.${userId}&order=id.desc`
  );
  return response.data.map((item: any) => ({
    id: item.id,
    user_id: item.user_id,
    product_id: item.product_id,
    quantity: item.quantity,
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

// CREATE - Agregar producto al carrito
export const addToCart = createAsyncThunk('Cart/addToCart', async (cartItem: { user_id: string; product_id: string; quantity: number }) => {
  // Verificar si ya existe un item en el carrito con el mismo producto
  const existingResponse = await axiosInstance.get<Cart[]>(
    `Cart?user_id=eq.${cartItem.user_id}&product_id=eq.${cartItem.product_id}`
  );
  
  if (existingResponse.data && existingResponse.data.length > 0) {
    // Si existe, actualizar la cantidad
    const existingItem = existingResponse.data[0];
    const newQuantity = existingItem.quantity + cartItem.quantity;
    const updateData = { quantity: newQuantity };
    
    const response = await axiosInstance.patch<Cart[]>(
      `Cart?id=eq.${existingItem.id}`,
      updateData
    );
    
    if (response.data && response.data.length > 0) {
      return response.data[0];
    }
    return { ...existingItem, quantity: newQuantity };
  } else {
    // Si no existe, crear nuevo item
    const cartToSend: any = {
      id: crypto.randomUUID(),
      user_id: cartItem.user_id,
      product_id: cartItem.product_id,
      quantity: cartItem.quantity,
    };
    
    try {
      const response = await axiosInstance.post<Cart | Cart[]>('Cart', cartToSend);
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data[0];
      } else if (response.data && typeof response.data === 'object' && 'id' in response.data && !Array.isArray(response.data)) {
        return response.data as Cart;
      }
      throw new Error('No se recibió el item del carrito creado');
    } catch (error: any) {
      console.error('Error al agregar al carrito:', error);
      if (error.response) {
        throw new Error(`Error del servidor: ${JSON.stringify(error.response.data)}`);
      }
      throw error;
    }
  }
});

// UPDATE - Actualizar cantidad de un item del carrito
export const updateCartItem = createAsyncThunk('Cart/updateCartItem', async (cartItem: { id: string; quantity: number }) => {
  const updateData = { quantity: cartItem.quantity };
  
  const response = await axiosInstance.patch<Cart[]>(
    `Cart?id=eq.${cartItem.id}`,
    updateData
  );
  
  if (response.data && response.data.length > 0) {
    return response.data[0];
  }
  throw new Error('No se pudo actualizar el item del carrito');
});

// DELETE - Eliminar item del carrito
export const removeFromCart = createAsyncThunk('Cart/removeFromCart', async (cartId: string) => {
  await axiosInstance.delete(`Cart?id=eq.${cartId}`);
  return cartId;
});

// DELETE by product_id and user_id - Eliminar item del carrito por producto y usuario
export const removeFromCartByProduct = createAsyncThunk('Cart/removeFromCartByProduct', async (data: { user_id: string; product_id: string }) => {
  await axiosInstance.delete(`Cart?user_id=eq.${data.user_id}&product_id=eq.${data.product_id}`);
  return data.product_id;
});

// CLEAR - Limpiar todo el carrito de un usuario
export const clearCart = createAsyncThunk('Cart/clearCart', async (userId: string) => {
  await axiosInstance.delete(`Cart?user_id=eq.${userId}`);
  return userId;
});

const CartSlice = createSlice({
  name: 'Cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartByUserId.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.Cart = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchCartByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar el carrito';
      })
      .addCase(addToCart.fulfilled, (state, action: PayloadAction<Cart>) => {
        const existingIndex = state.Cart.findIndex(item => item.id === action.payload.id);
        if (existingIndex !== -1) {
          state.Cart[existingIndex] = action.payload;
        } else {
          state.Cart.push(action.payload);
        }
      })
      .addCase(updateCartItem.fulfilled, (state, action: PayloadAction<Cart>) => {
        const index = state.Cart.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.Cart[index] = action.payload;
        }
      })
      .addCase(removeFromCart.fulfilled, (state, action: PayloadAction<string>) => {
        state.Cart = state.Cart.filter(item => item.id !== action.payload);
      })
      .addCase(removeFromCartByProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.Cart = state.Cart.filter(item => item.product_id !== action.payload);
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.Cart = [];
      });
  },
});

export default CartSlice.reducer;

