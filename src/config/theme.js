// UI Temaları ve Renk Paletleri
export const THEME = {
  colors: {
    primary: '#6C63FF', 
    secondary: '#FF6584', 
    accent: '#3F3D56', 
    background: '#F9F9F9', 
    cardBg: '#FFFFFF',
    text: '#2D3436',
    textLight: '#636E72',
    placeholder: '#B2BEC3',
    danger: '#FF7675',
    disabled: '#DFE6E9',
    success: '#55EFC4'
  },
  
  // --- İŞTE ARKA PLAN RENGİ AYARLARI BURADA ---
  sentiment: {
    // POZİTİF: Canlı Sarı ve Turuncu geçişi (Güneş gibi)
    positive: ['#FFD200', '#F7971E'], 
    
    // NEGATİF: Kasvetli Gri ve Koyu Gri geçişi (Bulutlu hava gibi)
    negative: ['#BDC3C7', '#2C3E50'], 
    
    // NÖTR: Sakin Mavi/Mor (Varsayılan)
    neutral: ['#a18cd1', '#fbc2eb'],  
  },

  shadows: {
    soft: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    },
    strong: {
      shadowColor: "#6C63FF",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 15,
      elevation: 10,
    }
  }
};