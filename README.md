# Diksiyon Geliştirme Uygulaması

Konuşma kalitenizi artırmak için tasarlanmış kapsamlı diksiyon geliştirme uygulaması. Nefes kontrolü, telaffuz ve artikülasyon becerilerinizi geliştirin.

## 🎯 Özellikler

### 🔊 Ses Analizi
- **Pitch Analizi**: Ses tonunuzu ve frekans aralığınızı analiz eder
- **Tempo Kontrolü**: Konuşma hızınızı ve ritminizi ölçer
- **Netlik Değerlendirmesi**: Ünsüz ve ünlü seslerinizin netliğini değerlendirir
- **Gerçek Zamanlı Feedback**: Anlık ses analizi ve puanlama

### 🎙️ Ses Kaydı
- **Yüksek Kalite Kayıt**: 44.1kHz sampling rate ile profesyonel kalite
- **Ses Seviyesi Görselleştirme**: Kayıt sırasında anlık ses seviyesi takibi
- **Kayıt Geçmişi**: Son 5 kaydınızı saklama ve dinleme

### 🌬️ Nefes Egzersizleri
- **Temel Nefes**: Başlangıç seviyesi için (4-2-4 döngüsü)
- **Derin Nefes**: İleri seviye için (6-3-6 döngüsü)
- **Performans Nefesi**: Uzun konuşmalar için (8-4-8 döngüsü)
- **İlerleme Takibi**: Tamamlanan seans sayısını takip eder

### 📝 Heceleme Egzersizleri
- **6 Farklı Kelime**: Kolay, orta ve zor seviyelerinde
- **Hece Hece Öğrenme**: Her heceyi ayrı ayrı çalışma
- **Telaffuz Desteği**: Web Speech API ile sesli telaffuz
- **İlerleme Kaydı**: Tamamlanan kelimeleri takip eder

### 🎯 Artikülasyon Pratiği
- **6 Zor Tekerleme**: Farklı ses gruplarına odaklanan egzersizler
- **Hız Kontrolü**: 0.3x ile 1.2x arası hız ayarı
- **Kendini Değerlendirme**: 1-5 yıldız puanlama sistemi
- **Hedef Ses Analizi**: Her egzersizin odaklandığı sesleri gösterir

### 📊 İlerleme Takibi
- **Genel İlerleme**: Tüm kategorilerdeki performansınızı gösterir
- **Kategori Bazlı Analiz**: Her egzersiz türünde detaylı ilerleme
- **Başarım Rozetleri**: Özel hedeflere ulaştığınızda kazanılan rozetler
- **Kişisel Öneriler**: Gelişim alanlarınıza göre özelleştirilmiş tavsiyeler

## 🚀 Kullanım

### Gereksinimler
- Modern web tarayıcısı (Chrome, Firefox, Safari, Edge)
- Mikrofon erişimi (ses analizi ve kayıt için)
- İnternet bağlantısı (Text-to-Speech için)

### Başlangıç
1. Uygulamayı açın
2. Mikrofon iznini verin
3. İstediğiniz egzersiz kategorisini seçin
4. Talimatları takip ederek egzersizlere başlayın

## 🔧 Teknik Detaylar

### Kullanılan Teknolojiler
- **React 19**: Modern UI framework
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: Modern UI component library
- **Web Audio API**: Ses analizi ve kayıt
- **Web Speech API**: Text-to-Speech functionality
- **Vite**: Fast build tool
- **Phosphor Icons**: Beautiful icon set

### Browser Compatibility
- Chrome 88+
- Firefox 84+
- Safari 14+
- Edge 88+

### Performance Features
- **Code Splitting**: Lazy loading of components
- **React.memo**: Optimized re-rendering
- **Suspense**: Loading states for better UX
- **PWA Ready**: Offline capability with service worker

## 🔒 Güvenlik ve Gizlilik

### Veri Güvenliği
- **Lokal Depolama**: Tüm veriler tarayıcınızda saklanır
- **Sunucuya Veri Gönderilmez**: Ses kayıtları ve analizler cihazınızda kalır
- **Şifreli Depolama**: Spark KV sistemi ile güvenli saklama

### Mikrofon Erişimi
- **İzin Kontrolü**: Açık izin talep sistemi
- **Geçici Erişim**: Sadece kayıt sırasında mikrofon aktif
- **Otomatik Kapatma**: Kayıt bittiğinde stream otomatik kapatılır

## 📱 PWA Özellikleri

### Offline Kullanım
- Ana uygulama offline çalışır
- Egzersizler internet bağlantısı olmadan kullanılabilir
- Text-to-Speech için internet gerekir

### Mobil Optimizasyon
- Responsive design
- Touch-friendly interface
- Mobile-first navigation
- App-like experience

## 🎨 Customization

### Tema Renkleri
CSS değişkenlerini `src/index.css` dosyasından düzenleyebilirsiniz:
```css
:root {
  --primary: oklch(0.35 0.08 240);
  --secondary: oklch(0.75 0.06 220);
  --accent: oklch(0.65 0.12 200);
}
```

## 🐛 Known Issues

### Browser Limitations
- **iOS Safari**: Web Audio API kısıtlamaları nedeniyle bazı özellikler sınırlı olabilir
- **Firefox Mobile**: Text-to-Speech kalitesi Chrome'a göre daha düşük
- **Eski Tarayıcılar**: MediaRecorder API desteği gereklidir

### Troubleshooting
- **Mikrofon çalışmıyor**: Tarayıcı iznilerini kontrol edin
- **Ses çıkmıyor**: Sistem ses seviyesini kontrol edin
- **Yavaş performans**: Tarayıcı cache'ini temizleyin

## 📈 Future Updates

### Planlanan Özellikler
- [ ] Gelişmiş ses analizi algoritmaları
- [ ] Özelleştirilebilen egzersiz listeleri
- [ ] Sesli geri bildirim sistemi
- [ ] Multi-language support
- [ ] Export/import functionality
- [ ] Advanced statistics and charts

## 🤝 Contributing

Bu açık kaynak bir projedir. Katkılarınızı bekliyoruz:

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Push edin (`git push origin feature/AmazingFeature`)
5. Pull Request açın

## 📄 License

Bu proje MIT lisansı ile lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 📞 Support

Sorularınız için:
- GitHub Issues kullanın
- Feedback ve önerilerinizi paylaşın
- Bug raporlarını detaylı açıklama ile gönderin

---

**Not**: Bu uygulama eğitim amaçlıdır. Profesyonel diksiyon eğitimi için uzman desteği alınması önerilir.