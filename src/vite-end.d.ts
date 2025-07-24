/// <reference types="vite/client" />

declare const GITHUB_RUNTIME_PERMANENT_NAME: string;
declare const BASE_KV_SERVICE_URL: string;

// Canvas 2D context extension for roundRect (for older browsers)
declare global {
  interface CanvasRenderingContext2D {
    roundRect(x: number, y: number, width: number, height: number, radius: number): void;
  }

  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }

  interface SpeechSynthesisErrorEvent extends Event {
    error: string;
  }
}