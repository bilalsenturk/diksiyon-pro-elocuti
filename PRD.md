# Diksiyon Geliştirme Uygulaması PRD

Diksiyon kursuna katılan öğrencilerin ses kalitesini, telaffuzunu ve konuşma becerilerini sistematik olarak geliştirmelerine yardımcı olan interaktif bir eğitim platformu.

**Experience Qualities**:
1. **Destekleyici** - Öğrencilerin kendilerini güvende hissedebilecekleri, hatalarından öğrenebilecekleri bir ortam
2. **İlham Verici** - Her egzersiz sonrası ilerleme görebilen, motive olan bir deneyim
3. **Profesyonel** - Diksiyon uzmanları tarafından onaylanmış, bilimsel temelli egzersizler

**Complexity Level**: Light Application (multiple features with basic state)
Ses kaydı, analiz, egzersiz takibi ve ilerleme ölçümü gibi birden fazla özellik içeriyor ancak karmaşık hesap yönetimi gerektirmiyor.

## Essential Features

### Ses Kaydı ve Analiz
- **Functionality**: Öğrencilerin seslerini kaydetme ve gerçek zamanlı analiz
- **Purpose**: Mevcut diksiyon seviyesini objektif olarak değerlendirmek
- **Trigger**: "Kaydet" butonuna basma veya otomatik başlatma
- **Progression**: Mikrofon izni → Kayıt başlatma → Gerçek zamanlı görselleştirme → Kayıt durdurma → Analiz sonuçları
- **Success criteria**: Temiz ses kaydı alınması ve analiz sonuçlarının görüntülenmesi

### Heceleme Egzersizleri
- **Functionality**: Zor telaffuz edilen kelimeleri hece hece öğretme
- **Purpose**: Karmaşık kelimelerin doğru telaffuzunu geliştirmek
- **Trigger**: Egzersiz kategorisinden hece çalışması seçme
- **Progression**: Kelime seçimi → Hece ayrıştırma → Tek tek hece pratiği → Tam kelime pratiği → Değerlendirme
- **Success criteria**: Öğrencinin kelimeyi doğru telaffuz edebilmesi

### Nefes Kontrol Egzersizleri
- **Functionality**: Nefes alma-verme temposunu ve süresini ölçen egzersizler
- **Purpose**: Konuşma sırasında nefes kontrolünü geliştirmek
- **Trigger**: Nefes egzersizi modülünü seçme
- **Progression**: Egzersiz seçimi → Görsel rehber takibi → Nefes alma/verme → Süre ölçümü → İlerleme kaydı
- **Success criteria**: Belirlenen sürede düzenli nefes alıp verebilme

### Artikülasyon Pratiği
- **Functionality**: Zungırlama ve artikülasyon egzersizleri
- **Purpose**: Dil ve dudak kas hafızasını geliştirmek
- **Trigger**: Artikülasyon bölümünü açma
- **Progression**: Egzersiz seçimi → Örnek dinleme → Taklit etme → Kayıt → Karşılaştırma → Skorlama
- **Success criteria**: Örnekle benzer kalitede telaffuz yapabilme

### İlerleme Takibi
- **Functionality**: Günlük, haftalık ve aylık ilerleme grafikleri
- **Purpose**: Motivasyon sağlamak ve gelişim alanlarını belirlemek
- **Trigger**: Dashboard'a girme veya egzersiz tamamlama
- **Progression**: Veri toplama → Analiz → Görselleştirme → İyileştirme önerileri
- **Success criteria**: Açık ve anlaşılır ilerleme göstergelerinin görüntülenmesi

## Edge Case Handling

- **Mikrofon Erişimi Reddedilirse**: Alternatif egzersiz modlarına yönlendirme ve geçici çözümler sunma
- **Ses Kalitesi Düşükse**: Otomatik filtreler ve kullanıcıyı uygun ortam konusunda bilgilendirme
- **Ağ Bağlantısı Kesilirse**: Offline mod ile temel egzersizlere devam edebilme
- **Farklı Aksan/Şive**: Bölgesel varyasyonları tanıyan ve uyarlanabilen sistem
- **Yaş Grupları**: Çocuk, genç ve yetişkin ses tonlarına uygun farklı değerlendirme kriterleri

## Design Direction

Tasarım sakin, güven verici ve profesyonel hissettirmeli - tıpkı özel bir diksiyon stüdyosunun atmosferi gibi. Minimal arayüz tercih edilecek çünkü kullanıcıların odaklanması gereken şey ses çalışması, arayüz değil.

## Color Selection

Analogous (adjacent colors on color wheel) - Mavi ve yeşil tonları kullanarak sakinlik ve güven hissi yaratacak, aynı zamanda teknolojik ve profesyonel bir görünüm sağlayacak.

- **Primary Color**: Derin Lacivert (oklch(0.35 0.08 240)) - Güven, profesyonellik ve ciddiyet iletir
- **Secondary Colors**: Açık Mavi (oklch(0.75 0.06 220)) - Sakinlik ve berraklık için; Yumuşak Yeşil (oklch(0.70 0.05 160)) - İlerleme ve başarı hissi için
- **Accent Color**: Canlı Turkuaz (oklch(0.65 0.12 200)) - Interaktif elementler ve CTA'lar için dikkat çekici
- **Foreground/Background Pairings**: 
  - Background (Beyaz oklch(0.98 0 0)): Koyu Gri text (oklch(0.25 0 0)) - Ratio 14.8:1 ✓
  - Card (Açık Gri oklch(0.95 0 0)): Koyu Gri text (oklch(0.25 0 0)) - Ratio 12.6:1 ✓
  - Primary (Derin Lacivert oklch(0.35 0.08 240)): Beyaz text (oklch(0.98 0 0)) - Ratio 8.2:1 ✓
  - Accent (Canlı Turkuaz oklch(0.65 0.12 200)): Beyaz text (oklch(0.98 0 0)) - Ratio 4.9:1 ✓

## Font Selection

Typeface'ler netlik ve okunabilirği vurgulamalı - çünkü diksiyon uygulamasında metin bilgisi kritik öneme sahip. Inter font ailesi seçilecek çünkü hem dijital ekranlarda mükemmel okunabilirlik hem de profesyonel görünüm sağlıyor.

- **Typographic Hierarchy**: 
  - H1 (Ana Başlık): Inter Bold/32px/tight letter spacing
  - H2 (Bölüm Başlıkları): Inter SemiBold/24px/normal spacing  
  - H3 (Alt Başlıklar): Inter Medium/18px/normal spacing
  - Body (Ana Metin): Inter Regular/16px/relaxed line height
  - Caption (Yardımcı Bilgiler): Inter Regular/14px/normal spacing

## Animations

Animasyonlar dikkat dağıtmadan kullanıcı deneyimini desteklemeli - özellikle ses kaydı sırasında minimum dikkat dağınıklığı yaratmalı.

- **Purposeful Meaning**: Yumuşak geçişler ve nefes egzersizlerinde görsel rehberlik sağlayan ritmik animasyonlar kullanılacak
- **Hierarchy of Movement**: Ses seviyesi göstergeleri ve ilerleme çubukları öncelikli animasyon alacak, menü geçişleri minimal olacak

## Component Selection

- **Components**: 
  - Cards (egzersiz modülleri için)
  - Progress bars (ilerleme takibi)
  - Buttons (kayıt kontrolleri)
  - Dialog (detaylı analiz sonuçları)
  - Tabs (farklı egzersiz kategorileri)
  - Slider (ses seviyesi kontrolleri)
- **Customizations**: Ses dalga formu görselleştirici, nefes egzersizi rehberi, real-time ses analiz widget'ı
- **States**: 
  - Kayıt butonları: varsayılan/hover/aktif/kayıt halinde/durduruldu durumları
  - İlerleme göstergeleri: yükleme/tamamlandı/başarısız durumları
- **Icon Selection**: Phosphor icons kullanılacak - mikrofon, oynat/durdur, ses dalgası, trend yukarı (ilerleme) iconları
- **Spacing**: Tailwind'in 4/8/16/24px spacing scale'i kullanılacak, nefes alma egzersizlerinde extra generous spacing
- **Mobile**: Mobile-first yaklaşım, büyük dokunma alanları, dikey stack layout, ses kaydı için optimize edilmiş kontroller