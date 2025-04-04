import { supabase } from "@/lib/supabaseClient";

// Define a more specific type for the Auth0 user if possible
interface Auth0User {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
  // Add other Auth0 user properties you might use
}

export const saveUserToSupabase = async (auth0User: Auth0User) => {
  // Enhanced validation
  if (!auth0User?.sub || !auth0User.sub.includes('|') || !auth0User.email) {
    const error = new Error('Invalid Auth0 user data: missing or malformed sub or email');
    console.error('Validation failed:', { auth0User, error });
    throw error;
  }

  const userData = {
    auth0_id: auth0User.sub,
    email: auth0User.email.toLowerCase().trim(), // normalize email
    name: auth0User.name?.trim() || null,
    picture: auth0User.picture || null,
    last_login: new Date().toISOString(),
    updated_at: new Date().toISOString() // track when record was last updated
  };

  try {
    const { data, error, status } = await supabase
      .from('users2')
      .upsert(userData, { onConflict: 'auth0_id' })
      .select()
      .single(); // Use single() if you expect exactly one record

    if (error) {
      console.error('Supabase error:', {
        status,
        error,
        userData,
        timestamp: new Date().toISOString()
      });
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to save user:', {
      error,
      userData: {
        auth0_id: userData.auth0_id,
        email: userData.email
      },
      timestamp: new Date().toISOString()
    });
    throw error; // Consider wrapping the error for better error handling upstream
  }
};