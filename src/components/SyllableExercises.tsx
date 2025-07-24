import React, { useState, useCallback, useMemo } from 'react';
import { Volume2, Play, Pause, Check, RotateCcw, FunnelSimple, Trophy, Target, BookOpen, ChevronLeft, ChevronRight } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useKV } from '@github/spark/hooks';
import { SpeechSynthesisService } from '@/lib/speechSynthesis';
import { syllableExercisesDatabase, ContentManager, type SyllableExerciseData, type SkillLevel } from '@/lib/content';
import { toast } from 'sonner';

interface SyllableDisplayProps {
  syllables: string[];
  currentSyllable: number;
  onSyllableClick: (index: number) => void;
  isPlaying: boolean;
}

function SyllableDisplay({ syllables, currentSyllable, onSyllableClick, isPlaying }: SyllableDisplayProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center px-2">
      {syllables.map((syllable, index) => (
        <Button
          key={index}
          variant={index === currentSyllable ? "default" : "outline"}
          size="lg"
          className={`text-base sm:text-lg font-medium min-w-12 sm:min-w-16 break-words transition-all duration-200 ${
            index === currentSyllable && isPlaying ? 'animate-pulse' : ''
          }`}
          onClick={() => onSyllableClick(index)}
          disabled={isPlaying}
        >
          {syllable}
        </Button>
      ))}
    </div>
  );
}

export function SyllableExercises() {
  const [selectedExercise, setSelectedExercise] = useState<SyllableExerciseData>(syllableExercisesDatabase[0]);
  const [currentSyllableIndex, setCurrentSyllableIndex] = useState(0);
  const [currentPatternIndex, setCurrentPatternIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [practiceMode, setPracticeMode] = useState<'syllables' | 'patterns'>('syllables');
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel | 'all'>('all');
  const [userLevel, setUserLevel] = useKV<SkillLevel>('user-level', 'beginner');
  const [completedExercises, setCompletedExercises] = useKV<string[]>('completed-syllable-exercises', []);
  const [sessionProgress, setSessionProgress] = useState(0);

  // Filter exercises based on selected level
  const filteredExercises = useMemo(() => {
    if (selectedLevel === 'all') {
      return ContentManager.getProgressiveExercises(syllableExercisesDatabase, userLevel);
    }
    return ContentManager.filterByLevel(syllableExercisesDatabase, selectedLevel);
  }, [selectedLevel, userLevel]);

  // Get current content based on practice mode
  const currentContent = useMemo(() => {
    if (practiceMode === 'syllables') {
      return selectedExercise.syllables;
    }
    return selectedExercise.patterns;
  }, [practiceMode, selectedExercise]);

  const currentIndex = practiceMode === 'syllables' ? currentSyllableIndex : currentPatternIndex;
  const currentItem = currentContent[currentIndex];

  // Get difficulty badge color
  const getDifficultyColor = (difficulty: number): string => {
    if (difficulty <= 3) return 'bg-green-100 text-green-800';
    if (difficulty <= 6) return 'bg-yellow-100 text-yellow-800';
    if (difficulty <= 8) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  // Get level badge color
  const getLevelColor = (level: SkillLevel): string => {
    const colors = {
      beginner: 'bg-blue-100 text-blue-800',
      intermediate: 'bg-purple-100 text-purple-800',
      advanced: 'bg-orange-100 text-orange-800',
      expert: 'bg-red-100 text-red-800'
    };
    return colors[level];
  };

  const playCurrentItem = useCallback(async () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    const textToSpeak = Array.isArray(currentItem) ? currentItem.join('-') : currentItem;
    
    const speechService = SpeechSynthesisService.getInstance();
    
    if (!speechService.isSupported()) {
      toast.info(`Telaffuz desteği mevcut değil. İçerik: "${textToSpeak}"`);
      setTimeout(() => setIsPlaying(false), 1000);
      return;
    }

    const success = await speechService.speak(textToSpeak, {
      lang: 'tr-TR',
      rate: 0.6,
      pitch: 1,
      volume: 1,
      onStart: () => {
        // Speech started
      },
      onEnd: () => {
        setIsPlaying(false);
      },
      onError: () => {
        setIsPlaying(false);
        toast.info(`İçerik: "${textToSpeak}"`);
      }
    });

    if (!success) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentItem]);

  const nextItem = useCallback(() => {
    if (practiceMode === 'syllables') {
      if (currentSyllableIndex < selectedExercise.syllables.length - 1) {
        setCurrentSyllableIndex(prev => prev + 1);
        setSessionProgress(prev => Math.min(100, prev + (100 / selectedExercise.syllables.length)));
      }
    } else {
      if (currentPatternIndex < selectedExercise.patterns.length - 1) {
        setCurrentPatternIndex(prev => prev + 1);
        setSessionProgress(prev => Math.min(100, prev + (100 / selectedExercise.patterns.length)));
      }
    }
  }, [practiceMode, currentSyllableIndex, currentPatternIndex, selectedExercise]);

  const previousItem = useCallback(() => {
    if (practiceMode === 'syllables') {
      if (currentSyllableIndex > 0) {
        setCurrentSyllableIndex(prev => prev - 1);
        setSessionProgress(prev => Math.max(0, prev - (100 / selectedExercise.syllables.length)));
      }
    } else {
      if (currentPatternIndex > 0) {
        setCurrentPatternIndex(prev => prev - 1);
        setSessionProgress(prev => Math.max(0, prev - (100 / selectedExercise.patterns.length)));
      }
    }
  }, [practiceMode, currentSyllableIndex, currentPatternIndex, selectedExercise]);

  const markExerciseCompleted = useCallback(() => {
    if (!completedExercises.includes(selectedExercise.id)) {
      setCompletedExercises(prev => [...prev, selectedExercise.id]);
      toast.success(`${selectedExercise.name} tamamlandı! 🎉`);
    }
  }, [selectedExercise.id, completedExercises, setCompletedExercises]);

  const resetExercise = useCallback(() => {
    setCurrentSyllableIndex(0);
    setCurrentPatternIndex(0);
    setSessionProgress(0);
    setIsPlaying(false);
  }, []);

  const selectExercise = useCallback((exercise: SyllableExerciseData) => {
    setSelectedExercise(exercise);
    resetExercise();
  }, [resetExercise]);

  const handleItemClick = useCallback((index: number) => {
    if (practiceMode === 'syllables') {
      setCurrentSyllableIndex(index);
    } else {
      setCurrentPatternIndex(index);
    }
  }, [practiceMode]);

  return (
    <div className="w-full space-y-6">
      {/* Header with Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Hece Egzersizleri
              </CardTitle>
              <CardDescription>
                Telaffuz becerilerinizi geliştirmek için sistematik hece çalışmaları
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedLevel} onValueChange={(value: SkillLevel | 'all') => setSelectedLevel(value)}>
                <SelectTrigger className="w-[140px]">
                  <FunnelSimple className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Seviyeler</SelectItem>
                  <SelectItem value="beginner">Başlangıç</SelectItem>
                  <SelectItem value="intermediate">Orta</SelectItem>
                  <SelectItem value="advanced">İleri</SelectItem>
                  <SelectItem value="expert">Uzman</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Exercise Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.map((exercise) => (
          <Card 
            key={exercise.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedExercise.id === exercise.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => selectExercise(exercise)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base font-medium truncate">
                  {exercise.name}
                </CardTitle>
                {completedExercises.includes(exercise.id) && (
                  <Trophy className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                <Badge className={`text-xs ${getLevelColor(exercise.level)}`}>
                  {exercise.level === 'beginner' ? 'Başlangıç' :
                   exercise.level === 'intermediate' ? 'Orta' :
                   exercise.level === 'advanced' ? 'İleri' : 'Uzman'}
                </Badge>
                <Badge className={`text-xs ${getDifficultyColor(exercise.difficulty)}`}>
                  Zorluk {exercise.difficulty}/10
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {exercise.description}
              </p>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">
                  <Target className="h-3 w-3 inline mr-1" />
                  Odak: {exercise.focusArea}
                </div>
                <div className="text-xs text-muted-foreground">
                  <BookOpen className="h-3 w-3 inline mr-1" />
                  {exercise.syllables.length} hece, {exercise.patterns.length} kalıp
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Exercise Interface */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {selectedExercise.name}
                {completedExercises.includes(selectedExercise.id) && (
                  <Trophy className="h-5 w-5 text-yellow-600" />
                )}
              </CardTitle>
              <CardDescription>{selectedExercise.description}</CardDescription>
            </div>
            <Badge className={`${getLevelColor(selectedExercise.level)}`}>
              {selectedExercise.level === 'beginner' ? 'Başlangıç' :
               selectedExercise.level === 'intermediate' ? 'Orta' :
               selectedExercise.level === 'advanced' ? 'İleri' : 'Uzman'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Practice Mode Selection */}
          <Tabs value={practiceMode} onValueChange={(value: 'syllables' | 'patterns') => setPracticeMode(value)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="syllables">Tekil Heceler</TabsTrigger>
              <TabsTrigger value="patterns">Hece Kalıpları</TabsTrigger>
            </TabsList>
            
            <TabsContent value="syllables" className="space-y-6">
              {/* Individual Syllables */}
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold text-primary py-8 bg-primary/5 rounded-lg">
                  {selectedExercise.syllables[currentSyllableIndex] || ''}
                </div>
                
                <SyllableDisplay
                  syllables={selectedExercise.syllables}
                  currentSyllable={currentSyllableIndex}
                  onSyllableClick={handleItemClick}
                  isPlaying={isPlaying}
                />
              </div>
            </TabsContent>

            <TabsContent value="patterns" className="space-y-6">
              {/* Pattern Practice */}
              <div className="text-center space-y-4">
                <div className="text-2xl sm:text-3xl font-bold text-primary py-8 bg-primary/5 rounded-lg">
                  {selectedExercise.patterns[currentPatternIndex] || ''}
                </div>
                
                <div className="flex flex-wrap gap-2 justify-center">
                  {selectedExercise.patterns.map((pattern, index) => (
                    <Button
                      key={index}
                      variant={index === currentPatternIndex ? "default" : "outline"}
                      className={`transition-all duration-200 ${
                        index === currentPatternIndex && isPlaying ? 'animate-pulse' : ''
                      }`}
                      onClick={() => handleItemClick(index)}
                      disabled={isPlaying}
                    >
                      {pattern}
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>İlerleme</span>
              <span>{Math.round(sessionProgress)}%</span>
            </div>
            <Progress value={sessionProgress} className="h-2" />
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              onClick={previousItem}
              variant="outline"
              disabled={currentIndex === 0 || isPlaying}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Önceki
            </Button>

            <Button
              onClick={playCurrentItem}
              disabled={isPlaying}
              size="lg"
              className="min-w-[120px]"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Çalıyor...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Dinle
                </>
              )}
            </Button>

            <Button
              onClick={nextItem}
              variant="outline"
              disabled={currentIndex === currentContent.length - 1 || isPlaying}
            >
              Sonraki
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Additional Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button onClick={resetExercise} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Sıfırla
            </Button>

            {sessionProgress >= 100 && (
              <Button onClick={markExerciseCompleted} variant="default">
                <Check className="h-4 w-4 mr-2" />
                Tamamlandı Olarak İşaretle
              </Button>
            )}
          </div>

          {/* Instructions */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">Nasıl Çalışılır:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {selectedExercise.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-primary/10 text-primary rounded-full text-xs flex items-center justify-center mt-0.5">
                      {index + 1}
                    </span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-muted-foreground">Zorluk</div>
              <div className="text-xl font-semibold text-blue-600">
                {selectedExercise.difficulty}/10
              </div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-sm text-muted-foreground">Hece Sayısı</div>
              <div className="text-xl font-semibold text-green-600">
                {selectedExercise.syllables.length}
              </div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-sm text-muted-foreground">Kalıp Sayısı</div>
              <div className="text-xl font-semibold text-purple-600">
                {selectedExercise.patterns.length}
              </div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-sm text-muted-foreground">Tamamlanan</div>
              <div className="text-xl font-semibold text-orange-600">
                {completedExercises.length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}