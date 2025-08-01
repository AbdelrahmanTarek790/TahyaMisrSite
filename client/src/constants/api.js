export const API_BASE_URL = 'http://localhost:5000';
export const UPLOADS_URL = `${API_BASE_URL}/uploads`;

export const getImageUrl = (filename) => {
  if (!filename) return null;
  return `${UPLOADS_URL}/${filename}`;
};