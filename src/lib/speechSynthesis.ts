// Speech synthesis utility with enhanced browser compatibility
export class SpeechSynthesisService {
  private static instance: SpeechSynthesisService;
  private voices: SpeechSynthesisVoice[] = [];
  private isLoaded = false;
  private loadPromise: Promise<void> | null = null;

  public static getInstance(): SpeechSynthesisService {
    if (!SpeechSynthesisService.instance) {
      SpeechSynthesisService.instance = new SpeechSynthesisService();
    }
    return SpeechSynthesisService.instance;
  }

  private constructor() {
    this.initializeVoices();
  }

  private async initializeVoices(): Promise<void> {
    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = new Promise<void>((resolve) => {
      if (!('speechSynthesis' in window)) {
        console.warn('Speech synthesis not supported');
        resolve();
        return;
      }

      const loadVoices = () => {
        this.voices = speechSynthesis.getVoices();
        this.isLoaded = true;
        resolve();
      };

      // Try to load voices immediately
      this.voices = speechSynthesis.getVoices();
      if (this.voices.length > 0) {
        this.isLoaded = true;
        resolve();
        return;
      }

      // If voices not loaded yet, wait for them
      speechSynthesis.addEventListener('voiceschanged', loadVoices, { once: true });
      
      // Fallback timeout
      setTimeout(() => {
        this.voices = speechSynthesis.getVoices();
        this.isLoaded = true;
        resolve();
      }, 1000);
    });

    return this.loadPromise;
  }

  public async speak(text: string, options: {
    lang?: string;
    rate?: number;
    pitch?: number;
    volume?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: any) => void;
  } = {}): Promise<boolean> {
    try {
      if (!('speechSynthesis' in window)) {
        options.onError?.('Speech synthesis not supported');
        return false;
      }

      await this.initializeVoices();

      // Cancel any ongoing speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language and find appropriate voice
      const lang = options.lang || 'tr-TR';
      utterance.lang = lang;
      
      // Try to find a Turkish voice or fallback to default
      const turkishVoice = this.voices.find(voice => 
        voice.lang.startsWith('tr') || voice.lang.includes('Turkish')
      );
      
      if (turkishVoice) {
        utterance.voice = turkishVoice;
      }

      // Set other options
      utterance.rate = options.rate || 0.8;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;

      // Add timeout to prevent hanging
      const timeout = setTimeout(() => {
        speechSynthesis.cancel();
        options.onError?.(new Error('Speech synthesis timeout'));
      }, 10000);

      return new Promise<boolean>((resolve) => {
        utterance.onstart = () => {
          options.onStart?.();
        };

        utterance.onend = () => {
          clearTimeout(timeout);
          options.onEnd?.();
          resolve(true);
        };

        utterance.onerror = (error) => {
          clearTimeout(timeout);
          options.onError?.(error);
          resolve(false);
        };

        try {
          speechSynthesis.speak(utterance);
        } catch (error) {
          clearTimeout(timeout);
          options.onError?.(error);
          resolve(false);
        }
      });
    } catch (error) {
      options.onError?.(error);
      return false;
    }
  }

  public stop(): void {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }

  public isSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  public getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }
}