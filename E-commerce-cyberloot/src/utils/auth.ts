import { supabase } from '../config/supabase';
import type { User } from '../models/User';
import { axiosInstance } from '../config/supabase';

/**
 * Sign up a new user with Supabase Auth
 */
export async function signUp(email: string, password: string, userData: Omit<User, 'id' | 'email'>) {
  try {
    // 1. Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      throw new Error(authError.message);
    }

    if (!authData.user) {
      throw new Error('Failed to create user');
    }

    // 2. Crear perfil en la tabla User
    const profileData = {
      id: authData.user.id,
      username: userData.username,
      email: email,
      fullName: userData.fullName,
      photo: userData.photo,
      phone: userData.phone,
      address: userData.address,
      location: userData.location,
    };

    const { data: profile, error: profileError } = await supabase
      .from('User')
      .insert(profileData)
      .select()
      .single();

    if (profileError) {
      // Si falla crear el perfil, intentar eliminar el usuario de Auth
      // Nota: Esto requiere service_role key, por ahora solo lanzamos el error
      throw new Error(profileError.message || 'Failed to create user profile');
    }

    return {
      user: profile as User,
      session: authData.session,
    };
  } catch (error: any) {
    throw new Error(error.message || 'Error creating account');
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Failed to sign in');
    }

    // Obtener el perfil del usuario desde la tabla User
    const { data: profile, error: profileError } = await supabase
      .from('User')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) {
      throw new Error('User profile not found');
    }

    return {
      user: profile as User,
      session: data.session,
    };
  } catch (error: any) {
    throw new Error(error.message || 'Error signing in');
  }
}

/**
 * Sign out current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
  // Limpiar localStorage
  localStorage.removeItem('cyberloot_current_user');
}

/**
 * Get current user session
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return null;
    }

    // Obtener perfil desde la tabla User
    const { data: profile, error } = await supabase
      .from('User')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error || !profile) {
      return null;
    }

    return profile as User;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const user = await getCurrentUser();
      callback(user);
    } else {
      callback(null);
      localStorage.removeItem('cyberloot_current_user');
    }
  });
}

