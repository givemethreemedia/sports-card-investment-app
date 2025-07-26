import { supabase } from './supabaseClient';

export async function uploadCroppedImage(file: File, userId: string): Promise<string | null> {
  const filePath = `${userId}/${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from('cropped-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Upload error:', error);
    return null;
  }

  const { data: publicUrlData } = supabase.storage
    .from('cropped-images')
    .getPublicUrl(filePath);

  return publicUrlData?.publicUrl || null;
}
