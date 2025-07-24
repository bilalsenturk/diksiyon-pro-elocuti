import React, { useState, useCallback, useMemo } from 'react';
import { Megaphone, Play, Pause, RotateCcw, Star, FunnelSimple, Trophy, Target, BookOpen, Volume2 } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useKV } from '@github/spark/hooks';
import { SpeechSynthesisService } from '@/lib/speechSynthesis';
import { articulationExercisesDatabase, ContentManager, type ArticulationExerciseData, type SkillLevel } from '@/lib/content';
import { toast } from 'sonner';

export function ArticulationPractice() {
  const [selectedExercise, setSelectedExercise] = useState<ArticulationExerciseData>(articulationExercisesDatabase[0]);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel | 'all'>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'consonant' | 'vowel' | 'combination' | 'tongue_twister'>('all');
  const [userLevel, setUserLevel] = useKV<SkillLevel>('user-level', 'beginner');
  const [completedExercises, setCompletedExercises] = useKV<string[]>('completed-articulation-exercises', []);
  const [practiceStats, setPracticeStats] = useKV('articulation-practice-stats', { totalTime: 0, completedItems: 0 });
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');

  // Filter exercises based on selected criteria
  const filteredExercises = useMemo(() => {
    let exercises = articulationExercisesDatabase;
    
    // Filter by level
    if (selectedLevel !== 'all') {
      exercises = ContentManager.filterByLevel(exercises, selectedLevel);
    } else {
      exercises = ContentManager.getProgressiveExercises(exercises, userLevel);
    }
    
    // Filter by type
    if (selectedType !== 'all') {
      exercises = exercises.filter(ex => ex.type === selectedType);
    }
    
    return exercises;
  }, [selectedLevel, selectedType, userLevel]);

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

  // Get type badge color
  const getTypeColor = (type: string): string => {
    const colors = {
      consonant: 'bg-blue-50 text-blue-700',
      vowel: 'bg-green-50 text-green-700',
      combination: 'bg-purple-50 text-purple-700',
      tongue_twister: 'bg-red-50 text-red-700'
    };
    return colors[type] || 'bg-gray-50 text-gray-700';
  };

  const getTypeLabel = (type: string): string => {
    const labels = {
      consonant: 'Ünsüz',
      vowel: 'Sesli',
      combination: 'Kombinasyon',
      tongue_twister: 'Tekerleme'
    };
    return labels[type] || type;
  };

  const getCurrentContent = (): string => {
    return selectedExercise.content[currentContentIndex] || '';
  };

  const playCurrentContent = useCallback(async () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    const textToSpeak = getCurrentContent();
    
    const speechService = SpeechSynthesisService.getInstance();
    
    if (!speechService.isSupported()) {
      toast.info(`Telaffuz desteği mevcut değil. İçerik: "${textToSpeak}"`);
      setTimeout(() => setIsPlaying(false), 1000);
      return;
    }

    // Adjust speech rate based on difficulty
    const speechRate = difficulty === 'easy' ? 0.5 : difficulty === 'normal' ? 0.7 : 0.9;

    const success = await speechService.speak(textToSpeak, {
      lang: 'tr-TR',
      rate: speechRate,
      pitch: 1,
      volume: 1,
      onStart: () => {
        // Speech started
      },
      onEnd: () => {
        setIsPlaying(false);
        // Update practice stats
        setPracticeStats(prev => ({
          totalTime: prev.totalTime + 1,
          completedItems: prev.completedItems + 1
        }));
      },
      onError: () => {
        setIsPlaying(false);
        toast.info(`İçerik: "${textToSpeak}"`);
      }
    });

    if (!success) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentContentIndex, selectedExercise, difficulty, setPracticeStats]);

  const nextContent = useCallback(() => {
    if (currentContentIndex < selectedExercise.content.length - 1) {
      setCurrentContentIndex(prev => prev + 1);
    }
  }, [currentContentIndex, selectedExercise.content.length]);

  const previousContent = useCallback(() => {
    if (currentContentIndex > 0) {
      setCurrentContentIndex(prev => prev - 1);
    }
  }, [currentContentIndex]);

  const markExerciseCompleted = useCallback(() => {
    if (!completedExercises.includes(selectedExercise.id)) {
      setCompletedExercises(prev => [...prev, selectedExercise.id]);
      toast.success(`${selectedExercise.name} tamamlandı! 🎉`);
    }
  }, [selectedExercise.id, completedExercises, setCompletedExercises]);

  const resetExercise = useCallback(() => {
    setCurrentContentIndex(0);
    setIsPlaying(false);
  }, []);

  const selectExercise = useCallback((exercise: ArticulationExerciseData) => {
    setSelectedExercise(exercise);
    resetExercise();
  }, [resetExercise]);

  const getProgress = (): number => {
    return ((currentContentIndex + 1) / selectedExercise.content.length) * 100;
  };

  return (
    <div className="w-full space-y-6">
      {/* Header with Filter Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5" />
                  Artikülasyon Egzersizleri
                </CardTitle>
                <CardDescription>
                  Profesyonel diksiyon için net ve doğru telaffuz teknikleri
                </CardDescription>
              </div>
            </div>
            
            {/* Filter Controls */}
            <div className="flex flex-wrap gap-3">
              <Select value={selectedLevel} onValueChange={(value: SkillLevel | 'all') => setSelectedLevel(value)}>
                <SelectTrigger className="w-[140px]">
                  <FunnelSimple className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Seviye" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Seviyeler</SelectItem>
                  <SelectItem value="beginner">Başlangıç</SelectItem>
                  <SelectItem value="intermediate">Orta</SelectItem>
                  <SelectItem value="advanced">İleri</SelectItem>
                  <SelectItem value="expert">Uzman</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={(value: any) => setSelectedType(value)}>
                <SelectTrigger className="w-[140px]">
                  <Target className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Tür" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Türler</SelectItem>
                  <SelectItem value="consonant">Ünsüz</SelectItem>
                  <SelectItem value="vowel">Sesli</SelectItem>
                  <SelectItem value="combination">Kombinasyon</SelectItem>
                  <SelectItem value="tongue_twister">Tekerleme</SelectItem>
                </SelectContent>
              </Select>

              <Select value={difficulty} onValueChange={(value: any) => setDifficulty(value)}>
                <SelectTrigger className="w-[120px]">
                  <Star className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Kolay Hız</SelectItem>
                  <SelectItem value="normal">Normal Hız</SelectItem>
                  <SelectItem value="hard">Hızlı</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Exercise Selection Grid */}
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
                <Badge className={`text-xs ${getTypeColor(exercise.type)}`}>
                  {getTypeLabel(exercise.type)}
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
                  Hedef Sesler: {exercise.targetSounds.join(', ')}
                </div>
                <div className="text-xs text-muted-foreground">
                  <BookOpen className="h-3 w-3 inline mr-1" />
                  {exercise.content.length} öğe
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Practice Interface */}
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
            <div className="flex gap-2">
              <Badge className={`${getLevelColor(selectedExercise.level)}`}>
                {selectedExercise.level === 'beginner' ? 'Başlangıç' :
                 selectedExercise.level === 'intermediate' ? 'Orta' :
                 selectedExercise.level === 'advanced' ? 'İleri' : 'Uzman'}
              </Badge>
              <Badge className={`${getTypeColor(selectedExercise.type)}`}>
                {getTypeLabel(selectedExercise.type)}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Current Content Display */}
          <div className="text-center space-y-4">
            <div className="text-2xl sm:text-4xl font-bold text-primary py-12 bg-primary/5 rounded-lg border-2 border-primary/20">
              {getCurrentContent()}
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="outline">
                Hedef Sesler: {selectedExercise.targetSounds.join(', ')}
              </Badge>
              <Badge variant="outline">
                Zorluk: {selectedExercise.difficulty}/10
              </Badge>
              <Badge variant="outline">
                {currentContentIndex + 1} / {selectedExercise.content.length}
              </Badge>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>İlerleme</span>
              <span>{Math.round(getProgress())}%</span>
            </div>
            <Progress value={getProgress()} className="h-3" />
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              onClick={previousContent}
              variant="outline"
              disabled={currentContentIndex === 0 || isPlaying}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Önceki
            </Button>

            <Button
              onClick={playCurrentContent}
              disabled={isPlaying}
              size="lg"
              className="min-w-[140px]"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Çalıyor...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Dinle ({difficulty === 'easy' ? 'Yavaş' : difficulty === 'normal' ? 'Normal' : 'Hızlı'})
                </>
              )}
            </Button>

            <Button
              onClick={nextContent}
              variant="outline"
              disabled={currentContentIndex === selectedExercise.content.length - 1 || isPlaying}
            >
              Sonraki
              <Volume2 className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Additional Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button onClick={resetExercise} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Egzersizi Sıfırla
            </Button>

            {getProgress() >= 100 && (
              <Button onClick={markExerciseCompleted} variant="default">
                <Trophy className="h-4 w-4 mr-2" />
                Tamamlandı Olarak İşaretle
              </Button>
            )}
          </div>

          {/* Instructions */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <Tabs defaultValue="instructions" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="instructions">Talimatlar</TabsTrigger>
                  <TabsTrigger value="content">İçerik Listesi</TabsTrigger>
                </TabsList>
                
                <TabsContent value="instructions" className="space-y-3">
                  <h4 className="font-medium">Nasıl Çalışılır:</h4>
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
                </TabsContent>
                
                <TabsContent value="content" className="space-y-3">
                  <h4 className="font-medium">Egzersiz İçeriği:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {selectedExercise.content.map((item, index) => (
                      <Button
                        key={index}
                        variant={index === currentContentIndex ? "default" : "outline"}
                        size="sm"
                        className="text-left justify-start"
                        onClick={() => setCurrentContentIndex(index)}
                      >
                        <span className="mr-2 text-xs">{index + 1}.</span>
                        {item}
                      </Button>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-muted-foreground">Zorluk Seviyesi</div>
              <div className="text-xl font-semibold text-blue-600">
                {selectedExercise.difficulty}/10
              </div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-sm text-muted-foreground">İçerik Sayısı</div>
              <div className="text-xl font-semibold text-green-600">
                {selectedExercise.content.length}
              </div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-sm text-muted-foreground">Tamamlanan</div>
              <div className="text-xl font-semibold text-purple-600">
                {completedExercises.length}
              </div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-sm text-muted-foreground">Toplam Çalışma</div>
              <div className="text-xl font-semibold text-orange-600">
                {practiceStats.completedItems}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}