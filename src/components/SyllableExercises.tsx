import React, { useState } from 'react';
import { Volume2, Play, Pause, Check, RotateCcw } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useKV } from '@github/spark/hooks';

interface Word {
  id: string;
  word: string;
  syllables: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  meaning: string;
}

const practiceWords: Word[] = [
  {
    id: '1',
    word: 'artikülasyon',
    syllables: ['ar', 'ti', 'kü', 'las', 'yon'],
    difficulty: 'hard',
    meaning: 'Seslerin ağızda oluşturulması'
  },
  {
    id: '2',
    word: 'entonasyon',
    syllables: ['en', 'to', 'nas', 'yon'],
    difficulty: 'medium',
    meaning: 'Ses tonundaki değişiklikler'
  },
  {
    id: '3',
    word: 'telaffuz',
    syllables: ['te', 'laf', 'fuz'],
    difficulty: 'easy',
    meaning: 'Sözcükleri doğru sesletme'
  },
  {
    id: '4',
    word: 'mikrofonlar',
    syllables: ['mik', 'ro', 'fon', 'lar'],
    difficulty: 'medium',
    meaning: 'Ses alma cihazları'
  },
  {
    id: '5',
    word: 'karakteristik',
    syllables: ['ka', 'rak', 'te', 'ris', 'tik'],
    difficulty: 'hard',
    meaning: 'Ayırt edici özellik'
  },
  {
    id: '6',
    word: 'koordinasyon',
    syllables: ['ko', 'or', 'di', 'nas', 'yon'],
    difficulty: 'hard',
    meaning: 'Uyumlu çalışma'
  }
];

interface SyllableDisplayProps {
  syllables: string[];
  currentSyllable: number;
  onSyllableClick: (index: number) => void;
}

function SyllableDisplay({ syllables, currentSyllable, onSyllableClick }: SyllableDisplayProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {syllables.map((syllable, index) => (
        <Button
          key={index}
          variant={index === currentSyllable ? "default" : "outline"}
          size="lg"
          className="text-lg font-medium min-w-16"
          onClick={() => onSyllableClick(index)}
        >
          {syllable}
        </Button>
      ))}
    </div>
  );
}

export function SyllableExercises() {
  const [selectedWord, setSelectedWord] = useState<Word>(practiceWords[0]);
  const [currentSyllable, setCurrentSyllable] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [practiceMode, setPracticeMode] = useState<'syllables' | 'full'>('syllables');
  const [completedWords, setCompletedWords] = useKV('completed-syllable-words', [] as string[]);

  const playCurrentSyllable = () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    const syllableText = practiceMode === 'syllables' 
      ? selectedWord.syllables[currentSyllable]
      : selectedWord.word;
    
    // Web Speech API kullanarak telaffuz
    if ('speechSynthesis' in window) {
      // Cancel any existing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(syllableText);
      utterance.lang = 'tr-TR';
      utterance.rate = 0.7;
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
      alert(`Telaffuz: "${syllableText}"`);
      setTimeout(() => setIsPlaying(false), 1000);
    }
  };

  const nextSyllable = () => {
    if (currentSyllable < selectedWord.syllables.length - 1) {
      setCurrentSyllable(prev => prev + 1);
    }
  };

  const previousSyllable = () => {
    if (currentSyllable > 0) {
      setCurrentSyllable(prev => prev - 1);
    }
  };

  const markWordCompleted = () => {
    if (!completedWords.includes(selectedWord.id)) {
      setCompletedWords(prev => [...prev, selectedWord.id]);
    }
  };

  const resetProgress = () => {
    setCurrentSyllable(0);
    setPracticeMode('syllables');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Kolay';
      case 'medium': return 'Orta';
      case 'hard': return 'Zor';
      default: return 'Bilinmiyor';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Heceleme Egzersizleri
        </CardTitle>
        <CardDescription>
          Zor kelimeleri hece hece öğrenerek telaffuzunuzu geliştirin
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Word Selection */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Kelime Seçin</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {practiceWords.map((word) => (
              <Button
                key={word.id}
                variant={selectedWord.id === word.id ? "default" : "outline"}
                className="h-auto p-3 flex flex-col items-start gap-1"
                onClick={() => {
                  setSelectedWord(word);
                  resetProgress();
                }}
              >
                <div className="flex items-center gap-2 w-full">
                  <span className="font-medium">{word.word}</span>
                  {completedWords.includes(word.id) && (
                    <Check className="h-4 w-4 text-green-600" />
                  )}
                </div>
                <Badge className={getDifficultyColor(word.difficulty)}>
                  {getDifficultyText(word.difficulty)}
                </Badge>
                <div className="text-xs text-muted-foreground text-left">
                  {word.meaning}
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Practice Area */}
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-2">
                {selectedWord.word}
              </h3>
              <p className="text-muted-foreground">{selectedWord.meaning}</p>
            </div>
            
            {/* Mode Toggle */}
            <div className="flex gap-2 justify-center">
              <Button
                variant={practiceMode === 'syllables' ? "default" : "outline"}
                onClick={() => setPracticeMode('syllables')}
              >
                Hece Hece
              </Button>
              <Button
                variant={practiceMode === 'full' ? "default" : "outline"}
                onClick={() => setPracticeMode('full')}
              >
                Tam Kelime
              </Button>
            </div>
          </div>

          {practiceMode === 'syllables' ? (
            <div className="space-y-6">
              <SyllableDisplay
                syllables={selectedWord.syllables}
                currentSyllable={currentSyllable}
                onSyllableClick={setCurrentSyllable}
              />
              
              <div className="text-center">
                <div className="text-lg text-muted-foreground mb-2">
                  Şu anki hece:
                </div>
                <div className="text-4xl font-bold text-primary mb-4">
                  {selectedWord.syllables[currentSyllable]}
                </div>
                
                <div className="flex gap-2 justify-center">
                  <Button
                    variant="outline"
                    onClick={previousSyllable}
                    disabled={currentSyllable === 0}
                  >
                    Önceki
                  </Button>
                  
                  <Button
                    onClick={playCurrentSyllable}
                    disabled={isPlaying}
                    size="lg"
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4 mr-2" />
                    ) : (
                      <Play className="h-4 w-4 mr-2" />
                    )}
                    Dinle
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={nextSyllable}
                    disabled={currentSyllable === selectedWord.syllables.length - 1}
                  >
                    Sonraki
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="text-4xl font-bold text-primary">
                {selectedWord.word}
              </div>
              
              <Button
                onClick={playCurrentSyllable}
                disabled={isPlaying}
                size="lg"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4 mr-2" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                Tam Kelimeyi Dinle
              </Button>
            </div>
          )}

          <div className="flex gap-2 justify-center">
            <Button onClick={resetProgress} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Sıfırla
            </Button>
            
            <Button onClick={markWordCompleted} variant="secondary">
              <Check className="h-4 w-4 mr-2" />
              Tamamlandı
            </Button>
          </div>
        </div>

        {/* Progress */}
        {completedWords.length > 0 && (
          <div className="text-center p-3 bg-secondary/20 rounded-lg">
            <div className="text-sm text-muted-foreground">Tamamlanan Kelimeler</div>
            <div className="text-xl font-semibold text-secondary-foreground">
              {completedWords.length} / {practiceWords.length}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}