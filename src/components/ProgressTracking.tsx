import React, { useMemo } from 'react';
import { TrendingUp, Calendar, Target, Award, Clock, Trophy, Star, BookOpen, Sparkles } from '@phosphor-icons/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useKV } from '@github/spark/hooks';
import { AnalyticsManager, type UsageStats, type SkillLevel } from '@/lib/content';

interface DetailedStats {
  breathingStats: {
    totalSessions: number;
    completedExercises: string[];
    averageDuration: number;
  };
  syllableStats: {
    completedExercises: string[];
    practiceTime: number;
  };
  articulationStats: {
    completedExercises: string[];
    practiceStats: {
      totalTime: number;
      completedItems: number;
    };
  };
  voiceAnalysisStats: {
    totalAnalyses: number;
    averageScores: {
      clarity: number;
      pitch: number;
      tempo: number;
    };
  };
}

export function ProgressTracking() {
  // Breathing exercises data
  const [breathingSessions] = useKV('completed-breathing-sessions', 0);
  const [completedBreathingExercises] = useKV<string[]>('completed-breathing-exercises', []);
  
  // Syllable exercises data
  const [completedSyllableExercises] = useKV<string[]>('completed-syllable-exercises', []);
  
  // Articulation exercises data
  const [completedArticulationExercises] = useKV<string[]>('completed-articulation-exercises', []);
  const [articulationPracticeStats] = useKV('articulation-practice-stats', { totalTime: 0, completedItems: 0 });
  
  // Voice analysis data
  const [voiceAnalysisData] = useKV('voice-analysis-results', [] as any[]);
  
  // User settings and progress
  const [userLevel, setUserLevel] = useKV<SkillLevel>('user-level', 'beginner');
  const [weeklyGoal] = useKV('weekly-goal', 50);
  const [dailyStreak] = useKV('daily-streak', 0);

  // Calculate comprehensive statistics
  const detailedStats: DetailedStats = useMemo(() => {
    const analysisScores = voiceAnalysisData.length > 0 
      ? voiceAnalysisData.reduce((acc, analysis) => {
          acc.clarity += analysis.scores?.clarity || 0;
          acc.pitch += analysis.scores?.pitch || 0;
          acc.tempo += analysis.scores?.tempo || 0;
          return acc;
        }, { clarity: 0, pitch: 0, tempo: 0 })
      : { clarity: 0, pitch: 0, tempo: 0 };

    return {
      breathingStats: {
        totalSessions: breathingSessions,
        completedExercises: completedBreathingExercises,
        averageDuration: breathingSessions > 0 ? breathingSessions * 2.5 : 0 // Estimated
      },
      syllableStats: {
        completedExercises: completedSyllableExercises,
        practiceTime: completedSyllableExercises.length * 3 // Estimated minutes
      },
      articulationStats: {
        completedExercises: completedArticulationExercises,
        practiceStats: articulationPracticeStats
      },
      voiceAnalysisStats: {
        totalAnalyses: voiceAnalysisData.length,
        averageScores: voiceAnalysisData.length > 0 ? {
          clarity: analysisScores.clarity / voiceAnalysisData.length,
          pitch: analysisScores.pitch / voiceAnalysisData.length,
          tempo: analysisScores.tempo / voiceAnalysisData.length
        } : { clarity: 0, pitch: 0, tempo: 0 }
      }
    };
  }, [
    breathingSessions, 
    completedBreathingExercises,
    completedSyllableExercises,
    completedArticulationExercises,
    articulationPracticeStats,
    voiceAnalysisData
  ]);

  // Calculate usage statistics for analytics
  const usageStats: UsageStats = useMemo(() => {
    const totalCompleted = 
      detailedStats.breathingStats.completedExercises.length +
      detailedStats.syllableStats.completedExercises.length +
      detailedStats.articulationStats.completedExercises.length;

    return {
      totalExercisesCompleted: totalCompleted,
      exercisesByLevel: {
        beginner: Math.ceil(totalCompleted * 0.4),
        intermediate: Math.ceil(totalCompleted * 0.3),
        advanced: Math.ceil(totalCompleted * 0.2),
        expert: Math.ceil(totalCompleted * 0.1)
      },
      exercisesByCategory: {
        breathing: detailedStats.breathingStats.completedExercises.length,
        syllable: detailedStats.syllableStats.completedExercises.length,
        articulation: detailedStats.articulationStats.completedExercises.length,
        tongue_twister: Math.ceil(detailedStats.articulationStats.completedExercises.length * 0.3),
        reading: 0 // Will be implemented later
      },
      averageDifficulty: AnalyticsManager.getRecommendedDifficulty({
        totalExercisesCompleted: totalCompleted,
        exercisesByLevel: {
          beginner: Math.ceil(totalCompleted * 0.4),
          intermediate: Math.ceil(totalCompleted * 0.3),
          advanced: Math.ceil(totalCompleted * 0.2),
          expert: Math.ceil(totalCompleted * 0.1)
        },
        exercisesByCategory: {
          breathing: detailedStats.breathingStats.completedExercises.length,
          syllable: detailedStats.syllableStats.completedExercises.length,
          articulation: detailedStats.articulationStats.completedExercises.length,
          tongue_twister: 0,
          reading: 0
        },
        streakDays: dailyStreak,
        totalTimeSpent: detailedStats.syllableStats.practiceTime + detailedStats.articulationStats.practiceStats.totalTime
      }),
      streakDays: dailyStreak,
      totalTimeSpent: detailedStats.syllableStats.practiceTime + detailedStats.articulationStats.practiceStats.totalTime
    };
  }, [detailedStats, dailyStreak]);

  // Calculate recommended user level
  const recommendedLevel = AnalyticsManager.calculateUserLevel(usageStats);
  
  // Get weak areas
  const weakAreas = AnalyticsManager.getWeakAreas(usageStats);

  // Calculate overall progress
  const overallProgress = Math.min(
    ((usageStats.totalExercisesCompleted / 20) * 100),
    100
  );

  // Calculate weekly progress
  const weeklyProgress = Math.min(
    ((usageStats.totalExercisesCompleted % 7) / 7) * 100,
    100
  );

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

  // Get insights
  const getInsights = () => {
    const insights: string[] = [];
    
    if (detailedStats.breathingStats.totalSessions < 5) {
      insights.push("🫁 Nefes egzersizlerinizi artırarak konuşma kalitenizi daha da geliştirebilirsiniz.");
    }
    
    if (detailedStats.syllableStats.completedExercises.length < 3) {
      insights.push("🔤 Daha fazla hece pratiği yaparak telaffuzunuzu mükemmelleştirebilirsiniz.");
    }
    
    if (detailedStats.articulationStats.completedExercises.length < 3) {
      insights.push("🎯 Artikülasyon egzersizleri ile net konuşma becerilerinizi geliştirebilirsiniz.");
    }
    
    if (weakAreas.length > 0) {
      insights.push(`📈 Şu alanlara odaklanmanız önerilir: ${weakAreas.join(', ')}`);
    }
    
    if (recommendedLevel !== userLevel) {
      insights.push(`⭐ Seviye yükseltme zamanı! ${recommendedLevel} seviyesine geçmeyi düşünün.`);
    }
    
    if (usageStats.streakDays > 0) {
      insights.push(`🔥 Harika! ${usageStats.streakDays} günlük çalışma serisi devam ediyor.`);
    }
    
    if (insights.length === 0) {
      insights.push("🎉 Mükemmel ilerleme kaydediyorsunuz! Böyle devam edin!");
    }
    
    return insights;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            İlerleme Takibi
          </CardTitle>
          <CardDescription>
            Diksiyon gelişiminizi detaylı analiz edin ve hedeflerinizi takip edin
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Level and Achievements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <span className="text-sm text-muted-foreground">Mevcut Seviye</span>
            </div>
            <Badge className={`${getLevelColor(userLevel)} text-sm`}>
              {userLevel === 'beginner' ? 'Başlangıç' :
               userLevel === 'intermediate' ? 'Orta' :
               userLevel === 'advanced' ? 'İleri' : 'Uzman'}
            </Badge>
            {recommendedLevel !== userLevel && (
              <div className="mt-2">
                <Badge variant="outline" className="text-xs">
                  Önerilen: {recommendedLevel === 'beginner' ? 'Başlangıç' :
                            recommendedLevel === 'intermediate' ? 'Orta' :
                            recommendedLevel === 'advanced' ? 'İleri' : 'Uzman'}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <span className="text-sm text-muted-foreground">Toplam Tamamlanan</span>
            </div>
            <div className="text-2xl font-bold">{usageStats.totalExercisesCompleted}</div>
            <div className="text-xs text-muted-foreground">egzersiz</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-muted-foreground">Toplam Süre</span>
            </div>
            <div className="text-2xl font-bold">{usageStats.totalTimeSpent}</div>
            <div className="text-xs text-muted-foreground">dakika</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-green-600" />
              <span className="text-sm text-muted-foreground">Günlük Seri</span>
            </div>
            <div className="text-2xl font-bold">{usageStats.streakDays}</div>
            <div className="text-xs text-muted-foreground">gün</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Genel İlerleme</CardTitle>
            <CardDescription>Tüm egzersiz türlerindeki genel performansınız</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Genel İlerleme</span>
                <span>{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Haftalık Hedef</span>
                <span>{Math.round(weeklyProgress)}%</span>
              </div>
              <Progress value={weeklyProgress} className="h-3" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ses Analizi Skorları</CardTitle>
            <CardDescription>Voice analysis ortalama performansınız</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {detailedStats.voiceAnalysisStats.totalAnalyses > 0 ? (
              <>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Netlik</span>
                    <span className={getScoreColor(detailedStats.voiceAnalysisStats.averageScores.clarity)}>
                      {Math.round(detailedStats.voiceAnalysisStats.averageScores.clarity)}/100
                    </span>
                  </div>
                  <Progress value={detailedStats.voiceAnalysisStats.averageScores.clarity} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Ton</span>
                    <span className={getScoreColor(detailedStats.voiceAnalysisStats.averageScores.pitch)}>
                      {Math.round(detailedStats.voiceAnalysisStats.averageScores.pitch)}/100
                    </span>
                  </div>
                  <Progress value={detailedStats.voiceAnalysisStats.averageScores.pitch} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Tempo</span>
                    <span className={getScoreColor(detailedStats.voiceAnalysisStats.averageScores.tempo)}>
                      {Math.round(detailedStats.voiceAnalysisStats.averageScores.tempo)}/100
                    </span>
                  </div>
                  <Progress value={detailedStats.voiceAnalysisStats.averageScores.tempo} className="h-2" />
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground">
                <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Henüz ses analizi yapmadınız</p>
                <p className="text-xs">Ses analizi sekmesinden başlayın</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categories">Kategoriler</TabsTrigger>
          <TabsTrigger value="insights">Öneriler</TabsTrigger>
          <TabsTrigger value="achievements">Başarılar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Breathing Exercises */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Nefes Egzersizleri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Tamamlanan Seans</span>
                  <span className="font-medium">{detailedStats.breathingStats.totalSessions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tamamlanan Egzersiz</span>
                  <span className="font-medium">{detailedStats.breathingStats.completedExercises.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Ortalama Süre</span>
                  <span className="font-medium">{detailedStats.breathingStats.averageDuration.toFixed(1)} dk</span>
                </div>
              </CardContent>
            </Card>

            {/* Syllable Exercises */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Hece Egzersizleri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Tamamlanan Egzersiz</span>
                  <span className="font-medium">{detailedStats.syllableStats.completedExercises.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Toplam Süre</span>
                  <span className="font-medium">{detailedStats.syllableStats.practiceTime} dk</span>
                </div>
              </CardContent>
            </Card>

            {/* Articulation Exercises */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Artikülasyon
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Tamamlanan Egzersiz</span>
                  <span className="font-medium">{detailedStats.articulationStats.completedExercises.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Toplam Çalışma</span>
                  <span className="font-medium">{detailedStats.articulationStats.practiceStats.completedItems}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Toplam Süre</span>
                  <span className="font-medium">{detailedStats.articulationStats.practiceStats.totalTime} dk</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Kişiselleştirilmiş Öneriler</CardTitle>
              <CardDescription>Gelişiminizi hızlandırmak için özel öneriler</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getInsights().map((insight, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Achievement badges */}
            {usageStats.totalExercisesCompleted >= 5 && (
              <Card>
                <CardContent className="p-4 text-center">
                  <Trophy className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <h3 className="font-medium">İlk Adım</h3>
                  <p className="text-xs text-muted-foreground">5 egzersiz tamamladınız</p>
                </CardContent>
              </Card>
            )}
            
            {usageStats.totalExercisesCompleted >= 20 && (
              <Card>
                <CardContent className="p-4 text-center">
                  <Award className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-medium">Azimli Öğrenci</h3>
                  <p className="text-xs text-muted-foreground">20 egzersiz tamamladınız</p>
                </CardContent>
              </Card>
            )}
            
            {usageStats.streakDays >= 7 && (
              <Card>
                <CardContent className="p-4 text-center">
                  <Star className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-medium">Haftalık Seri</h3>
                  <p className="text-xs text-muted-foreground">7 gün üst üste çalıştınız</p>
                </CardContent>
              </Card>
            )}
            
            {detailedStats.voiceAnalysisStats.totalAnalyses >= 5 && (
              <Card>
                <CardContent className="p-4 text-center">
                  <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-medium">Analiz Uzmanı</h3>
                  <p className="text-xs text-muted-foreground">5 ses analizi yaptınız</p>
                </CardContent>
              </Card>
            )}
            
            {Object.values(usageStats.exercisesByCategory).every(count => count > 0) && (
              <Card>
                <CardContent className="p-4 text-center">
                  <Sparkles className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <h3 className="font-medium">Çok Yönlü</h3>
                  <p className="text-xs text-muted-foreground">Tüm kategorilerde çalıştınız</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}