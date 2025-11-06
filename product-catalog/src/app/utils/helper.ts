// src/app/utils/cookie.helper.ts

export function getCookie(name: string): string | null {
  // Pastikan kode ini hanya berjalan di browser
  if (typeof document === 'undefined') {
    return null;
  }
  
  const nameLenPlus = (name.length + 1);
  return document.cookie
    .split(';')
    .map(c => c.trim())
    .filter(cookie => {
      return cookie.substring(0, nameLenPlus) === `${name}=`;
    })
    .map(cookie => {
      return decodeURIComponent(cookie.substring(nameLenPlus));
    })[0] || null;
}