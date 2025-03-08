import { supabase } from './supabaseService';

export const setupSupabaseTable = async () => {
  try {
    // Check if the designs table exists
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'designs');
    
    if (tablesError) {
      console.error('Error checking if designs table exists:', tablesError);
      return;
    }
    
    // If the table doesn't exist, create it
    if (!tables || tables.length === 0) {
      console.log('Designs table does not exist, creating it...');
      
      // Create the designs table
      const { error: createError } = await supabase.rpc('create_designs_table');
      
      if (createError) {
        console.error('Error creating designs table:', createError);
      } else {
        console.log('Designs table created successfully');
      }
    } else {
      console.log('Designs table already exists');
    }
  } catch (error) {
    console.error('Error setting up Supabase table:', error);
  }
};

// Call the setup function
setupSupabaseTable(); 