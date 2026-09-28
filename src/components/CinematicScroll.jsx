import { useEffect, useRef, useCallback } from 'react';
import { useContent } from '../context/ContentContext';

/* ── Helpers ── */
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

function stageOpacity(progress, start, end) {
  const fadeIn = 0.06;
  const fadeOut = 0.06;
  if (progress < start || progress > end) return 0;
  if (progress < start + fadeIn) return clamp((progress - start) / fadeIn, 0, 1);
  if (progress > end - fadeOut) return clamp((end - progress) / fadeOut, 0, 1);
  return 1;
}

function isMobile() {
  return window.innerWidth <= 768;
}

export default function CinematicScroll() {
  const { content } = useContent();

  const JOURNEY_STAGES = [
    { start: -0.10, end: 0.20, ...content.cinematic_stages[0] },
    { start: 0.18, end: 0.38, ...content.cinematic_stages[1] },
    { start: 0.36, end: 0.56, ...content.cinematic_stages[2] },
    { start: 0.54, end: 0.76, ...content.cinematic_stages[3] },
    { start: 0.74, end: 0.95, ...content.cinematic_stages[4] },
  ];

  const sectionRef = useRef(null);
  const videoRef = useRef(null); // Video A
  const transVideoRef = useRef(null); // Video B
  const loopVideoRef = useRef(null); // Video C
  
  const rafRef = useRef(null);
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const introProgressRef = useRef(0); // For initial page load animation
  const durationRef = useRef(0);
  const stageRefs = useRef([]);
  const scrollHintRef = useRef(null);
  const isSeeking = useRef(false);
  const transFinished = useRef(false);

  /* ── Scroll → progress ── */
  const updateProgress = useCallback(() => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const scrollable = sectionRef.current.offsetHeight - window.innerHeight;
    const raw = scrollable > 0 ? -rect.top / scrollable : 0;
    targetProgressRef.current = clamp(raw, 0, 1);
  }, []);

  /* ── Animation loop ── */
  const animate = useCallback(() => {
    const video = videoRef.current;
    const transVideo = transVideoRef.current;
    const loopVideo = loopVideoRef.current;
    
    if (!video || !transVideo || !loopVideo || durationRef.current === 0) {
      rafRef.current = requestAnimationFrame(animate);
      return;
    }

    // Intro animation loop independent of scroll
    if (introProgressRef.current < 1) {
      introProgressRef.current = Math.min(1, introProgressRef.current + 0.015);
    }

    const current = progressRef.current;
    const target = targetProgressRef.current;
    const diff = target - current;
    const absDiff = Math.abs(diff);

    // Adaptive lerp: fast for big jumps, smooth for micro movements
    let lerpFactor;
    if (absDiff > 0.08) lerpFactor = 0.25;
    else if (absDiff > 0.02) lerpFactor = 0.15;
    else lerpFactor = 0.10;

    let newProgress = current + diff * lerpFactor;
    if (Math.abs(newProgress - target) < 0.0008) newProgress = target;

    if (Math.abs(newProgress - current) > 0.00005) {
      progressRef.current = newProgress;
      const targetTime = clamp(newProgress * durationRef.current, 0, durationRef.current);

      // Seek — with GOP=1 every frame is a keyframe, so seeking is instant
      if (!isSeeking.current && Math.abs(video.currentTime - targetTime) > 0.02) {
        isSeeking.current = true;
        video.currentTime = targetTime;
      }
    }

    const p = progressRef.current;

    // Transition Logic: A -> B -> C
    if (p >= 1) {
      video.style.opacity = '0';
      
      if (!transFinished.current) {
        // Play B
        transVideo.style.opacity = '1';
        loopVideo.style.opacity = '0';
        if (transVideo.paused) transVideo.play().catch(() => {});
        
        // Fallback in case 'ended' event misses
        if (transVideo.currentTime >= transVideo.duration - 0.1 && transVideo.duration > 0) {
          transFinished.current = true;
        }
      } else {
        // Play C
        transVideo.style.opacity = '0';
        loopVideo.style.opacity = '1';
        if (loopVideo.paused) loopVideo.play().catch(() => {});
      }
    } else {
      // Scrubbing A
      video.style.opacity = '1';
      transVideo.style.opacity = '0';
      loopVideo.style.opacity = '0';
      
      transFinished.current = false;
      if (!transVideo.paused) transVideo.pause();
      if (transVideo.currentTime > 0) transVideo.currentTime = 0;
      
      if (!loopVideo.paused) loopVideo.pause();
      if (loopVideo.currentTime > 0) loopVideo.currentTime = 0;
    }

    // Update text overlays directly on DOM
    for (let i = 0; i < JOURNEY_STAGES.length; i++) {
      const el = stageRefs.current[i];
      if (!el) continue;
      const { start, end } = JOURNEY_STAGES[i];
      let op = stageOpacity(p, start, end);
      
      // First stage animates automatically on load
      if (i === 0) {
        op = op * introProgressRef.current;
      }

      el.style.opacity = op;
      el.style.transform = `translateY(${(1 - op) * 25}px)`;
      el.style.pointerEvents = op > 0.1 ? 'auto' : 'none';
    }

    if (scrollHintRef.current) {
      let firstOp = stageOpacity(p, JOURNEY_STAGES[0].start, JOURNEY_STAGES[0].end);
      firstOp = firstOp * introProgressRef.current;
      scrollHintRef.current.style.opacity = firstOp > 0.5 ? 1 : 0;
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  /* ── Setup ── */
  useEffect(() => {
    const video = videoRef.current;
    const transVideo = transVideoRef.current;
    if (!video || !transVideo) return;

    const onLoadedMetadata = () => {
      durationRef.current = video.duration;
      video.currentTime = 0.001;
    };

    const onSeeked = () => {
      isSeeking.current = false;
    };
    
    const onTransEnded = () => {
      transFinished.current = true;
    };

    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('seeked', onSeeked);
    transVideo.addEventListener('ended', onTransEnded);
    window.addEventListener('scroll', updateProgress, { passive: true });

    updateProgress();
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', updateProgress);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('seeked', onSeeked);
      transVideo.removeEventListener('ended', onTransEnded);
    };
  }, [animate, updateProgress]);

  const videoSrc = isMobile()
    ? '/journey-scrub-mobile.mp4'
    : '/journey-scrub.mp4';

  return (
    <section ref={sectionRef} className="cinematic-section" id="cinematic-journey">
      <div className="cinematic-sticky">
        {/* Video C: Looping Lava Background */}
        <video
          ref={loopVideoRef}
          src="/lava-bg.mp4"
          loop
          muted
          playsInline
          preload="auto"
          className="cinematic-video"
          style={{ opacity: 0 }}
        />
        
        {/* Video B: Transition (Explosion to Flowing Lava) */}
        <video
          ref={transVideoRef}
          src="/transition.mp4"
          muted
          playsInline
          preload="auto"
          className="cinematic-video"
          style={{ opacity: 0 }}
        />

        {/* Video A: Scrub-optimized cinematic journey */}
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          playsInline
          preload="auto"
          className="cinematic-video"
          style={{ opacity: 1 }}
        />

        {/* Cinematic overlays */}
        <div className="cinematic-overlay" />
        <div className="cinematic-vignette" />

        {/* Journey text overlays */}
        <div className="cinematic-text-container">
          {JOURNEY_STAGES.map((stage, i) => (
            <div
              key={i}
              className="cinematic-stage"
              ref={(el) => { stageRefs.current[i] = el; }}
              style={{
                opacity: 0,
                transform: 'translateY(25px)',
                pointerEvents: 'none',
              }}
            >
              {stage.title && <h1 className="cinematic-title">{stage.title}</h1>}
              {stage.subtitle && <p className="cinematic-subtitle">{stage.subtitle}</p>}
              {stage.desc && <p className="cinematic-desc">{stage.desc}</p>}
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div ref={scrollHintRef} className="cinematic-scroll-hint" style={{ opacity: 0 }}>
          <div className="cinematic-scroll-line" />
          <span>Scroll para explorar</span>
        </div>
      </div>
    </section>
  );
}
