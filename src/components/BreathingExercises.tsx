import React, { useState, useEffect } from 'react';
import { Wind, Play, Pause, RotateCcw } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useKV } from '@github/spark/hooks';

interface BreathingExercise {
  id: string;
  name: string;
  inhaleTime: number;
  holdTime: number;
  exhaleTime: number;
  cycles: number;
  description: string;
}

const breathingExercises: BreathingExercise[] = [
  {
    id: 'basic',
    name: 'Temel Nefes',
    inhaleTime: 4,
    holdTime: 2,
    exhaleTime: 4,
    cycles: 8,
    description: 'Konuşma öncesi rahatlamak için ideal'
  },
  {
    id: 'deep',
    name: 'Derin Nefes',
    inhaleTime: 6,
    holdTime: 3,
    exhaleTime: 6,
    cycles: 6,
    description: 'Ses kalitesini artırmak için'
  },
  {
    id: 'performance',
    name: 'Performans Nefesi',
    inhaleTime: 8,
    holdTime: 4,
    exhaleTime: 8,
    cycles: 5,
    description: 'Uzun konuşmalar için güç artırır'
  }
];

export function BreathingExercises() {
  const [selectedExercise, setSelectedExercise] = useState<BreathingExercise>(breathingExercises[0]);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [completedSessions, setCompletedSessions] = useKV('completed-breathing-sessions', 0);

  useEffect(() => {
    let interval: number | null = null;

    if (isActive && timeRemaining > 0) {
      interval = window.setInterval(() => {
        setTimeRemaining(time => time - 0.1);
      }, 100);
    } else if (isActive && timeRemaining <= 0) {
      // Move to next phase
      if (currentPhase === 'inhale') {
        setCurrentPhase('hold');
        setTimeRemaining(selectedExercise.holdTime);
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
          setCurrentCycle(0);
          setCurrentPhase('inhale');
          setTimeRemaining(selectedExercise.inhaleTime);
        }
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining, currentPhase, currentCycle, selectedExercise, setCompletedSessions]);

  const startExercise = () => {
    setIsActive(true);
    setCurrentCycle(0);
    setCurrentPhase('inhale');
    setTimeRemaining(selectedExercise.inhaleTime);
  };

  const pauseExercise = () => {
    setIsActive(false);
  };

  const resetExercise = () => {
    setIsActive(false);
    setCurrentCycle(0);
    setCurrentPhase('inhale');
    setTimeRemaining(selectedExercise.inhaleTime);
  };

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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wind className="h-5 w-5" />
          Nefes Egzersizleri
        </CardTitle>
        <CardDescription>
          Konuşma kalitesini artırmak için nefes kontrolü geliştirin
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Exercise Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {breathingExercises.map((exercise) => (
            <Button
              key={exercise.id}
              variant={selectedExercise.id === exercise.id ? "default" : "outline"}
              className="h-auto p-3 flex flex-col items-start text-left"
              onClick={() => {
                setSelectedExercise(exercise);
                resetExercise();
              }}
              disabled={isActive}
            >
              <div className="font-medium truncate w-full">{exercise.name}</div>
              <div className="text-xs text-muted-foreground break-words w-full">
                {exercise.description}
              </div>
            </Button>
          ))}
        </div>

        {/* Exercise Display */}
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className={`w-32 h-32 rounded-full border-4 transition-all duration-300 flex items-center justify-center ${
              isActive ? 'border-primary scale-110' : 'border-muted'
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
              <div className="absolute -inset-4 rounded-full border-2 border-primary animate-pulse opacity-50" />
            )}
          </div>

          <div className="text-center space-y-2 w-full max-w-xs px-4">
            <div className="text-sm text-muted-foreground">
              Döngü {currentCycle + 1} / {selectedExercise.cycles}
            </div>
            <Progress value={currentProgress} className="h-2" />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 px-4">
            {!isActive ? (
              <Button onClick={startExercise} size="lg">
                <Play className="h-4 w-4 mr-2" />
                Başla
              </Button>
            ) : (
              <Button onClick={pauseExercise} variant="secondary" size="lg">
                <Pause className="h-4 w-4 mr-2" />
                Duraklat
              </Button>
            )}
            
            <Button onClick={resetExercise} variant="outline" size="lg">
              <RotateCcw className="h-4 w-4 mr-2" />
              Sıfırla
            </Button>
          </div>

          {completedSessions > 0 && (
            <div className="text-center p-3 bg-secondary/20 rounded-lg">
              <div className="text-sm text-muted-foreground">Tamamlanan Seans</div>
              <div className="text-xl font-semibold text-secondary-foreground">
                {completedSessions}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}