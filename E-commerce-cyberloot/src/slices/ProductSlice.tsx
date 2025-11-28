import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../models/Product';
import { axiosInstance } from '../config/supabase';

interface ProductsState {
  Products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  Products: [],
  loading: false,
  error: null,
};

// FETCH (Read All) - Con JOIN para obtener datos del vendedor
export const fetchProducts = createAsyncThunk('Products/fetchProducts', async () => {
  const response = await axiosInstance.get<any[]>(
    'Product?select=*,User(id,username,"fullName",photo)&order=id.desc'
  );
  // Mapear la respuesta para mantener compatibilidad con campos adicionales para la UI
  return response.data.map((item: any) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    price: Number(item.price),
    image: item.image,
    user_id: item.user_id,
    category: item.category,
    condition: item.condition,
    // Campos adicionales para la UI (no están en el modelo base)
    seller: item.User ? item.User.fullName : 'Vendedor desconocido',
    sellerUsername: item.User?.username,
    sellerPhoto: item.User?.photo,
  }));
});

// FETCH by User ID (productos de un vendedor)
export const fetchProductsByUserId = createAsyncThunk('Products/fetchProductsByUserId', async (userId: string) => {
  const response = await axiosInstance.get<Product[]>(
    `Product?select=*&user_id=eq.${userId}&order=id.desc`
  );
  return response.data.map((item: any) => ({
    ...item,
    price: Number(item.price),
  }));
});

// CREATE
export const createProduct = createAsyncThunk('Products/createProduct', async (newProduct: Omit<Product, 'id'>) => {
  const productToSend: any = {
    id: crypto.randomUUID(),
    title: (newProduct.title || '').trim(),
    description: (newProduct.description || '').trim(),
    price: Number(newProduct.price),
    image: (newProduct.image || '').trim(),
    user_id: newProduct.user_id,
    category: newProduct.category || '',
    condition: newProduct.condition,
  };
  
  if (!productToSend.title || !productToSend.description || !productToSend.user_id) {
    throw new Error('El título, descripción y vendedor son campos requeridos');
  }
  
  if (isNaN(productToSend.price) || productToSend.price <= 0) {
    throw new Error('El precio debe ser un número válido mayor a 0');
  }
  
  try {
    const response = await axiosInstance.post<Product | Product[]>('Product', productToSend);
    if (Array.isArray(response.data) && response.data.length > 0) {
      return { ...response.data[0], price: Number(response.data[0].price) };
    } else if (response.data && typeof response.data === 'object' && 'id' in response.data && !Array.isArray(response.data)) {
      return { ...response.data as Product, price: Number((response.data as any).price) };
    }
    throw new Error('No se recibió el producto creado');
  } catch (error: any) {
    console.error('Error al crear producto:', error);
    if (error.response) {
      throw new Error(`Error del servidor: ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
});

// DELETE
export const deleteProduct = createAsyncThunk('Products/deleteProduct', async (productId: string) => {
  await axiosInstance.delete(`Product?id=eq.${productId}`);
  return productId;
});

// DELETE ALL - Eliminar todos los productos de un usuario
export const deleteAllProductsByUserId = createAsyncThunk('Products/deleteAllProductsByUserId', async (userId: string) => {
  await axiosInstance.delete(`Product?user_id=eq.${userId}`);
  return userId;
});

// UPDATE
export const updateProduct = createAsyncThunk('Products/updateProduct', async (product: Product) => {
  const { id, ...updateData } = product;
  
  const productToSend: any = {
    title: updateData.title,
    description: updateData.description,
    price: Number(updateData.price),
    image: updateData.image,
    user_id: updateData.user_id,
    category: updateData.category,
    condition: updateData.condition,
  };
  
  const response = await axiosInstance.patch<Product[]>(`Product?id=eq.${id}`, productToSend);
  if (response.data && response.data.length > 0) {
    return { ...response.data[0], price: Number(response.data[0].price) };
  }
  return { ...productToSend, id };
});

const ProductsSlice = createSlice({
  name: 'Products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.Products = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar productos';
      })
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.Products.unshift(action.payload);
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.Products = state.Products.filter(Product => Product.id !== action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        const index = state.Products.findIndex(Product => Product.id === action.payload.id);
        if (index !== -1) {
          state.Products[index] = action.payload;
        }
      })
      .addCase(deleteAllProductsByUserId.fulfilled, (state, action: PayloadAction<string>) => {
        state.Products = state.Products.filter(product => product.user_id !== action.payload);
      });
  },
});

export default ProductsSlice.reducer;
