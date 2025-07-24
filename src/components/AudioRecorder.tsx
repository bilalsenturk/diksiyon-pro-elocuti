import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Play, Pause, RotateCcw, TrendingUp } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useKV } from '@github/spark/hooks';

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob, duration: number) => void;
  isRecording: boolean;
  onRecordingStateChange: (recording: boolean) => void;
}

export function AudioRecorder({ onRecordingComplete, isRecording, onRecordingStateChange }: AudioRecorderProps) {
  const [audioLevel, setAudioLevel] = useState(0);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      stopRecording();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(console.warn);
        audioContextRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, []);

  const startRecording = async () => {
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
      streamRef.current = stream;

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
          const source = audioContextRef.current.createMediaStreamSource(stream);
          source.connect(analyserRef.current);
          analyserRef.current.fftSize = 256;
        } catch (audioError) {
          console.warn('AudioContext not available, visual feedback disabled:', audioError);
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
      mediaRecorderRef.current = new MediaRecorder(stream, options);
      const chunks: Blob[] = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunks, { type: mimeType || 'audio/webm' });
        onRecordingComplete(audioBlob, duration);
        // Clean up stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.onerror = (error) => {
        console.error('MediaRecorder error:', error);
        stopRecording();
        alert('Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      };

      mediaRecorderRef.current.start(100); // Record in 100ms chunks
      onRecordingStateChange(true);

      // Start duration counter
      setDuration(0);
      intervalRef.current = window.setInterval(() => {
        setDuration(prev => prev + 0.1);
      }, 100);

      // Start audio level monitoring
      if (analyserRef.current) {
        monitorAudioLevel();
      }
    } catch (error) {
      console.error('Error accessing microphone:', error);
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
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      onRecordingStateChange(false);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setAudioLevel(0);
  };

  const monitorAudioLevel = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const updateLevel = () => {
      if (!analyserRef.current || !isRecording) return;
      
      try {
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        setAudioLevel(average / 255 * 100);
        
        animationRef.current = requestAnimationFrame(updateLevel);
      } catch (error) {
        console.warn('Audio level monitoring error:', error);
        setAudioLevel(0);
      }
    };
    
    updateLevel();
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Mic className="h-5 w-5" />
          Ses Kaydı
        </CardTitle>
        <CardDescription className="text-sm">
          Diksiyonunuzu analiz etmek için ses kaydı yapın
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Button
              size="lg"
              variant={isRecording ? "destructive" : "default"}
              onClick={isRecording ? stopRecording : startRecording}
              className="h-20 w-20 sm:h-16 sm:w-16 rounded-full touch-manipulation"
              aria-label={isRecording ? "Kaydı durdur" : "Kayıt başlat"}
              aria-describedby="recording-status"
            >
              {isRecording ? <MicOff className="h-8 w-8 sm:h-6 sm:w-6" /> : <Mic className="h-8 w-8 sm:h-6 sm:w-6" />}
            </Button>
            {isRecording && (
              <div className="absolute -inset-2 rounded-full border-2 border-red-500 animate-pulse" />
            )}
          </div>
          
          {isRecording && (
            <div className="text-center space-y-3 w-full max-w-xs" id="recording-status">
              <div className="text-3xl sm:text-2xl font-mono text-primary" aria-live="polite">
                {duration.toFixed(1)}s
              </div>
              <div className="w-full space-y-2">
                <div className="text-sm text-muted-foreground">Ses Seviyesi</div>
                <Progress value={audioLevel} className="h-3 sm:h-2 w-full" aria-label={`Ses seviyesi: ${Math.round(audioLevel)}%`} />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}