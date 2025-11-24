// DİKKAT: Ayarları 'constants' dosyasından alıyoruz.
import { API_CONFIG } from '../config/constants'; 
import { generateIdempotencyKey, parseSentimentResult } from '../utils/helpers';

// --- MOCK (YAPAY) SERVİS ---
// İnternet yoksa, API key yoksa veya API hata verirse bu çalışır.
const mockAnalyzeService = (text) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lower = text.toLowerCase();
      // Basit anahtar kelime analizi
      const isPositive = lower.includes('iyi') || lower.includes('mutlu') || lower.includes('harika') || lower.includes('süper');
      const isNegative = lower.includes('kötü') || lower.includes('üzgün') || lower.includes('yorgun') || lower.includes('berbat');
      
      let sentiment = 'neutral';
      if (isPositive) sentiment = 'positive';
      else if (isNegative) sentiment = 'negative';

      resolve({
        sentiment,
        summary: "Bağlantı veya API sorunu nedeniyle çevrimdışı (Mock) analiz yapıldı.",
        suggestion: sentiment === 'positive' 
          ? "Bu enerjini koru ve sevdiklerinle paylaş!" 
          : "Kendine bir kahve ısmarla ve 10 dakika mola ver."
      });
    }, 1000); // 1 saniye yapay gecikme
  });
};

// --- GERÇEK SERVİS ---
export const analyzeText = async (text) => {
  // 1. Güvenlik Kontrolü: Config dosyası var mı?
  if (!API_CONFIG) {
    console.error("⚠️ HATA: API_CONFIG bulunamadı! 'src/config/constants.js' dosyasını kontrol et.");
    return await mockAnalyzeService(text);
  }

  const idempotencyKey = generateIdempotencyKey();
  console.log(`[API] Request ID: ${idempotencyKey}`);

  // 2. Mock Modu Kontrolü
  if (API_CONFIG.USE_MOCK || !API_CONFIG.HF_API_KEY || API_CONFIG.HF_API_KEY.includes("xxxx")) {
    console.log("[API] Mock Service, Eksik Key veya Test Modu aktif...");
    return await mockAnalyzeService(text);
  }

  try {
    // 3. API İsteği
    const response = await fetch(API_CONFIG.HF_MODEL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_CONFIG.HF_API_KEY}`,
        "Content-Type": "application/json",
        "X-Idempotency-Key": idempotencyKey
      },
      body: JSON.stringify({ inputs: text }),
    });

    // 4. Cevabı önce metin olarak al (Direkt .json() yaparsak ve hata gelirse patlar)
    const responseText = await response.text();
    let result;

    try {
      result = JSON.parse(responseText);
    } catch (e) {
      // Eğer gelen cevap JSON değilse (örn: 500 HTML sayfası), hatayı yakala
      throw new Error(`API Beklenmeyen Yanıt Döndü: ${responseText.substring(0, 50)}...`);
    }
    
    // 5. Hugging Face'e özgü hataları kontrol et
    if (result.error) {
      // "Model is currently loading" hatası çok yaygındır
      if (typeof result.error === 'string' && result.error.includes("loading")) {
        console.warn("⏳ Model şu an uyanıyor (Cold Start). 20-30 saniye sonra tekrar deneyin.");
        // Kullanıcıya hissettirmemek için bu seferlik Mock dönelim
        return await mockAnalyzeService(text);
      }
      throw new Error(result.error);
    }

    // 6. Sonucu İşle
    const sentiment = parseSentimentResult(result);
    
    const suggestions = {
      positive: "Harika bir gün! Enerjini yüksek tutmak için sevdiğin bir şarkıyı aç.",
      negative: "Zor zamanlar geçici. Derin bir nefes al ve 5 dakika yürüyüş yap.",
      neutral: "Sakin ve dengeli bir gün. Kitap okumak veya film izlemek için harika."
    };

    return {
      sentiment,
      summary: "Yapay Zeka analizi başarıyla tamamlandı.",
      suggestion: suggestions[sentiment]
    };

  } catch (error) {
    // 7. Hata Yönetimi (Fallback)
    console.error("🔴 API HATASI:", error.message);
    console.log("⚠️ Otomatik olarak Mock (Yedek) servise geçiliyor...");
    return await mockAnalyzeService(text);
  }
};