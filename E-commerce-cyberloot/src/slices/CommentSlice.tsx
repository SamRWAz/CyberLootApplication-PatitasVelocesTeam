import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Comment, CommentWithUser } from '../models/Comment';
import { axiosInstance } from '../config/supabase';

interface CommentsState {
  Comments: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentsState = {
  Comments: [],
  loading: false,
  error: null,
};

// FETCH (Read All) - Con JOIN para obtener datos del usuario
export const fetchComments = createAsyncThunk('Comments/fetchComments', async () => {
  const response = await axiosInstance.get<CommentWithUser[]>(
    'Comment?select=*,User(id,username,"fullName",photo)&order=id.desc'
  );
  return response.data.map((item: any) => ({
    id: item.id,
    content: item.content,
    user_id: item.user_id,
    product_id: item.product_id,
    userName: item.User?.fullName || 'Usuario desconocido',
    userPhoto: item.User?.photo,
    username: item.User?.username,
  }));
});

// FETCH by ProductId - Con JOIN para obtener datos del usuario
export const fetchCommentsByProductId = createAsyncThunk('Comments/fetchCommentsByProductId', async (productId: string) => {
  const response = await axiosInstance.get<CommentWithUser[]>(
    `Comment?select=*,User(id,username,"fullName",photo)&product_id=eq.${productId}&order=id.desc`
  );
  return response.data.map((item: any) => ({
    id: item.id,
    content: item.content,
    user_id: item.user_id,
    product_id: item.product_id,
    userName: item.User?.fullName || 'Usuario desconocido',
    userPhoto: item.User?.photo,
    username: item.User?.username,
  }));
});

// CREATE
export const createComment = createAsyncThunk('Comments/createComment', async (newComment: Omit<Comment, 'id'>) => {
  const commentToSend: any = {
    id: crypto.randomUUID(),
    content: (newComment.content || '').trim(),
    user_id: newComment.user_id,
    product_id: newComment.product_id,
  };
  
  if (!commentToSend.content || !commentToSend.user_id || !commentToSend.product_id) {
    throw new Error('El contenido, usuario y producto son campos requeridos');
  }
  
  try {
    const response = await axiosInstance.post<Comment | Comment[]>('Comment', commentToSend);
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data[0];
    } else if (response.data && typeof response.data === 'object' && 'id' in response.data && !Array.isArray(response.data)) {
      return response.data as Comment;
    }
    throw new Error('No se recibió el comentario creado');
  } catch (error: any) {
    console.error('Error al crear comentario:', error);
    if (error.response) {
      throw new Error(`Error del servidor: ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
});

// DELETE
export const deleteComment = createAsyncThunk('Comments/deleteComment', async (commentId: string) => {
  await axiosInstance.delete(`Comment?id=eq.${commentId}`);
  return commentId;
});

// UPDATE
export const updateComment = createAsyncThunk('Comments/updateComment', async (comment: Comment) => {
  const { id, ...updateData } = comment;
  
  const commentToSend: any = {
    content: updateData.content,
    user_id: updateData.user_id,
    product_id: updateData.product_id,
  };
  
  const response = await axiosInstance.patch<Comment[]>(`Comment?id=eq.${id}`, commentToSend);
  if (response.data && response.data.length > 0) {
    return response.data[0];
  }
  return { ...commentToSend, id };
});

const CommentsSlice = createSlice({
  name: 'Comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.Comments = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar comentarios';
      })
      .addCase(fetchCommentsByProductId.fulfilled, (state, action: PayloadAction<any[], string, { arg: string }>) => {
        const productId = action.meta.arg;
        state.Comments = state.Comments.filter(c => c.product_id !== productId);
        state.Comments.push(...action.payload);
      })
      .addCase(createComment.fulfilled, (state, action: PayloadAction<Comment>) => {
        state.Comments.unshift(action.payload);
      })
      .addCase(deleteComment.fulfilled, (state, action: PayloadAction<string>) => {
        state.Comments = state.Comments.filter(Comment => Comment.id !== action.payload);
      })
      .addCase(updateComment.fulfilled, (state, action: PayloadAction<Comment>) => {
        const index = state.Comments.findIndex(Comment => Comment.id === action.payload.id);
        if (index !== -1) {
          state.Comments[index] = action.payload;
        }
      });
  },
});

export default CommentsSlice.reducer;
