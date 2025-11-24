import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateIdempotencyKey } from '../utils/helpers';

const BASE_URL = "https://api.senin-backendin.com"; // Gerçek bir projede burası olur

// Token Yenileme Simülasyonu (Backend olmadığı için simüle ediyoruz)
const mockRefreshTokenAPI = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = true; // %90 başarılı olur
      if (success) {
        resolve("yeni_access_token_" + Date.now());
      } else {
        reject("Refresh token expired");
      }
    }, 1000);
  });
};

/**
 * Gelişmiş Fetch Wrapper (Interceptor Mantığı)
 * 1. Otomatik Authorization Header ekler.
 * 2. Otomatik Idempotency Key ekler.
 * 3. 401 (Token Expire) hatasını yakalar, token'ı yeniler ve isteği tekrar eder.
 */
export const secureFetch = async (endpoint, options = {}) => {
  // 1. Token'ı Storage'dan al
  let token = await AsyncStorage.getItem('@auth_token');
  
  // 2. Header'ları hazırla
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
    'X-Idempotency-Key': generateIdempotencyKey(), // Her istek için benzersiz kimlik (Çifte işlem koruması)
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    // --- Backend Olmadığı İçin Fetch Yerine Simülasyon Yapıyoruz ---
    // Normalde: const response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    // SİMÜLASYON: Eğer token yoksa veya eskiyse 401 hatası fırlat
    if (endpoint.includes('analyze') && (!token || token.includes('old'))) {
        throw { status: 401, message: "Unauthorized" };
    }

    // Başarılı cevap simülasyonu
    return { ok: true, status: 200, data: { success: true } };

  } catch (error) {
    // 3. 401 HATASI YAKALAMA (Token Expire Senaryosu)
    if (error.status === 401) {
      console.log("🔒 Token süresi dolmuş! Sessiz yenileme yapılıyor...");

      try {
        // A. Refresh Token ile yeni Access Token al
        const newToken = await mockRefreshTokenAPI();
        
        // B. Yeni token'ı kaydet
        await AsyncStorage.setItem('@auth_token', newToken);
        console.log("✅ Token yenilendi:", newToken);

        // C. İsteği yeni token ile TEKRARLA (Retry)
        config.headers['Authorization'] = `Bearer ${newToken}`;
        // return fetch(`${BASE_URL}${endpoint}`, config); // Gerçekte bu çalışır
        return { ok: true, status: 200, data: { success: true, message: "Retried request success" } };

      } catch (refreshError) {
        // D. Yenileme de başarısızsa (Kullanıcı banlı veya oturum çok eski)
        console.error("❌ Refresh failed, logout yapılıyor.");
        await AsyncStorage.removeItem('@auth_token');
        // Burada uygulamayı Login ekranına yönlendiren bir event tetiklenebilir
        throw refreshError;
      }
    }

    throw error;
  }
};