import { supabase, axiosInstance } from '../config/supabase';
import type { User } from '../models/User';

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
      console.error('Supabase Auth Error:', authError);
      throw new Error(authError.message || 'Error creating user account');
    }

    if (!authData.user) {
      console.error('No user data returned from Supabase Auth');
      throw new Error('Failed to create user. Please try again.');
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

    console.log('Creating user profile with data:', { ...profileData, photo: profileData.photo ? '[photo data]' : null });
    console.log('Photo size:', profileData.photo ? profileData.photo.length : 0, 'characters');

    // Usar axiosInstance para la inserción (como en otros lugares del código)
    console.log('Sending insert request to Supabase via REST API...');
    
    let profile;
    try {
      const response = await axiosInstance.post<User | User[]>('User', profileData);
      console.log('Insert response received:', response);
      
      if (Array.isArray(response.data) && response.data.length > 0) {
        profile = response.data[0];
      } else if (response.data && typeof response.data === 'object' && 'id' in response.data && !Array.isArray(response.data)) {
        profile = response.data as User;
      } else {
        console.error('Unexpected response structure:', response.data);
        throw new Error('No se recibió el perfil de usuario creado');
      }
      
      console.log('Profile created successfully:', { id: profile.id, username: profile.username });
    } catch (error: any) {
      console.error('Error creating user profile:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        throw new Error(`Error del servidor: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        throw new Error('No se recibió respuesta del servidor. Por favor verifica tu conexión.');
      } else {
        throw new Error(error.message || 'Error creating user profile. Please try again.');
      }
    }

    if (!profile) {
      console.error('No profile data returned from Supabase');
      throw new Error('Failed to retrieve user profile. Please try again.');
    }

    return {
      user: profile as User,
      session: authData.session,
    };
  } catch (error: any) {
    console.error('SignUp Error:', error);
    // Si el error ya es un Error con mensaje, lanzarlo tal cual
    if (error instanceof Error) {
      throw error;
    }
    // Si es otro tipo de error, crear uno nuevo con el mensaje
    throw new Error(error?.message || 'Error creating account. Please try again.');
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  try {
    console.log('Starting signIn process...');
    console.log('Email:', email);
    
    // Usar la API REST directamente en lugar del cliente de Supabase Auth
    // ya que el cliente se está quedando colgado
    console.log('Calling Supabase Auth API directly via REST...');
    
    const SUPABASE_URL = 'https://unpvaagrenqwuhhlclmq.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVucHZhYWdyZW5xd3VoaGxjbG1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MzA2OTIsImV4cCI6MjA3NzUwNjY5Mn0.UKeAS54NBBBt0gH0ZFrfCrOiCKi2V9mOdonGptBym9Q';
    
    const authResponse = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    console.log('Auth API response status:', authResponse.status);

    if (!authResponse.ok) {
      const errorData = await authResponse.json().catch(() => ({}));
      console.error('Auth API error:', errorData);
      throw new Error(errorData?.error_description || errorData?.message || 'Invalid email or password');
    }

    const authData = await authResponse.json();
    console.log('Auth successful, user ID:', authData.user?.id);

    if (!authData.user) {
      console.error('No user data returned from Auth API');
      throw new Error('Failed to sign in');
    }

    // Actualizar la sesión en el cliente de Supabase de forma no bloqueante
    // No esperamos a que termine para evitar que se quede colgado
    if (authData.access_token) {
      supabase.auth.setSession({
        access_token: authData.access_token,
        refresh_token: authData.refresh_token || '',
      }).then(() => {
        console.log('Session set in Supabase client');
      }).catch((sessionError) => {
        console.warn('Could not set session in Supabase client:', sessionError);
      });
    }

    const data = { user: authData.user, session: authData };

    console.log('Auth successful, fetching user profile...');
    console.log('User ID from Auth:', data.user.id);
    console.log('User email from Auth:', data.user.email || email);

    // Obtener el perfil del usuario desde la tabla User usando axiosInstance
    // Intentar primero por ID, luego por email si no se encuentra
    try {
      console.log('Making request to get user profile by ID...');
      
      // Agregar timeout para evitar que se quede colgado
      let profilePromise = axiosInstance.get<User[]>(`User?id=eq.${data.user.id}&select=*`);
      const profileTimeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Profile fetch timeout')), 10000); // 10 segundos
      });
      
      let response;
      try {
        response = await Promise.race([profilePromise, profileTimeout]) as any;
        console.log('Profile response by ID:', response);
        console.log('Profile data by ID:', response.data);
        console.log('Profile data length by ID:', response.data?.length);
      } catch (idError) {
        console.error('Error fetching profile by ID:', idError);
        response = { data: [] };
      }
      
      // Si no se encuentra por ID, intentar por email
      if (!response.data || response.data.length === 0) {
        console.log('Profile not found by ID, trying to find by email...');
        const userEmail = data.user.email || email;
        console.log('Searching for profile with email:', userEmail);
        try {
          profilePromise = axiosInstance.get<User[]>(`User?email=eq.${encodeURIComponent(userEmail)}&select=*`);
          response = await Promise.race([profilePromise, profileTimeout]) as any;
          console.log('Profile response by email:', response);
          console.log('Profile data by email:', response.data);
          console.log('Profile data length by email:', response.data?.length);
        } catch (emailError) {
          console.error('Error fetching profile by email:', emailError);
          response = { data: [] };
        }
      }
      
      if (!response.data || response.data.length === 0) {
        console.error('No profile data returned for user ID:', data.user.id);
        console.error('No profile data returned for email:', data.user.email || email);
        console.error('User profile does not exist in the User table');
        throw new Error('User profile not found. Please contact support or create a new account.');
      }

      const profile = response.data[0];
      console.log('Profile retrieved successfully:', { id: profile.id, username: profile.username });

      return {
        user: profile as User,
        session: data.session,
      };
    } catch (profileError: any) {
      console.error('Error fetching user profile:', profileError);
      if (profileError.message && profileError.message.includes('timeout')) {
        throw new Error('The request to fetch your profile took too long. Please try again.');
      }
      if (profileError.response) {
        throw new Error(`Error fetching profile: ${JSON.stringify(profileError.response.data)}`);
      }
      throw new Error('User profile not found');
    }
  } catch (error: any) {
    console.error('SignIn Error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(error?.message || 'Error signing in');
  }
}

/**
 * Sign out current user
 */
export async function signOut() {
  try {
    console.log('Calling supabase.auth.signOut()...');
    const { error } = await supabase.auth.signOut();
    console.log('Supabase signOut response received');
    
    if (error) {
      console.error('Supabase signOut error:', error);
      throw new Error(error.message);
    }
    
    // Limpiar localStorage
    console.log('Clearing localStorage...');
    localStorage.removeItem('cyberloot_current_user');
    console.log('Logout completed successfully');
  } catch (error: any) {
    console.error('Error in signOut function:', error);
    // Limpiar localStorage incluso si hay error
    localStorage.removeItem('cyberloot_current_user');
    throw error;
  }
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

    // Obtener perfil desde la tabla User usando axiosInstance
    try {
      const response = await axiosInstance.get<User[]>(`User?id=eq.${session.user.id}&select=*`);
      
      if (!response.data || response.data.length === 0) {
        return null;
      }

      return response.data[0] as User;
    } catch (profileError) {
      console.error('Error fetching user profile:', profileError);
      return null;
    }
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange(async (_event, session) => {
    if (session?.user) {
      const user = await getCurrentUser();
      callback(user);
    } else {
      callback(null);
      localStorage.removeItem('cyberloot_current_user');
    }
  });
}

