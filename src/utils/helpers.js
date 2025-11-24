/**
 * Benzersiz bir işlem anahtarı üretir (Idempotency Key)
 */
export const generateIdempotencyKey = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Tarihi kullanıcı dostu formata çevirir
 */
export const formatDate = (isoString) => {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * API'den gelen karmaşık skorları basit bir duyguya çevirir
 * GÜNCELLENDİ: 'twitter-xlm-roberta-base-sentiment' modeli için ayarlandı.
 * Model Çıktıları:
 * LABEL_0 -> Negative
 * LABEL_1 -> Neutral
 * LABEL_2 -> Positive
 */
export const parseSentimentResult = (apiResult) => {
  if (Array.isArray(apiResult) && apiResult[0]) {
    // En yüksek skoru en üste al
    const sorted = [...apiResult[0]].sort((a, b) => b.score - a.score);
    const topLabel = sorted[0].label.toUpperCase(); // Büyük harfe çevir garanti olsun
    
    // Yeni Modelin Etiketleri
    if (topLabel === 'LABEL_2' || topLabel.includes('POSITIVE')) return 'positive';
    if (topLabel === 'LABEL_0' || topLabel.includes('NEGATIVE')) return 'negative';
    
    // Eskiden kalan veya nötr durumlar
    return 'neutral';
  }
  return 'neutral';
};