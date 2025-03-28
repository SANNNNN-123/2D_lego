import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

/*
To create the designs table in your Supabase database, run the following SQL in the Supabase SQL Editor:

CREATE TABLE public.designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  creator TEXT NOT NULL,
  image TEXT, -- Now nullable
  pixel_data JSONB NOT NULL,
  color_palette JSONB NOT NULL,
  bounds JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Set up RLS (Row Level Security)
ALTER TABLE public.designs ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now
CREATE POLICY "Allow all operations for now" 
  ON public.designs 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);
*/

export interface DesignData {
  name: string;
  creator: string;
  image?: string;
  pixelData: (string | null)[][];
  colorPalette: string[];
  bounds?: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    width: number;
    height: number;
  };
}

export const saveDesign = async (designData: DesignData) => {
  try {
    // Prepare the data to insert
    const dataToInsert = {
      name: designData.name,
      creator: designData.creator,
      pixel_data: designData.pixelData,
      color_palette: designData.colorPalette,
      bounds: designData.bounds || null
    };

    // Add image field only if it exists and is not empty
    if (designData.image) {
      Object.assign(dataToInsert, { image: designData.image });
    }

    // Attempt to insert the design
    const { data, error } = await supabase
      .from('designs')
      .insert([dataToInsert])
      .select();
    
    if (error) {
      // Check if error has a message property and if it includes the specific text
      if (error.message && typeof error.message === 'string' && error.message.includes('relation "designs" does not exist')) {
        alert('The designs table does not exist in your Supabase database. Please run the SQL in create_designs_table.sql in your Supabase dashboard.');
      } else {
        // Generic error message for other types of errors
        alert(`Error saving design: ${error.message || 'Unknown error'}`);
      }
      
      throw error;
    }
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
};

export const fetchDesigns = async () => {
  try {
    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching designs:', error);
      return { success: false, error };
    }
    
    return { 
      success: true, 
      data: data.map(item => ({
        id: item.id,
        name: item.name,
        creator: item.creator,
        image: item.image,
        pixelData: item.pixel_data,
        colorPalette: item.color_palette,
        bounds: item.bounds,
        createdAt: item.created_at
      }))
    };
  } catch (error) {
    console.error('Exception fetching designs:', error);
    return { success: false, error };
  }
};

export const fetchDesignById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching design with id ${id}:`, error);
      return { success: false, error };
    }
    
    if (!data) {
      return { success: false, error: { message: 'Design not found' } };
    }
    
    return { 
      success: true, 
      data: {
        id: data.id,
        name: data.name,
        creator: data.creator,
        image: data.image,
        pixelData: data.pixel_data,
        colorPalette: data.color_palette,
        bounds: data.bounds,
        createdAt: data.created_at
      }
    };
  } catch (error) {
    console.error(`Exception fetching design with id ${id}:`, error);
    return { success: false, error };
  }
}; 