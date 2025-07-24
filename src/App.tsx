import React, { useState, Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Mic, Wind, Volume2, Megaphone, TrendingUp, Sparkles } from '@phosphor-icons/react';
import { AudioRecorder } from '@/components/AudioRecorder';
import { BreathingExercises } from '@/components/BreathingExercises';
import { SyllableExercises } from '@/components/SyllableExercises';
import { ArticulationPractice } from '@/components/ArticulationPractice';
import { ProgressTracking } from '@/components/ProgressTracking';
import { VoiceAnalysis } from '@/components/VoiceAnalysis';

// Loading component for lazy loading
function ComponentLoader() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-8 w-1/2" />
      </CardContent>
    </Card>
  );
}

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<{ blob: Blob; duration: number }[]>([]);

  const handleRecordingComplete = (audioBlob: Blob, duration: number) => {
    setRecordings(prev => [...prev, { blob: audioBlob, duration }]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Diksiyon Geliştirme Uygulaması
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Konuşma kalitenizi artırmak için tasarlanmış kapsamlı egzersiz platformu. 
            Nefes kontrolü, telaffuz ve artikülasyon becerilerinizi geliştirin.
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 mb-8">
            <TabsTrigger value="analysis" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Analiz</span>
            </TabsTrigger>
            <TabsTrigger value="recorder" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2">
              <Mic className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Kayıt</span>
            </TabsTrigger>
            <TabsTrigger value="breathing" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2">
              <Wind className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Nefes</span>
            </TabsTrigger>
            <TabsTrigger value="syllables" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 hidden sm:flex">
              <Volume2 className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Hece</span>
            </TabsTrigger>
            <TabsTrigger value="articulation" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 hidden sm:flex">
              <Megaphone className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Artikülasyon</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 hidden sm:flex">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs sm:text-sm">İlerleme</span>
            </TabsTrigger>
          </TabsList>

          {/* Mobile additional tabs */}
          <div className="block sm:hidden mb-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="syllables" className="flex flex-col items-center gap-1 py-2">
                <Volume2 className="h-4 w-4" />
                <span className="text-xs">Hece</span>
              </TabsTrigger>
              <TabsTrigger value="articulation" className="flex flex-col items-center gap-1 py-2">
                <Megaphone className="h-4 w-4" />
                <span className="text-xs">Artikülasyon</span>
              </TabsTrigger>
              <TabsTrigger value="progress" className="flex flex-col items-center gap-1 py-2">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs">İlerleme</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <Suspense fallback={<ComponentLoader />}>
            <TabsContent value="analysis">
              <VoiceAnalysis />
            </TabsContent>

            <TabsContent value="recorder" className="space-y-6">
              <AudioRecorder
                onRecordingComplete={handleRecordingComplete}
                isRecording={isRecording}
                onRecordingStateChange={setIsRecording}
              />
              
              {recordings.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Kayıtlarınız</CardTitle>
                    <CardDescription>
                      Son yapılan ses kayıtlarınız
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recordings.slice(-5).reverse().map((recording, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-secondary/10 rounded-lg">
                          <audio controls className="flex-1">
                            <source src={URL.createObjectURL(recording.blob)} type="audio/wav" />
                            Tarayıcınız ses çalmayı desteklemiyor.
                          </audio>
                          <div className="text-sm text-muted-foreground">
                            {recording.duration.toFixed(1)}s
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="breathing">
              <BreathingExercises />
            </TabsContent>

            <TabsContent value="syllables">
              <SyllableExercises />
            </TabsContent>

            <TabsContent value="articulation">
              <ArticulationPractice />
            </TabsContent>

            <TabsContent value="progress">
              <ProgressTracking />
            </TabsContent>
          </Suspense>
        </Tabs>

        {/* Footer */}
        <div className="text-center mt-12 py-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Diksiyon uzmanları tarafından tasarlanmış bilimsel temelli egzersizler
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;