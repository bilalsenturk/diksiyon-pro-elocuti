import React, { useState, useRef, useCallback, memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Play, Stop, TrendingUp, Volume2, Clock, Sparkles } from '@phosphor-icons/react';
import { useKV } from '@github/spark/hooks';
import { SocialShare } from '@/components/SocialShare';

interface AnalysisResult {
  pitch: {
    averageHz: number;
    range: number;
    stability: number;
    score: number;
  };
  tempo: {
    wordsPerMinute: number;
    pauseFrequency: number;
    rhythm: number;
    score: number;
  };
  clarity: {
    consonantSharpness: number;
    vowelClarity: number;
    overall: number;
    score: number;
  };
  overallScore: number;
  timestamp: number;
}

export const VoiceAnalysis = memo(() => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [analysisHistory, setAnalysisHistory] = useKV<AnalysisResult[]>('voice-analysis-history', []);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const recordingStartTime = useRef<number>(0);

  const startRecording = useCallback(async () => {
    try {
      // Check browser support
      if (!navigator.mediaDevices?.getUserMedia) {
        alert('Tarayıcınız mikrofon kaydını desteklemiyor. Lütfen güncel bir tarayıcı kullanın.');
        return;
      }

      if (!window.MediaRecorder) {
        alert('Tarayıcınız ses kaydını desteklemiyor. Lütfen güncel bir tarayıcı kullanın.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 44100,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      // Check AudioContext support
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        try {
          audioContextRef.current = new AudioContextClass();
          
          // Resume AudioContext if it's suspended (required by some browsers)
          if (audioContextRef.current.state === 'suspended') {
            await audioContextRef.current.resume();
          }
          
          analyserRef.current = audioContextRef.current.createAnalyser();
          analyserRef.current.fftSize = 2048;
          
          const source = audioContextRef.current.createMediaStreamSource(stream);
          source.connect(analyserRef.current);
        } catch (audioError) {
          console.warn('AudioContext not available, analysis will be limited:', audioError);
        }
      }

      // Set up media recorder with fallback mime types
      const supportedMimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/wav'
      ];
      
      let mimeType = '';
      for (const type of supportedMimeTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          mimeType = type;
          break;
        }
      }

      const options = mimeType ? { mimeType } : {};
      const mediaRecorder = new MediaRecorder(stream, options);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType || 'audio/webm' });
        setAudioBlob(blob);
        analyzeAudio(blob);
        // Clean up stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.onerror = (error) => {
        console.error('MediaRecorder error:', error);
        stopRecording();
        alert('Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      };

      mediaRecorder.start(100); // Record in 100ms chunks
      mediaRecorderRef.current = mediaRecorder;
      recordingStartTime.current = Date.now();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          alert('Mikrofon erişimi reddedildi. Lütfen tarayıcı ayarlarından mikrofon iznini etkinleştirin.');
        } else if (error.name === 'NotFoundError') {
          alert('Mikrofon bulunamadı. Lütfen mikrofonunuzun bağlı olduğundan emin olun.');
        } else if (error.name === 'NotSupportedError') {
          alert('Tarayıcınız mikrofon kaydını desteklemiyor.');
        } else {
          alert('Mikrofon erişiminde bir hata oluştu. Lütfen sayfayı yenileyip tekrar deneyin.');
        }
      }
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      try {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      } catch (error) {
        console.warn('Error stopping recording:', error);
        setIsRecording(false);
      }
      
      // Clean up audio context
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(console.warn);
        audioContextRef.current = null;
      }
    }
  }, [isRecording]);

  const analyzeAudio = useCallback(async (blob: Blob) => {
    setIsAnalyzing(true);
    
    try {
      // Simulate comprehensive audio analysis
      // In a real implementation, this would use Web Audio API and advanced DSP
      const duration = (Date.now() - recordingStartTime.current) / 1000;
      
      // Mock analysis with realistic variations
      const pitchAnalysis = {
        averageHz: 120 + Math.random() * 80, // Typical speech range
        range: 40 + Math.random() * 60,
        stability: 0.7 + Math.random() * 0.3,
        score: 0
      };
      pitchAnalysis.score = Math.min(100, (pitchAnalysis.stability * 100 + (1 - Math.abs(pitchAnalysis.range - 50) / 50) * 100) / 2);

      const tempoAnalysis = {
        wordsPerMinute: 120 + Math.random() * 60,
        pauseFrequency: 0.1 + Math.random() * 0.3,
        rhythm: 0.6 + Math.random() * 0.4,
        score: 0
      };
      tempoAnalysis.score = Math.min(100, (tempoAnalysis.rhythm * 100 + Math.max(0, 100 - Math.abs(tempoAnalysis.wordsPerMinute - 150) * 2)) / 2);

      const clarityAnalysis = {
        consonantSharpness: 0.6 + Math.random() * 0.4,
        vowelClarity: 0.7 + Math.random() * 0.3,
        overall: 0.65 + Math.random() * 0.35,
        score: 0
      };
      clarityAnalysis.score = clarityAnalysis.overall * 100;

      const result: AnalysisResult = {
        pitch: pitchAnalysis,
        tempo: tempoAnalysis,
        clarity: clarityAnalysis,
        overallScore: (pitchAnalysis.score + tempoAnalysis.score + clarityAnalysis.score) / 3,
        timestamp: Date.now()
      };

      setCurrentAnalysis(result);
      setAnalysisHistory(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 analyses
      
    } catch (error) {
      console.error('Error analyzing audio:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [setAnalysisHistory]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Mükemmel';
    if (score >= 60) return 'İyi';
    if (score >= 40) return 'Orta';
    return 'Geliştirilmeli';
  };

  return (
    <div className="space-y-6">
      {/* Recording Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Ses Analizi
          </CardTitle>
          <CardDescription>
            Konuşmanızı kaydedin ve detaylı analiz sonuçlarını görün
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              size="lg"
              variant={isRecording ? "destructive" : "default"}
              className="w-32 h-32 rounded-full"
              disabled={isAnalyzing}
              aria-label={isRecording ? "Kaydı durdur" : "Kayıt başlat"}
              aria-describedby="recording-instructions"
            >
              {isRecording ? (
                <MicOff className="h-8 w-8" />
              ) : (
                <Mic className="h-8 w-8" />
              )}
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground" id="recording-instructions">
              {isRecording && 'Kayıt devam ediyor...'}
              {isAnalyzing && 'Analiz ediliyor...'}
              {!isRecording && !isAnalyzing && 'Kayıt başlatmak için butona basın'}
            </p>
          </div>

          {audioBlob && (
            <div className="flex justify-center mt-4">
              <audio controls className="w-full max-w-md">
                <source src={URL.createObjectURL(audioBlob)} type="audio/wav" />
              </audio>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {currentAnalysis && (
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Analiz Sonuçları</CardTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <SocialShare analysis={currentAnalysis} />
                <Badge className={getScoreColor(currentAnalysis.overallScore)}>
                  {Math.round(currentAnalysis.overallScore)}/100 - {getScoreLabel(currentAnalysis.overallScore)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Pitch Analysis */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Pitch Analizi</span>
                <Badge variant="outline">{Math.round(currentAnalysis.pitch.score)}/100</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Ortalama Frekans</div>
                  <div className="text-lg font-semibold">{Math.round(currentAnalysis.pitch.averageHz)} Hz</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Pitch Aralığı</div>
                  <div className="text-lg font-semibold">{Math.round(currentAnalysis.pitch.range)} Hz</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Stabilite</div>
                  <div className="flex items-center gap-2">
                    <Progress value={currentAnalysis.pitch.stability * 100} className="flex-1" />
                    <span className="text-sm">{Math.round(currentAnalysis.pitch.stability * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tempo Analysis */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-600" />
                <span className="font-medium">Tempo Analizi</span>
                <Badge variant="outline">{Math.round(currentAnalysis.tempo.score)}/100</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Konuşma Hızı</div>
                  <div className="text-lg font-semibold">{Math.round(currentAnalysis.tempo.wordsPerMinute)} kelime/dk</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Ritim Skoru</div>
                  <div className="flex items-center gap-2">
                    <Progress value={currentAnalysis.tempo.rhythm * 100} className="flex-1" />
                    <span className="text-sm">{Math.round(currentAnalysis.tempo.rhythm * 100)}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Duraklama Sıklığı</div>
                  <div className="text-lg font-semibold">{(currentAnalysis.tempo.pauseFrequency * 100).toFixed(1)}%</div>
                </div>
              </div>
            </div>

            {/* Clarity Analysis */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-purple-600" />
                <span className="font-medium">Netlik Analizi</span>
                <Badge variant="outline">{Math.round(currentAnalysis.clarity.score)}/100</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Ünsüz Netliği</div>
                  <div className="flex items-center gap-2">
                    <Progress value={currentAnalysis.clarity.consonantSharpness * 100} className="flex-1" />
                    <span className="text-sm">{Math.round(currentAnalysis.clarity.consonantSharpness * 100)}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Ünlü Netliği</div>
                  <div className="flex items-center gap-2">
                    <Progress value={currentAnalysis.clarity.vowelClarity * 100} className="flex-1" />
                    <span className="text-sm">{Math.round(currentAnalysis.clarity.vowelClarity * 100)}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Genel Netlik</div>
                  <div className="flex items-center gap-2">
                    <Progress value={currentAnalysis.clarity.overall * 100} className="flex-1" />
                    <span className="text-sm">{Math.round(currentAnalysis.clarity.overall * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis History */}
      {analysisHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Analiz Geçmişi</CardTitle>
            <CardDescription>Son analiz sonuçlarınız</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysisHistory.slice(0, 5).map((analysis, index) => (
                <div key={analysis.timestamp} className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-muted-foreground">
                      {new Date(analysis.timestamp).toLocaleString('tr-TR')}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-xs space-x-2">
                      <span>Pitch: {Math.round(analysis.pitch.score)}</span>
                      <span>Tempo: {Math.round(analysis.tempo.score)}</span>
                      <span>Netlik: {Math.round(analysis.clarity.score)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <SocialShare 
                        analysis={analysis} 
                        trigger={
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                            Paylaş
                          </Button>
                        } 
                      />
                      <Badge className={getScoreColor(analysis.overallScore)}>
                        {Math.round(analysis.overallScore)}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
});