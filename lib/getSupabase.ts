export async function getSupabase() {
  // Dynamically import the supabase module so we don't require env vars at build time
  try {
    const mod = await import('./supabase')
    return { supabase: mod.supabase }
  } catch (err) {
    // Return a stub so callers can handle missing client gracefully
    // eslint-disable-next-line no-console
    console.warn('getSupabase: failed to import supabase module', err)
    return { supabase: null }
  }
}
