// Firebase storage import
import { storage } from "./firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

// Types
type FileType = File | string | null;
type UploadResult = string | null;
type ProgressCallback = (progress: number, fileName: string, completed: boolean) => void;

interface UploadOptions {
  folderName: string;
  onProgress?: ProgressCallback;
}

// File upload function
export const uploadImage = async (file: FileType, options: UploadOptions): Promise<UploadResult> => {
  try {
    if (file == null) {
      return null;
    }

    if (typeof file === "string") {
      return file;
    }

    const storageRef = ref(storage, `${options.folderName}/${uuidv4()}-${(file as File).name}`);

    if (options.onProgress) {
      const uploadTask = uploadBytesResumable(storageRef, file as File);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            options.onProgress?.(progress, (file as File).name, false);
          },
          (error) => {
            console.error("Error uploading image:", error);
            reject(new Error("Failed to upload image"));
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
            options.onProgress?.(100, (file as File).name, true);
          }
        );
      });
    }

    // If no progress callback, use simple upload
    const snapshot = await uploadBytesResumable(storageRef, file as File);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
};

// Upload multiple images
export const uploadMultipleImages = async (files: FileType[], options: UploadOptions): Promise<string[]> => {
  try {
    if (!Array.isArray(files)) {
      throw new Error("Files parameter must be an array");
    }

    if (!options.folderName || typeof options.folderName !== "string") {
      throw new Error("Invalid folder name");
    }

    const totalFiles = files.filter((file) => file != null && file !== "").length;
    let completedFiles = 0;

    const uploadPromises = files.map(async (file) => {
      if (file == null || file === "") {
        return "";
      }

      const result = await uploadImage(file, {
        ...options,
        onProgress: options.onProgress
          ? (progress, fileName, completed) => {
              const overallProgress = ((completedFiles + progress / 100) / totalFiles) * 100;
              // Only mark as truly completed when it's the last file and it's completed
              const isFinalCompletion = completed && completedFiles === totalFiles - 1;
              options.onProgress?.(overallProgress, fileName, isFinalCompletion);
            }
          : undefined,
      });

      if (file !== null && file !== "") {
        completedFiles++;
      }

      return result ?? "";
    });

    const results = await Promise.all(uploadPromises);

    // Ensure we send a final completion signal if there's a progress callback
    if (options.onProgress && totalFiles > 0) {
      options.onProgress(100, "All files", true);
    }

    return results;
  } catch (error) {
    console.error("Error uploading multiple images:", error);
    throw new Error("Failed to upload multiple images");
  }
};

// Alias for backward compatibility
export const uploadAllImages = uploadMultipleImages;
