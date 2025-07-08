export async function uploadToCloudinary(file: File): Promise<string> {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`,
        { method: 'POST', body: data }
    );

    if (!res.ok) throw new Error('Upload failed');
    const result = await res.json();
    return result.secure_url;
}
