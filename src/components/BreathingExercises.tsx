import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Wind, Play, Pause, RotateCcw, FunnelSimple, Info, Trophy } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useKV } from '@github/spark/hooks';
import { toast } from 'sonner';
import { breathingExercisesDatabase, ContentManager, type BreathingExerciseData, type SkillLevel } from '@/lib/content';

export function BreathingExercises() {
  const [selectedExercise, setSelectedExercise] = useState<BreathingExerciseData>(breathingExercisesDatabase[0]);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [completedSessions, setCompletedSessions] = useKV('completed-breathing-sessions', 0);
  const [userLevel, setUserLevel] = useKV<SkillLevel>('user-level', 'beginner');
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel | 'all'>('all');
  const [completedExercises, setCompletedExercises] = useKV<string[]>('completed-breathing-exercises', []);
  const [showInstructions, setShowInstructions] = useState(false);

  // Filter exercises based on selected level
  const filteredExercises = useMemo(() => {
    if (selectedLevel === 'all') {
      return ContentManager.getProgressiveExercises(breathingExercisesDatabase, userLevel);
    }
    return ContentManager.filterByLevel(breathingExercisesDatabase, selectedLevel);
  }, [selectedLevel, userLevel]);

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

  useEffect(() => {
    let interval: number | null = null;

    if (isActive && timeRemaining > 0) {
      interval = window.setInterval(() => {
        setTimeRemaining(time => time - 0.1);
      }, 100);
    } else if (isActive && timeRemaining <= 0) {
      // Move to next phase
      if (currentPhase === 'inhale') {
        if (selectedExercise.holdTime > 0) {
          setCurrentPhase('hold');
          setTimeRemaining(selectedExercise.holdTime);
        } else {
          setCurrentPhase('exhale');
          setTimeRemaining(selectedExercise.exhaleTime);
        }
      } else if (currentPhase === 'hold') {
        setCurrentPhase('exhale');
        setTimeRemaining(selectedExercise.exhaleTime);
      } else if (currentPhase === 'exhale') {
        if (currentCycle < selectedExercise.cycles - 1) {
          setCurrentCycle(cycle => cycle + 1);
          setCurrentPhase('inhale');
          setTimeRemaining(selectedExercise.inhaleTime);
        } else {
          // Exercise completed
          setIsActive(false);
          setCompletedSessions(prev => prev + 1);
          setCompletedExercises(prev => {
            if (!prev.includes(selectedExercise.id)) {
              return [...prev, selectedExercise.id];
            }
            return prev;
          });
          setCurrentCycle(0);
          setCurrentPhase('inhale');
          setTimeRemaining(selectedExercise.inhaleTime);
          toast.success(`${selectedExercise.name} tamamlandı! 🎉`);
        }
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining, currentPhase, currentCycle, selectedExercise, setCompletedSessions, setCompletedExercises]);

  const startExercise = useCallback(() => {
    setIsActive(true);
    setCurrentCycle(0);
    setCurrentPhase('inhale');
    setTimeRemaining(selectedExercise.inhaleTime);
  }, [selectedExercise.inhaleTime]);

  const pauseExercise = useCallback(() => {
    setIsActive(false);
  }, []);

  const resetExercise = useCallback(() => {
    setIsActive(false);
    setCurrentCycle(0);
    setCurrentPhase('inhale');
    setTimeRemaining(selectedExercise.inhaleTime);
  }, [selectedExercise.inhaleTime]);

  const getPhaseText = () => {
    switch (currentPhase) {
      case 'inhale': return 'Nefes Al';
      case 'hold': return 'Tut';
      case 'exhale': return 'Nefes Ver';
    }
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'inhale': return 'text-blue-600';
      case 'hold': return 'text-yellow-600';
      case 'exhale': return 'text-green-600';
    }
  };

  const totalTime = selectedExercise.inhaleTime + selectedExercise.holdTime + selectedExercise.exhaleTime;
  const currentProgress = ((totalTime * currentCycle) + (totalTime - (
    currentPhase === 'inhale' ? timeRemaining + selectedExercise.holdTime + selectedExercise.exhaleTime :
    currentPhase === 'hold' ? timeRemaining + selectedExercise.exhaleTime :
    timeRemaining
  ))) / (totalTime * selectedExercise.cycles) * 100;

  return (
    <div className="w-full space-y-6">
      {/* Header with Filter Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Wind className="h-5 w-5" />
                Nefes Egzersizleri
              </CardTitle>
              <CardDescription>
                Konuşma kalitesini artırmak için nefes kontrolü geliştirin
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
            onClick={() => {
              setSelectedExercise(exercise);
              resetExercise();
            }}
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
              <div className="text-xs text-muted-foreground space-y-1">
                <div>Nefes Al: {exercise.inhaleTime}s</div>
                {exercise.holdTime > 0 && <div>Tut: {exercise.holdTime}s</div>}
                <div>Nefes Ver: {exercise.exhaleTime}s</div>
                <div>Döngü: {exercise.cycles}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Exercise Details */}
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowInstructions(!showInstructions)}
            >
              <Info className="h-4 w-4 mr-2" />
              Talimatlar
            </Button>
          </div>
        </CardHeader>
        
        <Collapsible open={showInstructions} onOpenChange={setShowInstructions}>
          <CollapsibleContent>
            <CardContent className="pt-0 border-t">
              <Tabs defaultValue="instructions" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="instructions">Talimatlar</TabsTrigger>
                  <TabsTrigger value="benefits">Faydalar</TabsTrigger>
                </TabsList>
                <TabsContent value="instructions" className="space-y-2">
                  <h4 className="font-medium">Nasıl Yapılır:</h4>
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
                <TabsContent value="benefits" className="space-y-2">
                  <h4 className="font-medium">Faydalar:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {selectedExercise.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-600">•</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
              </Tabs>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>

        <CardContent className={showInstructions ? 'pt-0' : ''}>
          {/* Exercise Display */}
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className={`w-32 h-32 rounded-full border-4 transition-all duration-300 flex items-center justify-center ${
                isActive ? 'border-primary scale-110 animate-pulse' : 'border-muted'
              }`}>
                <div className="text-center">
                  <div className={`text-lg font-semibold ${getPhaseColor()}`}>
                    {getPhaseText()}
                  </div>
                  <div className="text-2xl font-mono">
                    {timeRemaining.toFixed(1)}s
                  </div>
                </div>
              </div>
              
              {isActive && (
                <div className="absolute -inset-4 rounded-full border-2 border-primary/50 animate-ping" />
              )}
            </div>

            <div className="text-center space-y-3 w-full max-w-xs">
              <div className="text-sm text-muted-foreground">
                Döngü {currentCycle + 1} / {selectedExercise.cycles}
              </div>
              <Progress value={currentProgress} className="h-3" />
              <div className="text-xs text-muted-foreground">
                Zorluk: {selectedExercise.difficulty}/10 | 
                Seviye: {selectedExercise.level === 'beginner' ? 'Başlangıç' :
                         selectedExercise.level === 'intermediate' ? 'Orta' :
                         selectedExercise.level === 'advanced' ? 'İleri' : 'Uzman'}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {!isActive ? (
                <Button onClick={startExercise} size="lg" className="min-w-[120px]">
                  <Play className="h-4 w-4 mr-2" />
                  Başla
                </Button>
              ) : (
                <Button onClick={pauseExercise} variant="secondary" size="lg" className="min-w-[120px]">
                  <Pause className="h-4 w-4 mr-2" />
                  Duraklat
                </Button>
              )}
              
              <Button onClick={resetExercise} variant="outline" size="lg" className="min-w-[120px]">
                <RotateCcw className="h-4 w-4 mr-2" />
                Sıfırla
              </Button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
              <div className="text-center p-3 bg-secondary/20 rounded-lg">
                <div className="text-sm text-muted-foreground">Tamamlanan Seans</div>
                <div className="text-xl font-semibold text-secondary-foreground">
                  {completedSessions}
                </div>
              </div>
              <div className="text-center p-3 bg-primary/10 rounded-lg">
                <div className="text-sm text-muted-foreground">Tamamlanan Egzersiz</div>
                <div className="text-xl font-semibold text-primary">
                  {completedExercises.length}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}