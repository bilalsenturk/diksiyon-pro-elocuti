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
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2 px-2">
            Diksiyon Geliştirme Uygulaması
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Konuşma kalitenizi artırmak için tasarlanmış kapsamlı egzersiz platformu. 
            Nefes kontrolü, telaffuz ve artikülasyon becerilerinizi geliştirin.
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="analysis" className="w-full">
          {/* Mobile first tab layout */}
          <div className="space-y-3 mb-6">
            {/* Primary tabs for mobile */}
            <TabsList className="grid w-full grid-cols-3 h-auto p-1">
              <TabsTrigger value="analysis" className="flex flex-col items-center gap-1 py-3 px-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs font-medium">Analiz</span>
              </TabsTrigger>
              <TabsTrigger value="recorder" className="flex flex-col items-center gap-1 py-3 px-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs font-medium">Kayıt</span>
              </TabsTrigger>
              <TabsTrigger value="breathing" className="flex flex-col items-center gap-1 py-3 px-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Wind className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs font-medium">Nefes</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Secondary tabs for mobile */}
            <TabsList className="grid w-full grid-cols-3 h-auto p-1">
              <TabsTrigger value="syllables" className="flex flex-col items-center gap-1 py-3 px-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs font-medium">Hece</span>
              </TabsTrigger>
              <TabsTrigger value="articulation" className="flex flex-col items-center gap-1 py-3 px-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Megaphone className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs font-medium">Artikülasyon</span>
              </TabsTrigger>
              <TabsTrigger value="progress" className="flex flex-col items-center gap-1 py-3 px-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs font-medium">İlerleme</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Desktop tab layout - hidden on mobile */}
          <div className="hidden lg:block mb-8">
            <TabsList className="grid w-full grid-cols-6 h-auto p-1">
              <TabsTrigger value="analysis" className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Sparkles className="h-5 w-5" />
                <span className="font-medium">Analiz</span>
              </TabsTrigger>
              <TabsTrigger value="recorder" className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Mic className="h-5 w-5" />
                <span className="font-medium">Kayıt</span>
              </TabsTrigger>
              <TabsTrigger value="breathing" className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Wind className="h-5 w-5" />
                <span className="font-medium">Nefes</span>
              </TabsTrigger>
              <TabsTrigger value="syllables" className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Volume2 className="h-5 w-5" />
                <span className="font-medium">Hece</span>
              </TabsTrigger>
              <TabsTrigger value="articulation" className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Megaphone className="h-5 w-5" />
                <span className="font-medium">Artikülasyon</span>
              </TabsTrigger>
              <TabsTrigger value="progress" className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <TrendingUp className="h-5 w-5" />
                <span className="font-medium">İlerleme</span>
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
                    <CardTitle className="text-lg">Kayıtlarınız</CardTitle>
                    <CardDescription>
                      Son yapılan ses kayıtlarınız
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recordings.slice(-5).reverse().map((recording, index) => (
                        <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-secondary/10 rounded-lg">
                          <audio controls className="w-full sm:flex-1 min-w-0">
                            <source src={URL.createObjectURL(recording.blob)} type="audio/wav" />
                            Tarayıcınız ses çalmayı desteklemiyor.
                          </audio>
                          <div className="text-sm text-muted-foreground shrink-0 self-center sm:self-auto">
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
        <div className="text-center mt-8 sm:mt-12 py-4 sm:py-6 border-t border-border">
          <p className="text-xs sm:text-sm text-muted-foreground px-4">
            Diksiyon uzmanları tarafından tasarlanmış bilimsel temelli egzersizler
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;