import React from 'react';
import { TrendingUp, Calendar, Target, Award, Clock } from '@phosphor-icons/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useKV } from '@github/spark/hooks';

interface ProgressStats {
  breathingSessions: number;
  completedWords: string[];
  articulationScores: Record<string, number>;
  dailyPractice: number;
  weeklyGoal: number;
}

export function ProgressTracking() {
  const [breathingSessions] = useKV('completed-breathing-sessions', 0);
  const [completedWords] = useKV('completed-syllable-words', [] as string[]);
  const [articulationScores] = useKV('articulation-scores', {} as Record<string, number>);
  const [dailyPractice] = useKV('daily-articulation', 0);
  const [weeklyGoal] = useKV('weekly-goal', 50);

  // Calculate weekly progress (simplified - would need proper date tracking)
  const weeklyProgress = Math.min((dailyPractice * 7) / weeklyGoal * 100, 100);

  // Calculate average articulation score
  const articulationValues = Object.values(articulationScores);
  const avgArticulationScore = articulationValues.length > 0 
    ? articulationValues.reduce((sum, score) => sum + score, 0) / articulationValues.length 
    : 0;

  // Calculate overall completion percentage
  const totalExerciseTypes = 3; // breathing, syllables, articulation
  const completedTypes = [
    breathingSessions > 0 ? 1 : 0,
    completedWords.length > 0 ? 1 : 0,
    articulationValues.length > 0 ? 1 : 0
  ].reduce((sum, val) => sum + val, 0);
  
  const overallProgress = (completedTypes / totalExerciseTypes) * 100;

  // Generate insights
  const getInsights = () => {
    const insights: string[] = [];
    
    if (breathingSessions < 5) {
      insights.push("Nefes egzersizlerinizi artırarak konuşma kalitenizi daha da geliştirebilirsiniz.");
    }
    
    if (completedWords.length < 3) {
      insights.push("Daha fazla kelime pratiği yaparak telaffuzunuzu mükemmelleştirebilirsiniz.");
    }
    
    if (avgArticulationScore < 4) {
      insights.push("Artikülasyon egzersizlerinde daha çok pratik yaparak puanınızı artırabilirsiniz.");
    }
    
    if (dailyPractice > 20) {
      insights.push("Harika! Günlük pratiğiniz çok iyi seviyede.");
    }
    
    if (insights.length === 0) {
      insights.push("Tüm alanlarda dengeli bir ilerleme kaydediyorsunuz. Devam edin!");
    }
    
    return insights;
  };

  const insights = getInsights();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          İlerleme Takibi
        </CardTitle>
        <CardDescription>
          Diksiyon geliştirme yolculuğunuzdaki ilerlemelerinizi takip edin
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Overall Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Genel İlerleme</h3>
            <span className="text-2xl font-bold text-primary">{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-3" />
          <p className="text-sm text-muted-foreground">
            Tüm egzersiz kategorilerindeki genel performansınız
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Breathing Sessions */}
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{breathingSessions}</div>
                  <div className="text-sm text-muted-foreground">Nefes Seansı</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Completed Words */}
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Target className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{completedWords.length}</div>
                  <div className="text-sm text-muted-foreground">Kelime Öğrenildi</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Articulation Score */}
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Award className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {avgArticulationScore > 0 ? avgArticulationScore.toFixed(1) : '0.0'}
                  </div>
                  <div className="text-sm text-muted-foreground">Artikülasyon Puanı</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daily Practice */}
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Calendar className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{dailyPractice}</div>
                  <div className="text-sm text-muted-foreground">Günlük Pratik</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Goal Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Haftalık Hedef</h3>
            <span className="text-sm text-muted-foreground">
              {dailyPractice * 7} / {weeklyGoal} tekrar
            </span>
          </div>
          <Progress value={weeklyProgress} className="h-2" />
          <p className="text-sm text-muted-foreground">
            Bu hafta için belirlediğiniz hedefe ulaşma oranınız
          </p>
        </div>

        {/* Detailed Progress by Category */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Kategori Bazlı İlerleme</h3>
          
          <div className="space-y-3">
            {/* Breathing Progress */}
            <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg">
              <div>
                <div className="font-medium">Nefes Egzersizleri</div>
                <div className="text-sm text-muted-foreground">
                  {breathingSessions} seans tamamlandı
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-blue-600">
                  {breathingSessions > 0 ? '✓' : '○'}
                </div>
              </div>
            </div>

            {/* Syllable Progress */}
            <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg">
              <div>
                <div className="font-medium">Heceleme Egzersizleri</div>
                <div className="text-sm text-muted-foreground">
                  {completedWords.length} kelime tamamlandı
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-green-600">
                  {Math.round((completedWords.length / 6) * 100)}%
                </div>
              </div>
            </div>

            {/* Articulation Progress */}
            <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg">
              <div>
                <div className="font-medium">Artikülasyon Pratiği</div>
                <div className="text-sm text-muted-foreground">
                  {articulationValues.length} egzersiz değerlendirildi
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-purple-600">
                  {avgArticulationScore > 0 ? `${avgArticulationScore.toFixed(1)}/5` : '0/5'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Insights and Recommendations */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Öneriler ve İçgörüler</h3>
          <div className="space-y-2">
            {insights.map((insight, index) => (
              <div
                key={index}
                className="p-3 bg-accent/10 border-l-4 border-l-accent rounded-r-lg"
              >
                <p className="text-sm">{insight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Badges */}
        {(breathingSessions > 10 || completedWords.length > 3 || avgArticulationScore > 4) && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Başarımlar</h3>
            <div className="flex flex-wrap gap-2">
              {breathingSessions > 10 && (
                <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  🌬️ Nefes Ustası
                </div>
              )}
              {completedWords.length > 3 && (
                <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  📚 Kelime Avcısı
                </div>
              )}
              {avgArticulationScore > 4 && (
                <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  🎯 Artikülasyon Şampiyonu
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}