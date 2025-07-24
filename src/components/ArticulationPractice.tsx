import React, { useState } from 'react';
import { Megaphone, Play, Pause, RotateCcw, Star } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useKV } from '@github/spark/hooks';

interface TongueTwister {
  id: string;
  text: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  focus: string;
  description: string;
  targetSounds: string[];
}

const tongueTwisters: TongueTwister[] = [
  {
    id: '1',
    text: 'Şu köşe yaz köşesi, şu köşe kış köşesi',
    difficulty: 'beginner',
    focus: 'Ş-K sesleri',
    description: 'Şın ve Kef harflerinin netleştirilmesi',
    targetSounds: ['ş', 'k']
  },
  {
    id: '2',
    text: 'Bir berber bir berbere gel beraber bir berber dükkanı açalım demiş',
    difficulty: 'intermediate',
    focus: 'B-R sesleri',
    description: 'Be ve Re harflerinin artikülasyonu',
    targetSounds: ['b', 'r']
  },
  {
    id: '3',
    text: 'Çiçek açar açmaz çiçek açacak çiçek açmaktan çekinmez',
    difficulty: 'advanced',
    focus: 'Ç-C sesleri',
    description: 'Çe ve Ce harflerinin ayrımı',
    targetSounds: ['ç', 'c']
  },
  {
    id: '4',
    text: 'Dal sarkar kartal kalkar, kartal kalkar dal sarkar',
    difficulty: 'intermediate',
    focus: 'D-K-L sesleri',
    description: 'Yumuşak ve sert ünsüzlerin karışımı',
    targetSounds: ['d', 'k', 'l']
  },
  {
    id: '5',
    text: 'Postacı pasta taşır, pastane postacı taşımaz',
    difficulty: 'beginner',
    focus: 'P-T sesleri',
    description: 'Patlayıcı ünsüzlerin netleştirilmesi',
    targetSounds: ['p', 't']
  },
  {
    id: '6',
    text: 'Mızmızlanma mizah yap, mizahını mızıkçılığa çevirme',
    difficulty: 'advanced',
    focus: 'M-Z sesleri',
    description: 'Nazal sesler ve sızıcı ünsüzler',
    targetSounds: ['m', 'z']
  }
];

export function ArticulationPractice() {
  const [selectedTwister, setSelectedTwister] = useState<TongueTwister>(tongueTwisters[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [practiceSpeed, setPracticeSpeed] = useState(0.6);
  const [repetitionCount, setRepetitionCount] = useState(0);
  const [practiceScores, setPracticeScores] = useKV('articulation-scores', {} as Record<string, number>);
  const [dailyPractice, setDailyPractice] = useKV('daily-articulation', 0);

  const playTwister = () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    
    if ('speechSynthesis' in window) {
      // Cancel any existing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(selectedTwister.text);
      utterance.lang = 'tr-TR';
      utterance.rate = practiceSpeed;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => {
        setIsPlaying(false);
        console.warn('Speech synthesis error occurred');
      };
      
      speechSynthesis.speak(utterance);
    } else {
      // Fallback: görselle kullanıcıyı bilgilendir
      alert(`Telaffuz: "${selectedTwister.text}"`);
      setTimeout(() => setIsPlaying(false), 3000);
    }
  };

  const increasePracticeCount = () => {
    setRepetitionCount(prev => prev + 1);
    setDailyPractice(prev => prev + 1);
  };

  const ratePerformance = (rating: number) => {
    setPracticeScores(prev => ({
      ...prev,
      [selectedTwister.id]: Math.max(prev[selectedTwister.id] || 0, rating)
    }));
    increasePracticeCount();
  };

  const resetPractice = () => {
    setRepetitionCount(0);
    setPracticeSpeed(0.6);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Başlangıç';
      case 'intermediate': return 'Orta';
      case 'advanced': return 'İleri';
      default: return 'Bilinmiyor';
    }
  };

  const getSpeedText = (speed: number) => {
    if (speed <= 0.5) return 'Çok Yavaş';
    if (speed <= 0.7) return 'Yavaş';
    if (speed <= 0.9) return 'Normal';
    return 'Hızlı';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="h-5 w-5" />
          Artikülasyon Pratiği
        </CardTitle>
        <CardDescription>
          Zungırlama egzersizleri ile dil ve dudak kaslarınızı geliştirin
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tongue Twister Selection */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Egzersiz Seçin</h3>
          <div className="grid grid-cols-1 gap-3">
            {tongueTwisters.map((twister) => (
              <Button
                key={twister.id}
                variant={selectedTwister.id === twister.id ? "default" : "outline"}
                className="h-auto p-4 flex flex-col items-start gap-2"
                onClick={() => {
                  setSelectedTwister(twister);
                  resetPractice();
                }}
              >
                <div className="flex items-center gap-2 w-full justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={getDifficultyColor(twister.difficulty)}>
                      {getDifficultyText(twister.difficulty)}
                    </Badge>
                    <span className="text-sm font-medium">{twister.focus}</span>
                  </div>
                  {practiceScores[twister.id] && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm">{practiceScores[twister.id]}/5</span>
                    </div>
                  )}
                </div>
                <div className="text-left text-sm text-muted-foreground">
                  {twister.description}
                </div>
                <div className="text-left font-medium">
                  "{twister.text}"
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Practice Area */}
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div className="p-6 bg-secondary/10 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">{selectedTwister.focus}</h3>
              <p className="text-3xl font-bold text-primary leading-relaxed">
                "{selectedTwister.text}"
              </p>
              <p className="text-sm text-muted-foreground mt-3">
                {selectedTwister.description}
              </p>
            </div>

            {/* Target Sounds */}
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="text-sm text-muted-foreground">Hedef sesler:</span>
              {selectedTwister.targetSounds.map((sound, index) => (
                <Badge key={index} variant="secondary">
                  {sound.toUpperCase()}
                </Badge>
              ))}
            </div>
          </div>

          {/* Speed Control */}
          <div className="space-y-3">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">
                Hız: {getSpeedText(practiceSpeed)}
              </div>
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPracticeSpeed(Math.max(0.3, practiceSpeed - 0.1))}
                >
                  Yavaşlat
                </Button>
                <div className="px-4 py-2 bg-secondary/20 rounded text-sm font-medium">
                  {Math.round(practiceSpeed * 100)}%
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPracticeSpeed(Math.min(1.2, practiceSpeed + 0.1))}
                >
                  Hızlandır
                </Button>
              </div>
            </div>
          </div>

          {/* Play Controls */}
          <div className="flex gap-2 justify-center">
            <Button
              onClick={playTwister}
              disabled={isPlaying}
              size="lg"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 mr-2" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              Örneği Dinle
            </Button>
            
            <Button onClick={resetPractice} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Sıfırla
            </Button>
          </div>

          {/* Self Assessment */}
          <div className="space-y-3">
            <h4 className="text-center text-sm font-medium text-muted-foreground">
              Performansınızı değerlendirin:
            </h4>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  variant={practiceScores[selectedTwister.id] >= rating ? "default" : "outline"}
                  size="sm"
                  onClick={() => ratePerformance(rating)}
                  className="w-12 h-12"
                >
                  <Star 
                    className={`h-4 w-4 ${
                      practiceScores[selectedTwister.id] >= rating 
                        ? 'fill-current' 
                        : ''
                    }`} 
                  />
                </Button>
              ))}
            </div>
          </div>

          {/* Practice Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-secondary/20 rounded-lg">
              <div className="text-sm text-muted-foreground">Bu Egzersiz</div>
              <div className="text-xl font-semibold text-secondary-foreground">
                {repetitionCount} tekrar
              </div>
            </div>
            
            <div className="text-center p-3 bg-secondary/20 rounded-lg">
              <div className="text-sm text-muted-foreground">Bugün Toplam</div>
              <div className="text-xl font-semibold text-secondary-foreground">
                {dailyPractice} tekrar
              </div>
            </div>
          </div>

          {/* Overall Progress */}
          {Object.keys(practiceScores).length > 0 && (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground text-center">
                Genel İlerleme
              </div>
              <Progress 
                value={(Object.keys(practiceScores).length / tongueTwisters.length) * 100} 
                className="h-2" 
              />
              <div className="text-center text-sm text-muted-foreground">
                {Object.keys(practiceScores).length} / {tongueTwisters.length} egzersiz tamamlandı
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}