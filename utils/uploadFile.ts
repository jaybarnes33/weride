import { supabase } from "@/config/supabase";
import { decode } from "base64-arraybuffer";
import { ImagePickerAsset } from "expo-image-picker";

export const uploadFile = async (file: ImagePickerAsset, id?: string) => {
  try {
    // Read the file as a blob

    if (!file.base64) {
      return { data: null, error: "No file provided" };
    }
    // Generate a unique filename
    const fileName = `${Date.now()}`;
    console.log(file);

    // Create a File object from the blob

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from("weride-files")
      .upload(`${id ? `${id}/` : ""}${fileName}`, decode(file.base64!), {
        cacheControl: "3600",
        upsert: false,
        contentType: file.mimeType,
      });

    if (error) {
      console.error("Error uploading file:", error);
      return { data: null, error };
    }

    console.log("File uploaded successfully:", data);
    return { data, error: null };
  } catch (error) {
    console.error("Error in uploadFile:", error);
    return { data: null, error };
  }
};
