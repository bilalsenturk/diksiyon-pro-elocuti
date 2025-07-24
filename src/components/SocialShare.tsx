import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  ShareNetwork,
  TwitterLogo,
  FacebookLogo,
  LinkedinLogo,
  WhatsappLogo,
  Copy,
  Download,
  Sparkles,
  TrendingUp,
  Clock,
  Volume2
} from '@phosphor-icons/react';

interface AnalysisResult {
  pitch: {
    score: number;
  };
  tempo: {
    score: number;
  };
  clarity: {
    score: number;
  };
  overallScore: number;
  timestamp: number;
}

interface SocialShareProps {
  analysis: AnalysisResult;
  trigger?: React.ReactNode;
}

export function SocialShare({ analysis, trigger }: SocialShareProps) {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Mükemmel';
    if (score >= 60) return 'İyi';
    if (score >= 40) return 'Orta';
    return 'Geliştirilmeli';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 80) return '🎯';
    if (score >= 60) return '👍';
    if (score >= 40) return '📈';
    return '💪';
  };

  const generateShareText = useCallback(() => {
    const emoji = getScoreEmoji(analysis.overallScore);
    const label = getScoreLabel(analysis.overallScore);
    
    return `${emoji} Diksiyon analiz sonucum: ${Math.round(analysis.overallScore)}/100 (${label})

📊 Detaylar:
• Pitch: ${Math.round(analysis.pitch.score)}/100
• Tempo: ${Math.round(analysis.tempo.score)}/100  
• Netlik: ${Math.round(analysis.clarity.score)}/100

Konuşma becerilerimi Diksiyon Geliştirme Uygulaması ile geliştiriyorum! 🗣️

#diksiyon #konuşma #gelişim #sesanalizi`;
  }, [analysis]);

  const generateImageCard = useCallback(async () => {
    setIsGeneratingImage(true);
    
    try {
      // Create a canvas element to generate the share image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Canvas context not available');
      }

      // Set canvas size
      canvas.width = 600;
      canvas.height = 400;

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#3b82f6');
      gradient.addColorStop(1, '#1e40af');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add subtle pattern
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      for (let i = 0; i < canvas.width; i += 20) {
        for (let j = 0; j < canvas.height; j += 20) {
          if ((i + j) % 40 === 0) {
            ctx.fillRect(i, j, 2, 2);
          }
        }
      }

      // Add main content background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.roundRect(40, 40, canvas.width - 80, canvas.height - 80, 20);
      ctx.fill();

      // Set text properties
      ctx.fillStyle = '#1f2937';
      ctx.textAlign = 'center';

      // Title
      ctx.font = 'bold 32px Inter, system-ui, sans-serif';
      ctx.fillText('Diksiyon Analiz Sonucum', canvas.width / 2, 100);

      // Overall score
      ctx.font = 'bold 48px Inter, system-ui, sans-serif';
      ctx.fillStyle = analysis.overallScore >= 80 ? '#16a34a' : analysis.overallScore >= 60 ? '#eab308' : '#dc2626';
      ctx.fillText(`${Math.round(analysis.overallScore)}/100`, canvas.width / 2, 160);

      // Score label
      ctx.font = '24px Inter, system-ui, sans-serif';
      ctx.fillStyle = '#6b7280';
      ctx.fillText(getScoreLabel(analysis.overallScore), canvas.width / 2, 190);

      // Individual scores
      ctx.font = '18px Inter, system-ui, sans-serif';
      ctx.fillStyle = '#374151';
      ctx.textAlign = 'left';

      const detailsY = 240;
      const detailsX = 120;
      const lineHeight = 30;

      ctx.fillText(`Pitch Skoru: ${Math.round(analysis.pitch.score)}/100`, detailsX, detailsY);
      ctx.fillText(`Tempo Skoru: ${Math.round(analysis.tempo.score)}/100`, detailsX, detailsY + lineHeight);
      ctx.fillText(`Netlik Skoru: ${Math.round(analysis.clarity.score)}/100`, detailsX, detailsY + lineHeight * 2);

      // App branding
      ctx.font = '16px Inter, system-ui, sans-serif';
      ctx.fillStyle = '#6b7280';
      ctx.textAlign = 'center';
      ctx.fillText('Diksiyon Geliştirme Uygulaması', canvas.width / 2, canvas.height - 60);

      // Convert to blob and download
      return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to generate image'));
          }
        }, 'image/png');
      });
      
    } catch (error) {
      console.error('Error generating share image:', error);
      throw error;
    } finally {
      setIsGeneratingImage(false);
    }
  }, [analysis]);

  const handleCopyText = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generateShareText());
      toast.success('Paylaşım metni kopyalandı!');
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error('Kopyalama başarısız. Metni manuel olarak seçip kopyalayın.');
    }
  }, [generateShareText]);

  const handleDownloadImage = useCallback(async () => {
    try {
      const blob = await generateImageCard();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `diksiyon-analiz-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Görsel indirildi!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Görsel indirme başarısız.');
    }
  }, [generateImageCard]);

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(generateShareText())}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(generateShareText())}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(generateShareText())}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(generateShareText())}`
  };

  const handleSocialShare = useCallback((platform: keyof typeof shareUrls) => {
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  }, [shareUrls]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <ShareNetwork className="h-4 w-4" />
            Paylaş
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShareNetwork className="h-5 w-5" />
            Sonuçları Paylaş
          </DialogTitle>
          <DialogDescription>
            Analiz sonuçlarınızı sosyal medyada paylaşarak ilerlemenizi arkadaşlarınızla kutlayın
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Preview Card */}
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-dashed">
            <CardContent className="p-4 text-center space-y-3">
              <div className="flex items-center justify-center gap-2 text-lg font-semibold">
                <Sparkles className="h-5 w-5 text-primary" />
                Diksiyon Analiz Sonucum
              </div>
              
              <div className="text-3xl font-bold text-primary">
                {Math.round(analysis.overallScore)}/100
              </div>
              
              <Badge variant="secondary" className="text-sm">
                {getScoreLabel(analysis.overallScore)} {getScoreEmoji(analysis.overallScore)}
              </Badge>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-blue-600" />
                  <span>Pitch: {Math.round(analysis.pitch.score)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-green-600" />
                  <span>Tempo: {Math.round(analysis.tempo.score)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Volume2 className="h-3 w-3 text-purple-600" />
                  <span>Netlik: {Math.round(analysis.clarity.score)}</span>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Diksiyon Geliştirme Uygulaması
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button 
                onClick={handleCopyText}
                variant="outline" 
                className="flex-1 gap-2"
              >
                <Copy className="h-4 w-4" />
                Metni Kopyala
              </Button>
              <Button 
                onClick={handleDownloadImage}
                variant="outline" 
                className="flex-1 gap-2"
                disabled={isGeneratingImage}
              >
                <Download className="h-4 w-4" />
                {isGeneratingImage ? 'Hazırlanıyor...' : 'Görsel İndir'}
              </Button>
            </div>

            <Separator />

            {/* Social Media Buttons */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-center">Sosyal Medyada Paylaş</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleSocialShare('twitter')}
                  className="gap-2 border-blue-500/20 hover:bg-blue-50"
                >
                  <TwitterLogo className="h-4 w-4 text-blue-500" />
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSocialShare('facebook')}
                  className="gap-2 border-blue-600/20 hover:bg-blue-50"
                >
                  <FacebookLogo className="h-4 w-4 text-blue-600" />
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSocialShare('linkedin')}
                  className="gap-2 border-blue-700/20 hover:bg-blue-50"
                >
                  <LinkedinLogo className="h-4 w-4 text-blue-700" />
                  LinkedIn
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSocialShare('whatsapp')}
                  className="gap-2 border-green-600/20 hover:bg-green-50"
                >
                  <WhatsappLogo className="h-4 w-4 text-green-600" />
                  WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper function for canvas rounded rectangles (for older browsers)
declare global {
  interface CanvasRenderingContext2D {
    roundRect(x: number, y: number, width: number, height: number, radius: number): void;
  }
}

if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x: number, y: number, width: number, height: number, radius: number) {
    this.beginPath();
    this.moveTo(x + radius, y);
    this.lineTo(x + width - radius, y);
    this.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.lineTo(x + width, y + height - radius);
    this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.lineTo(x + radius, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.lineTo(x, y + radius);
    this.quadraticCurveTo(x, y, x + radius, y);
    this.closePath();
  };
}