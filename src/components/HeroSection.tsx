import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles } from 'lucide-react';

interface HeroSectionProps {
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  selectedCity?: string;
  setSelectedCity?: (city: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = () => {
  const { themeConfig } = useApp();

  const heroConfig = themeConfig.heroBannerConfig || {
    enabled: true,
    type: 'slideshow',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1920&q=80',
    slideshowImages: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1920&q=80',
    ],
    slideshowIntervalSeconds: 6,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-neon-room-41584-large.mp4',
    opacity: 0.22,
    overlayTint: 'vignette',
    blur: 1,
    watermarkText: 'DIFUSION VENEZUELA',
  };

  // State for alternating images in slideshow mode
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const slides = heroConfig.slideshowImages && heroConfig.slideshowImages.length > 0
    ? heroConfig.slideshowImages
    : [heroConfig.imageUrl];

  useEffect(() => {
    if (!heroConfig.enabled || heroConfig.type !== 'slideshow' || slides.length <= 1) {
      return;
    }
    const intervalTime = Math.max(2, heroConfig.slideshowIntervalSeconds || 6) * 1000;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [heroConfig.enabled, heroConfig.type, heroConfig.slideshowIntervalSeconds, slides.length]);

  return (
    <section className="relative overflow-hidden border-b border-zinc-800/60 bg-gradient-to-b from-black via-zinc-950 to-black pt-8 pb-12 sm:pt-12 sm:pb-16 min-h-[460px] flex flex-col justify-center">
      {/* Dynamic Watermark Background Layer (Video / Alternating Slideshow / Image) */}
      {heroConfig.enabled && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
          {/* Mode 1: Looping HTML5 Video */}
          {heroConfig.type === 'video' && heroConfig.videoUrl && (
            <video
              key={heroConfig.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
              style={{
                opacity: heroConfig.opacity,
                filter: heroConfig.blur ? `blur(${heroConfig.blur}px)` : undefined,
                transform: 'scale(1.05)',
              }}
            >
              <source src={heroConfig.videoUrl} type="video/mp4" />
            </video>
          )}

          {/* Mode 2: Alternating Slideshow of Images */}
          {heroConfig.type === 'slideshow' && slides.length > 0 && (
            <div className="absolute inset-0 w-full h-full">
              {slides.map((imgUrl, idx) => (
                <div
                  key={`${imgUrl}-${idx}`}
                  className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out"
                  style={{
                    backgroundImage: `url(${imgUrl})`,
                    opacity: idx === currentSlideIndex ? heroConfig.opacity : 0,
                    filter: heroConfig.blur ? `blur(${heroConfig.blur}px)` : undefined,
                    transform: 'scale(1.05)',
                  }}
                />
              ))}
            </div>
          )}

          {/* Mode 3: Static Single Image */}
          {heroConfig.type === 'image' && heroConfig.imageUrl && (
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-700"
              style={{
                backgroundImage: `url(${heroConfig.imageUrl})`,
                opacity: heroConfig.opacity,
                filter: heroConfig.blur ? `blur(${heroConfig.blur}px)` : undefined,
                transform: 'scale(1.05)',
              }}
            />
          )}

          {/* Watermark Typographic Stamp in Background */}
          {heroConfig.watermarkText && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none whitespace-nowrap text-[6rem] sm:text-[10rem] md:text-[13rem] font-black tracking-tighter text-white/[0.03] select-none leading-none uppercase">
              {heroConfig.watermarkText}
            </div>
          )}

          {/* Vignette & Gradient Overlays for High Contrast & Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/45 to-black pointer-events-none" />
          {heroConfig.overlayTint === 'neon' && (
            <div
              className="absolute inset-0 pointer-events-none opacity-20 mix-blend-color"
              style={{ background: 'var(--color-primary)' }}
            />
          )}
          {(heroConfig.overlayTint === 'vignette' || heroConfig.overlayTint === 'dark') && (
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,black_85%)] pointer-events-none" />
          )}
        </div>
      )}

      {/* Subtle background ambient mesh glow */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] blur-[120px] rounded-full opacity-20 z-[1]"
        style={{ background: 'var(--color-primary)' }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Editorial Title & Kicker */}
        <div className="max-w-3xl text-center mx-auto mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[var(--color-primary)] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-ping" />
            Agencia & Contratación Directa · Venezuela 🇻🇪
          </div>
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight text-balance leading-tight">
            Modelos y Promotoras Élite para sus Empresas
          </h1>
          
          <p className="mt-3 text-sm sm:text-base text-zinc-400 text-balance font-normal leading-relaxed max-w-2xl mx-auto">
            DIFUSION Agency Venezuela · Staff exclusivo para protocolo, exposiciones comerciales, salones automotrices y activaciones de marca.
          </p>
        </div>

      </div>
    </section>
  );
};
