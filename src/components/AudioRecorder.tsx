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
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Set up audio context for visualization
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      // Set up media recorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        onRecordingComplete(audioBlob, duration);
      };

      mediaRecorderRef.current.start();
      onRecordingStateChange(true);

      // Start duration counter
      setDuration(0);
      intervalRef.current = window.setInterval(() => {
        setDuration(prev => prev + 0.1);
      }, 100);

      // Start audio level monitoring
      monitorAudioLevel();
    } catch (error) {
      console.error('Error accessing microphone:', error);
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
      
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      setAudioLevel(average / 255 * 100);
      
      animationRef.current = requestAnimationFrame(updateLevel);
    };
    
    updateLevel();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Ses Kaydı
        </CardTitle>
        <CardDescription>
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
              className="h-16 w-16 rounded-full"
            >
              {isRecording ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </Button>
            {isRecording && (
              <div className="absolute -inset-2 rounded-full border-2 border-red-500 animate-pulse" />
            )}
          </div>
          
          {isRecording && (
            <div className="text-center space-y-2">
              <div className="text-2xl font-mono text-primary">
                {duration.toFixed(1)}s
              </div>
              <div className="w-48 space-y-1">
                <div className="text-sm text-muted-foreground">Ses Seviyesi</div>
                <Progress value={audioLevel} className="h-2" />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}