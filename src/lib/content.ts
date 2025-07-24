// Content Management System for Diction Training Application
// Comprehensive content organized by skill levels and categories

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type ContentCategory = 'breathing' | 'syllable' | 'articulation' | 'tongue_twister' | 'reading';

export interface Exercise {
  id: string;
  title: string;
  description: string;
  level: SkillLevel;
  category: ContentCategory;
  content: string;
  duration?: number;
  difficulty: number; // 1-10
  tags: string[];
  instructions: string[];
  tips: string[];
  goals: string[];
}

export interface BreathingExerciseData {
  id: string;
  name: string;
  level: SkillLevel;
  inhaleTime: number;
  holdTime: number;
  exhaleTime: number;
  cycles: number;
  description: string;
  instructions: string[];
  benefits: string[];
  difficulty: number;
}

export interface SyllableExerciseData {
  id: string;
  name: string;
  level: SkillLevel;
  syllables: string[];
  patterns: string[];
  description: string;
  instructions: string[];
  difficulty: number;
  focusArea: string;
}

export interface ArticulationExerciseData {
  id: string;
  name: string;
  level: SkillLevel;
  type: 'consonant' | 'vowel' | 'combination' | 'tongue_twister';
  content: string[];
  description: string;
  instructions: string[];
  difficulty: number;
  targetSounds: string[];
}

// Comprehensive Breathing Exercises Database
export const breathingExercisesDatabase: BreathingExerciseData[] = [
  // Beginner Level
  {
    id: 'basic-4-4-4',
    name: 'Temel Nefes Ritmi',
    level: 'beginner',
    inhaleTime: 4,
    holdTime: 0,
    exhaleTime: 4,
    cycles: 5,
    description: 'En temel nefes egzersizi. Günlük hayatta rahatlamak için kullanılabilir.',
    instructions: [
      'Rahat bir pozisyonda oturun',
      'Omuzlarınızı gevşetin',
      '4 saniye boyunca burnunuzdan nefes alın',
      '4 saniye boyunca ağzınızdan nefes verin',
      'Nefes verirken dudaklarınızı hafifçe büzün'
    ],
    benefits: ['Stresin azalması', 'Nefes kontrolünün gelişmesi', 'Genel rahatlama'],
    difficulty: 1
  },
  {
    id: 'diaphragm-basic',
    name: 'Temel Diyafram Nefesi',
    level: 'beginner',
    inhaleTime: 3,
    holdTime: 1,
    exhaleTime: 4,
    cycles: 8,
    description: 'Diyafram kasını aktif kullanmayı öğreten temel egzersiz.',
    instructions: [
      'Sırtüstü yatın, dizlerinizi kıvırın',
      'Bir elinizi göğsünüze, diğerini karnınıza koyun',
      'Göğsünüz sabit kalırken karnınız şişmelidir',
      'Nefesi yavaşça burnunuzdan alın',
      'Ağızdan kontrollü şekilde verin'
    ],
    benefits: ['Diyafram kontrolü', 'Ses kalitesinin artması', 'Nefes kapasitesinin gelişmesi'],
    difficulty: 2
  },
  {
    id: 'box-breathing-beginner',
    name: 'Yeni Başlayan Kutu Nefesi',
    level: 'beginner',
    inhaleTime: 3,
    holdTime: 3,
    exhaleTime: 3,
    cycles: 6,
    description: 'Konsantrasyonu artıran ve zihin netliği sağlayan temel kutu nefesi.',
    instructions: [
      'Dik oturun, gözlerinizi kapatın',
      '3 saniye nefes alın',
      '3 saniye tutun',
      '3 saniye verin',
      '3 saniye bekleyin ve tekrarlayın'
    ],
    benefits: ['Konsantrasyon artışı', 'Zihinsel netlik', 'Konuşma öncesi hazırlık'],
    difficulty: 2
  },

  // Intermediate Level
  {
    id: 'extended-breathing',
    name: 'Uzatılmış Nefes',
    level: 'intermediate',
    inhaleTime: 6,
    holdTime: 2,
    exhaleTime: 8,
    cycles: 6,
    description: 'Nefes kapasitesini artırmak ve uzun konuşmalar için hazırlık.',
    instructions: [
      'Ayakta durun, omurganızı dik tutun',
      'Nefesi alt karından başlayarak alın',
      'Göğüs kafesi genişletilerek devam edin',
      'Üst göğse kadar doldurun',
      'Ters sırayla kontrollü şekilde boşaltın'
    ],
    benefits: ['Nefes kapasitesi artışı', 'Uzun konuşma yeteneği', 'Ses gücünün artması'],
    difficulty: 4
  },
  {
    id: 'power-breathing',
    name: 'Güç Nefesi',
    level: 'intermediate',
    inhaleTime: 5,
    holdTime: 5,
    exhaleTime: 10,
    cycles: 5,
    description: 'Ses gücünü artırmak ve performans öncesi enerji toplamak için.',
    instructions: [
      'Ayakları omuz genişliğinde açık durun',
      'Kollarınızı yanlara açın',
      'Güçlü bir şekilde nefes alın',
      'Karın kaslarınızı sıkarak tutun',
      'Kontrollü ve güçlü şekilde verin'
    ],
    benefits: ['Ses gücü artışı', 'Enerji seviyesinin yükselmesi', 'Performans öncesi hazırlık'],
    difficulty: 5
  },
  {
    id: 'rhythm-breathing',
    name: 'Ritmik Nefes',
    level: 'intermediate',
    inhaleTime: 4,
    holdTime: 4,
    exhaleTime: 4,
    cycles: 8,
    description: 'Konuşma ritmini geliştirmek için tasarlanmış nefes egzersizi.',
    instructions: [
      'Metronom kullanın (60 BPM)',
      'Her sayımı zihinsel olarak sayın',
      'Nefes alırken 1-2-3-4',
      'Tutarken 1-2-3-4',
      'Verirken 1-2-3-4'
    ],
    benefits: ['Konuşma ritmi', 'Tempo kontrolü', 'Düzenli nefes alışkanlığı'],
    difficulty: 5
  },

  // Advanced Level
  {
    id: 'performance-breathing',
    name: 'Performans Nefesi',
    level: 'advanced',
    inhaleTime: 8,
    holdTime: 4,
    exhaleTime: 12,
    cycles: 5,
    description: 'Uzun performanslar ve konuşmalar için gelişmiş nefes tekniği.',
    instructions: [
      'Derin meditasyon pozisyonunda oturun',
      'Nefesi 3 aşamada alın: karın-orta-üst',
      'Tüm akciğer kapasitesini kullanın',
      'Kontrollü şekilde 4 saniye tutun',
      '3 aşamada boşaltın: üst-orta-karın'
    ],
    benefits: ['Maksimum nefes kapasitesi', 'Uzun performans yeteneği', 'Gelişmiş ses kontrolü'],
    difficulty: 7
  },
  {
    id: 'variable-breathing',
    name: 'Değişken Nefes',
    level: 'advanced',
    inhaleTime: 6,
    holdTime: 3,
    exhaleTime: 9,
    cycles: 6,
    description: 'Farklı konuşma durumlarına uyum sağlamak için değişken nefes kontrolü.',
    instructions: [
      'İlk 2 döngü normal tempoda',
      'Sonraki 2 döngü yavaş tempoda',
      'Son 2 döngü hızlı tempoda',
      'Her tempo değişiminde konsantrasyonu koruyun',
      'Nefes kalitesinden ödün vermeyin'
    ],
    benefits: ['Adaptasyon yeteneği', 'Konuşma esnekliği', 'Stres yönetimi'],
    difficulty: 8
  },
  {
    id: 'circular-breathing',
    name: 'Dairesel Nefes',
    level: 'advanced',
    inhaleTime: 10,
    holdTime: 2,
    exhaleTime: 15,
    cycles: 4,
    description: 'Kesintisiz konuşma için gelişmiş nefes tekniği.',
    instructions: [
      'Yanakları şişirerek hava depolayın',
      'Burnunuzdan nefes alırken ağızdan hava verin',
      'Sürekli hava akışını koruyun',
      'Dil pozisyonunu sabit tutun',
      'Çok yavaş ve kontrollü hareket edin'
    ],
    benefits: ['Kesintisiz konuşma', 'Uzun cümle kurma', 'Profesyonel seviye kontrol'],
    difficulty: 9
  },

  // Expert Level
  {
    id: 'master-breathing',
    name: 'Usta Seviye Nefes',
    level: 'expert',
    inhaleTime: 12,
    holdTime: 6,
    exhaleTime: 18,
    cycles: 3,
    description: 'En üst seviye nefes kontrolü ve profesyonel performans.',
    instructions: [
      'Tüm vücut farkındalığını kullanın',
      'İnterkostal kasları aktif kullanın',
      'Pelvik taban kaslarını dahil edin',
      'Zihinsel konsantrasyonu maksimumda tutun',
      'Nefes ve hareket uyumunu sağlayın'
    ],
    benefits: ['Profesyonel seviye kontrol', 'Tam vücut koordinasyonu', 'Mükemmel ses kalitesi'],
    difficulty: 10
  },
  {
    id: 'endurance-breathing',
    name: 'Dayanıklılık Nefesi',
    level: 'expert',
    inhaleTime: 8,
    holdTime: 8,
    exhaleTime: 16,
    cycles: 6,
    description: 'Uzun süreli performanslar için maksimum dayanıklılık.',
    instructions: [
      'Kardiyovasküler sistemle uyumlu çalışın',
      'Oksijen kullanımını optimize edin',
      'Kas hafızasını geliştirin',
      'Mental dayanıklılığı artırın',
      'Perfekte yakın teknik uygulayın'
    ],
    benefits: ['Maksimum dayanıklılık', 'Optimal oksijen kullanımı', 'Profesyonel performans'],
    difficulty: 10
  }
];

// Comprehensive Syllable Exercises Database
export const syllableExercisesDatabase: SyllableExerciseData[] = [
  // Beginner Level
  {
    id: 'basic-vowels',
    name: 'Temel Sesli Harfler',
    level: 'beginner',
    syllables: ['A', 'E', 'I', 'O', 'U', 'Ö', 'Ü'],
    patterns: ['A-E-I-O-U', 'U-O-I-E-A', 'A-I-O-U-E'],
    description: 'Temel sesli harf telaffuzu ve ağız pozisyonları.',
    instructions: [
      'Ağzınızı doğru pozisyonda açın',
      'Her sesi 3 saniye tutun',
      'Sesleri temiz ve net çıkarın',
      'Nefes kontrolünü koruyun',
      'Yavaş tempoda başlayın'
    ],
    difficulty: 1,
    focusArea: 'Sesli harf netliği'
  },
  {
    id: 'simple-syllables',
    name: 'Basit Heceler',
    level: 'beginner',
    syllables: ['BA', 'DA', 'GA', 'LA', 'MA', 'NA', 'RA', 'SA', 'TA', 'YA'],
    patterns: ['BA-DA-GA', 'LA-MA-NA', 'RA-SA-TA', 'YA-BA-DA'],
    description: 'Temel ünsüz-sesli harf kombinasyonları.',
    instructions: [
      'Her heceyi ayrı ayrı telaffuz edin',
      'Ünsüz sesleri güçlü çıkarın',
      'Sesli harfleri açık söyleyin',
      'Tempolu olarak tekrarlayın',
      'Dudak ve dil pozisyonuna dikkat edin'
    ],
    difficulty: 2,
    focusArea: 'Temel hece oluşumu'
  },
  {
    id: 'beginner-combinations',
    name: 'Yeni Başlayan Kombinasyonları',
    level: 'beginner',
    syllables: ['BE-LE', 'DE-RE', 'GE-KE', 'ME-NE', 'PE-TE', 'SE-ŞE'],
    patterns: ['BE-LE-DE-RE', 'GE-KE-ME-NE', 'PE-TE-SE-ŞE'],
    description: 'Temel hece kombinasyonları ve geçişler.',
    instructions: [
      'Heceleri bağlayarak söyleyin',
      'Geçişlerde duraksama yapmayın',
      'Her heceyi eşit güçte söyleyin',
      'Ritmi tutarlı tutun',
      'Nefes kontrolünü koruyun'
    ],
    difficulty: 2,
    focusArea: 'Hece bağlantıları'
  },

  // Intermediate Level
  {
    id: 'complex-syllables',
    name: 'Karmaşık Heceler',
    level: 'intermediate',
    syllables: ['BRA', 'DRE', 'GRI', 'KRO', 'PRA', 'TRE', 'ŞTI', 'SKA'],
    patterns: ['BRA-DRE-GRI', 'KRO-PRA-TRE', 'ŞTI-SKA-BRA'],
    description: 'Ünsüz kümeleri içeren karmaşık hece yapıları.',
    instructions: [
      'Ünsüz kümelerini net söyleyin',
      'Her ünsüzü ayrı ayrı çıkarın',
      'Sesli harfi açık telaffuz edin',
      'Hızı yavaş yavaş artırın',
      'Doğruluk hızdan önemlidir'
    ],
    difficulty: 5,
    focusArea: 'Ünsüz kümeleri'
  },
  {
    id: 'rhythm-syllables',
    name: 'Ritmik Heceler',
    level: 'intermediate',
    syllables: ['TI-KA', 'TA-KI', 'TU-KU', 'TE-KE', 'TO-KO'],
    patterns: ['TI-KA-TA-KI', 'TU-KU-TE-KE', 'TO-KO-TI-KA'],
    description: 'Konuşma ritmini geliştiren hece egzersizleri.',
    instructions: [
      'Metronom temposunu kullanın',
      'Her heceyi aynı uzunlukta söyleyin',
      'Vurguyu eşit dağıtın',
      'Tempoyı sabit tutun',
      'Ritimsel kalıpları ezberleyin'
    ],
    difficulty: 5,
    focusArea: 'Ritim ve tempo'
  },
  {
    id: 'intermediate-clusters',
    name: 'Orta Seviye Kümeler',
    level: 'intermediate',
    syllables: ['SPLA', 'STRA', 'SKRE', 'SPRE', 'STRI', 'SKRU'],
    patterns: ['SPLA-STRA-SKRE', 'SPRE-STRI-SKRU'],
    description: 'Gelişmiş ünsüz küme kombinasyonları.',
    instructions: [
      'Her ünsüzü temiz telaffuz edin',
      'Hızla geçişler yapmayın',
      'Nefes kontrolünü koruyun',
      'Ağız pozisyonunu doğru ayarlayın',
      'Sabırlı olun ve tekrarlayın'
    ],
    difficulty: 6,
    focusArea: 'Gelişmiş küme telaffuzu'
  },

  // Advanced Level
  {
    id: 'advanced-combinations',
    name: 'İleri Seviye Kombinasyonlar',
    level: 'advanced',
    syllables: ['STRAŞ', 'SKRIPT', 'SPLEND', 'STRENGT'],
    patterns: ['STRAŞ-SKRIPT-SPLEND', 'STRENGT-STRAŞ-SKRIPT'],
    description: 'En karmaşık hece yapıları ve kombinasyonlar.',
    instructions: [
      'Eksiksiz artikülasyon yapın',
      'Her sesi kristal netliğinde çıkarın',
      'Hız ve doğruluk dengesini kurun',
      'Nefes ekonomisini optimize edin',
      'Mükemmellik için tekrarlayın'
    ],
    difficulty: 8,
    focusArea: 'Kompleks artikülasyon'
  },
  {
    id: 'speed-syllables',
    name: 'Hız Heceleri',
    level: 'advanced',
    syllables: ['LA-LE-LI-LO-LU', 'RA-RE-RI-RO-RU', 'NA-NE-NI-NO-NU'],
    patterns: ['LA-LE-LI-LO-LU-RA-RE-RI-RO-RU', 'NA-NE-NI-NO-NU-LA-LE-LI-LO-LU'],
    description: 'Hızlı konuşma için hece alıştırmaları.',
    instructions: [
      'Yavaş başlayıp hızı artırın',
      'Netlikten ödün vermeyin',
      'Düzenli nefes alın',
      'Her heceyi eşit vurgulayın',
      'Maksimum hızda kontrol saglayın'
    ],
    difficulty: 8,
    focusArea: 'Hızlı telaffuz'
  },

  // Expert Level
  {
    id: 'expert-mastery',
    name: 'Uzman Seviye Ustalık',
    level: 'expert',
    syllables: ['KOMPLEKS', 'STRÜKTÜR', 'PRENSIP', 'KRITERIUM'],
    patterns: ['KOMPLEKS-STRÜKTÜR-PRENSIP', 'KRITERIUM-KOMPLEKS-STRÜKTÜR'],
    description: 'Uzman seviye artikülasyon ve telaffuz mükemmelliği.',
    instructions: [
      'Fonetik mükemmellik hedefleyin',
      'Profesyonel seviye netlik sağlayın',
      'Tüm teknikleri birleştirin',
      'Otomatik doğruluk geliştirin',
      'Sanatsal seviye performans gösterin'
    ],
    difficulty: 10,
    focusArea: 'Profesyonel ustalık'
  }
];

// Comprehensive Articulation Exercises Database
export const articulationExercisesDatabase: ArticulationExerciseData[] = [
  // Beginner Level - Consonants
  {
    id: 'basic-p-b',
    name: 'P-B Sesleri',
    level: 'beginner',
    type: 'consonant',
    content: ['PA-BA', 'PE-BE', 'PI-BI', 'PO-BO', 'PU-BU', 'PAP-BAB', 'PEP-BEB'],
    description: 'Dudak patlamalı sessiz harflerinin telaffuzu.',
    instructions: [
      'Dudaklarınızı sıkıca kapatın',
      'Havanın birikimine izin verin',
      'Ani bir açılışla sesi çıkarın',
      'P sessiz, B sesli olmalıdır',
      'Temiz patlatma sesi yapın'
    ],
    difficulty: 1,
    targetSounds: ['P', 'B']
  },
  {
    id: 'basic-t-d',
    name: 'T-D Sesleri',
    level: 'beginner',
    type: 'consonant',
    content: ['TA-DA', 'TE-DE', 'TI-DI', 'TO-DO', 'TU-DU', 'TAT-DAD', 'TET-DED'],
    description: 'Dil ucu patlamalı sessiz harflerinin telaffuzu.',
    instructions: [
      'Dil ucunu üst dişlerin arkasına değdirin',
      'Havanın çıkışını engelleyin',
      'Ani bir çekilme ile sesi çıkarın',
      'T sessiz, D sesli olmalıdır',
      'Net patlatma yapın'
    ],
    difficulty: 1,
    targetSounds: ['T', 'D']
  },
  {
    id: 'basic-k-g',
    name: 'K-G Sesleri',
    level: 'beginner',
    type: 'consonant',
    content: ['KA-GA', 'KE-GE', 'KI-GI', 'KO-GO', 'KU-GU', 'KAK-GAG', 'KEK-GEG'],
    description: 'Arka damak patlamalı sessiz harflerinin telaffuzu.',
    instructions: [
      'Dil arkasını yumuşak damağa değdirin',
      'Ağız boşluğunda basınç oluşturun',
      'Ani açılma ile sesi çıkarın',
      'K sessiz, G sesli olmalıdır',
      'Güçlü patlatma yapın'
    ],
    difficulty: 2,
    targetSounds: ['K', 'G']
  },

  // Beginner Level - Vowels
  {
    id: 'vowel-precision',
    name: 'Sesli Harf Hassasiyeti',
    level: 'beginner',
    type: 'vowel',
    content: ['A-E-I-O-U', 'Ö-Ü-A-E-I', 'U-O-Ö-Ü-I'],
    description: 'Türkçe sesli harflerin doğru telaffuzu.',
    instructions: [
      'Her sesli harf için ağız pozisyonunu değiştirin',
      'A: Ağız tam açık, dil düz',
      'E: Ağız yarı açık, dil hafif yüksek',
      'I: Ağız az açık, dil yüksek',
      'O: Dudaklar yuvarlak, dil düşük',
      'U: Dudaklar en yuvarlak, dil düşük',
      'Ö: O gibi ama dil hafif yüksek',
      'Ü: U gibi ama dil yüksek'
    ],
    difficulty: 2,
    targetSounds: ['A', 'E', 'I', 'O', 'U', 'Ö', 'Ü']
  },

  // Intermediate Level
  {
    id: 'fricatives-intermediate',
    name: 'Sürtünmeli Sesler',
    level: 'intermediate',
    type: 'consonant',
    content: ['FA-VA', 'SA-ZA', 'ŞA-JA', 'HA-RA', 'FASA-VAZA', 'ŞAŞA-JAJA'],
    description: 'Sürtünmeli sessiz harflerin net telaffuzu.',
    instructions: [
      'Hava akışını daraltarak sürtünme yaratın',
      'F-V: Üst dişler alt dudağa değsin',
      'S-Z: Dil ucu dişlere yakın',
      'Ş-J: Dil ortası damağa yakın',
      'Sürekli hava akışını koruyun'
    ],
    difficulty: 4,
    targetSounds: ['F', 'V', 'S', 'Z', 'Ş', 'J']
  },
  {
    id: 'liquid-sounds',
    name: 'Akıcı Sesler',
    level: 'intermediate',
    type: 'consonant',
    content: ['LA-RA', 'LE-RE', 'LI-RI', 'LO-RO', 'LARA-RALA', 'LERE-RELE'],
    description: 'L ve R seslerinin net ayırımı ve telaffuzu.',
    instructions: [
      'L: Dil ucu damağa değsin, yanlardan hava çıksın',
      'R: Dil ucu titreyerek damağa çarpsın',
      'İkisi arasındaki farkı netleştirin',
      'Yavaş başlayıp hızı artırın',
      'Her sesi ayrı ayrı kontrol edin'
    ],
    difficulty: 5,
    targetSounds: ['L', 'R']
  },

  // Advanced Level
  {
    id: 'complex-clusters',
    name: 'Karmaşık Kümelenmeler',
    level: 'advanced',
    type: 'combination',
    content: ['STRA', 'SKRA', 'SPLA', 'SPLEND', 'STRONG', 'STRAND'],
    description: 'Çoklu ünsüz kümelenmelerinin kusursuz telaffuzu.',
    instructions: [
      'Her ünsüzü ayrı ayrı artiküle edin',
      'Geçişleri kesintisiz yapın',
      'Nefes ekonomisini koruyun',
      'Hız ve netlik dengesini kurun',
      'Perfekte yakın telaffuz hedefleyin'
    ],
    difficulty: 8,
    targetSounds: ['STR', 'SKR', 'SPL']
  },

  // Expert Level - Tongue Twisters
  {
    id: 'expert-twisters',
    name: 'Uzman Seviye Tekerleme',
    level: 'expert',
    type: 'tongue_twister',
    content: [
      'Şu şişe şurup şişesi',
      'Kartal kalkar dal sarkar, dal sarkar kartal kalkar',
      'Bu baklava kime baklava, bana baklava',
      'Çok çabuk çakıl çuvalı çıkardı',
      'Bir berber bir berbere berber misin demiş'
    ],
    description: 'En zor tekerleme örnekleri ile telaffuz mükemmelliği.',
    instructions: [
      'Her kelimeyi kristal netliğinde söyleyin',
      'Yavaş başlayıp hızı artırın',
      'Hiçbir sesi atlamayın',
      'Nefes kontrolünü koruyun',
      'Mükemmel olana kadar tekrarlayın'
    ],
    difficulty: 10,
    targetSounds: ['Ş', 'K', 'B', 'Ç', 'R']
  }
];

// Reading Passages Database
export const readingPassagesDatabase: Exercise[] = [
  // Beginner Level
  {
    id: 'basic-reading-1',
    title: 'Doğa ve Mevsimler',
    description: 'Temel telaffuz için basit doğa metni.',
    level: 'beginner',
    category: 'reading',
    content: `Bahar geldi, ağaçlar çiçek açtı. Kuşlar şarkı söylüyor. 
    Güneş parlıyor, hava ısındı. Çocuklar parkta oynuyor. 
    Yeşil çimenlerde koşuyorlar. Çiçekler çok güzel kokuyor.`,
    difficulty: 1,
    tags: ['doğa', 'mevsimler', 'temel'],
    instructions: [
      'Her kelimeyi net telaffuz edin',
      'Noktalama işaretlerinde durun',
      'Yavaş ve anlaşılır okuyun',
      'Nefes kontrolünü koruyun'
    ],
    tips: [
      'Sessiz harfleri güçlü çıkarın',
      'Sesli harfleri açık söyleyin',
      'Ritminizi sabit tutun'
    ],
    goals: [
      'Net telaffuz',
      'Doğru tonlama',
      'Anlaşılır okuma'
    ]
  },
  {
    id: 'basic-reading-2',
    title: 'Aile ve Ev',
    description: 'Günlük yaşam kelimeleri ile basit okuma.',
    level: 'beginner',
    category: 'reading',
    content: `Evimiz çok güzel. Annem mutfakta yemek yapıyor. 
    Babam gazetesini okuyor. Kardeşim ödevini yapıyor. 
    Kedimiz koltuğun üzerinde uyuyor. Hep birlikte çok mutluyuz.`,
    difficulty: 1,
    tags: ['aile', 'ev', 'günlük yaşam'],
    instructions: [
      'Duygulu okuyun',
      'Her cümleyi anlamlandırın',
      'Doğal tonlamayı kullanın',
      'Kelimeleri birbirine bağlayın'
    ],
    tips: [
      'Cümle melodisini takip edin',
      'Anlamı vurgulayın',
      'Dinleyiciyi düşünün'
    ],
    goals: [
      'Duygusal ifade',
      'Doğal konuşma',
      'Anlam aktarımı'
    ]
  },

  // Intermediate Level
  {
    id: 'intermediate-reading-1',
    title: 'Tarihsel Hikaye',
    description: 'Orta seviye kelime dağarcığı ile tarihsel metin.',
    level: 'intermediate',
    category: 'reading',
    content: `Osmanlı İmparatorluğu'nun kuruluş döneminde, Osman Gazi 
    küçük bir beyliğin lideri olarak başladığı yolculuğunda, 
    Anadolu'nun farklı bölgelerinde yaşayan kavimleri birleştirmeyi 
    başardı. Bu birleşme süreci hem diplomatik hem de askeri 
    yeteneklerin bir araya gelmesi ile mümkün olmuştur.`,
    difficulty: 5,
    tags: ['tarih', 'osmanlı', 'akademik'],
    instructions: [
      'Uzun cümleleri nefes kontrolü ile okuyun',
      'Özel isimleri vurgulayın',
      'Akademik tonu koruyun',
      'Anlamsal grupları ayırın'
    ],
    tips: [
      'Kompleks cümle yapılarına dikkat edin',
      'Tarihsel atmosferi yansıtın',
      'Objektif ton kullanın'
    ],
    goals: [
      'Akademik okuma',
      'Uzun nefes kontrolü',
      'Karmaşık cümle telaffuzu'
    ]
  },

  // Advanced Level
  {
    id: 'advanced-reading-1',
    title: 'Felsefi Düşünce',
    description: 'İleri seviye soyut kavramlar ve karmaşık cümle yapıları.',
    level: 'advanced',
    category: 'reading',
    content: `Varoluşçu felsefenin temel paradigması, insanın özgürlüğünün 
    sorumluluğunun kaçınılmaz sonucu olduğu düşüncesine dayanmaktadır. 
    Bu perspektiften bakıldığında, birey kendi kimliğini yaratma 
    sürecinde aldığı kararlarla hem kendisini hem de içinde bulunduğu 
    toplumsal yapıyı şekillendirmektedir. Sartre'ın ifadesiyle, 
    'mahkûm olduğumuz özgürlük' kavramı bu durumu en iyi şekilde açıklar.`,
    difficulty: 8,
    tags: ['felsefe', 'soyut', 'akademik', 'karmaşık'],
    instructions: [
      'Soyut kavramları netleştirin',
      'Felsefi terminolojiyi vurgulayın',
      'Düşünce akışını koruyun',
      'Entelektüel tonu yansıtın'
    ],
    tips: [
      'Kavramsal vurgulamalar yapın',
      'Argüman yapısını takip edin',
      'Analitik ton kullanın'
    ],
    goals: [
      'Felsefi metin okuma',
      'Soyut kavram telaffuzu',
      'Entelektüel iletişim'
    ]
  },

  // Expert Level
  {
    id: 'expert-reading-1',
    title: 'Şiir: Yahya Kemal',
    description: 'Klasik Türk şiiri ve poetik ifade teknikleri.',
    level: 'expert',
    category: 'reading',
    content: `"Açıldı kapılar, erişti murad;
    İçindeki hüznü koparıp attı.
    Seher vakti bir hoş sadâ ile,
    Gönül kuşu ötmeye başladı.
    
    Ne tatlı hayatın bu deminde,
    Ümitsizliğin karı eridi.
    Gözünde sürurla yaş oldukça,
    Bu rûhun buzağır derindi."`,
    difficulty: 10,
    tags: ['şiir', 'klasik', 'sanat', 'poetik'],
    instructions: [
      'Şiirsel ritmi koruyun',
      'Duygusal tonlamayı kullanın',
      'Vezin yapısını hissedin',
      'Poetik atmosferi yaratın'
    ],
    tips: [
      'Her mısranın duygusunu yansıtın',
      'Ahenkli okuyun',
      'Sanatsal ifadeyi öncelleyin'
    ],
    goals: [
      'Poetik ifade',
      'Sanatsal telaffuz',
      'Duygusal derinlik'
    ]
  }
];

// Content Management Functions
export class ContentManager {
  static filterByLevel(exercises: any[], level: SkillLevel): any[] {
    return exercises.filter(exercise => exercise.level === level);
  }

  static filterByDifficulty(exercises: any[], minDifficulty: number, maxDifficulty: number): any[] {
    return exercises.filter(exercise => 
      exercise.difficulty >= minDifficulty && exercise.difficulty <= maxDifficulty
    );
  }

  static getExerciseById(exercises: any[], id: string): any | undefined {
    return exercises.find(exercise => exercise.id === id);
  }

  static getRandomExercises(exercises: any[], count: number): any[] {
    const shuffled = [...exercises].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  static getProgressiveExercises(exercises: any[], currentLevel: SkillLevel): any[] {
    const levelOrder: SkillLevel[] = ['beginner', 'intermediate', 'advanced', 'expert'];
    const currentIndex = levelOrder.indexOf(currentLevel);
    
    let result: any[] = [];
    
    // Include current level and previous levels
    for (let i = 0; i <= currentIndex; i++) {
      result.push(...this.filterByLevel(exercises, levelOrder[i]));
    }
    
    // Add a few exercises from next level if available
    if (currentIndex < levelOrder.length - 1) {
      const nextLevelExercises = this.filterByLevel(exercises, levelOrder[currentIndex + 1]);
      result.push(...nextLevelExercises.slice(0, 2));
    }
    
    return result;
  }

  static searchExercises(exercises: any[], query: string): any[] {
    const lowercaseQuery = query.toLowerCase();
    return exercises.filter(exercise => 
      exercise.name?.toLowerCase().includes(lowercaseQuery) ||
      exercise.title?.toLowerCase().includes(lowercaseQuery) ||
      exercise.description?.toLowerCase().includes(lowercaseQuery) ||
      exercise.tags?.some((tag: string) => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  static getRecommendedNext(exercises: any[], completedExercises: string[], userLevel: SkillLevel): any[] {
    // Filter out completed exercises
    const available = exercises.filter(exercise => !completedExercises.includes(exercise.id));
    
    // Get exercises for current level and slightly above
    const levelOrder: SkillLevel[] = ['beginner', 'intermediate', 'advanced', 'expert'];
    const currentIndex = levelOrder.indexOf(userLevel);
    const targetLevels = levelOrder.slice(currentIndex, currentIndex + 2);
    
    const recommended = available.filter(exercise => targetLevels.includes(exercise.level));
    
    // Sort by difficulty
    return recommended.sort((a, b) => a.difficulty - b.difficulty);
  }

  // Lazy loading support
  static async loadExerciseContent(exerciseId: string): Promise<any> {
    // Simulate async loading for large content
    return new Promise(resolve => {
      setTimeout(() => {
        // In a real app, this would fetch from a database or API
        const allExercises = [
          ...breathingExercisesDatabase,
          ...syllableExercisesDatabase,
          ...articulationExercisesDatabase,
          ...readingPassagesDatabase
        ];
        
        const exercise = allExercises.find(ex => ex.id === exerciseId);
        resolve(exercise);
      }, 100);
    });
  }

  // Performance optimization: Get exercise metadata without full content
  static getExerciseMetadata(exercises: any[]): Array<{id: string, title?: string, name?: string, level: SkillLevel, difficulty: number}> {
    return exercises.map(exercise => ({
      id: exercise.id,
      title: exercise.title || exercise.name,
      name: exercise.name || exercise.title,
      level: exercise.level,
      difficulty: exercise.difficulty
    }));
  }
}

// Usage statistics and analytics
export interface UsageStats {
  totalExercisesCompleted: number;
  exercisesByLevel: Record<SkillLevel, number>;
  exercisesByCategory: Record<ContentCategory, number>;
  averageDifficulty: number;
  streakDays: number;
  totalTimeSpent: number; // in minutes
}

export class AnalyticsManager {
  static calculateUserLevel(stats: UsageStats): SkillLevel {
    const { exercisesByLevel, averageDifficulty } = stats;
    
    if (exercisesByLevel.expert > 5 && averageDifficulty > 8) return 'expert';
    if (exercisesByLevel.advanced > 10 && averageDifficulty > 6) return 'advanced';
    if (exercisesByLevel.intermediate > 15 && averageDifficulty > 3) return 'intermediate';
    return 'beginner';
  }

  static getRecommendedDifficulty(stats: UsageStats): number {
    const currentLevel = this.calculateUserLevel(stats);
    const baseMap = { beginner: 2, intermediate: 5, advanced: 7, expert: 9 };
    return baseMap[currentLevel];
  }

  static getWeakAreas(stats: UsageStats): ContentCategory[] {
    const categories: ContentCategory[] = ['breathing', 'syllable', 'articulation', 'tongue_twister', 'reading'];
    const avgPerCategory = stats.totalExercisesCompleted / 5;
    
    return categories.filter(category => 
      stats.exercisesByCategory[category] < avgPerCategory * 0.7
    );
  }
}