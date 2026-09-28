import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Volume2, Wind, X } from 'lucide-react';
import { Landmark } from '../types/landmark';
import { TourAudioGuide, ambiancePlayer } from '../utils/soundAmbiance';

interface AudioTourBarProps {
  landmark: Landmark;
  playTrigger?: number;
}

export const AudioTourBar: React.FC<AudioTourBarProps> = ({ landmark, playTrigger }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [ambientActive, setAmbientActive] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const guideRef = useRef<TourAudioGuide | null>(null);

  useEffect(() => {
    guideRef.current = new TourAudioGuide((state) => {
      setIsPlaying(state.isPlaying);
      setIsPaused(state.isPaused);
      setProgress(state.progress);
      if (state.isPlaying) {
        setIsExpanded(true);
      }
    });

    return () => {
      if (guideRef.current) {
        guideRef.current.stop();
      }
    };
  }, []);

  // Stop when landmark changes
  useEffect(() => {
    if (guideRef.current && isPlaying) {
      guideRef.current.stop();
    }
    setIsExpanded(false);
  }, [landmark.id]);

  // Handle external play trigger (from Hero CTA button or content button)
  useEffect(() => {
    if (playTrigger && playTrigger > 0) {
      setIsExpanded(true);
      handlePlay();
    }
  }, [playTrigger]);

  const handlePlay = () => {
    if (!guideRef.current) return;
    const textToRead = landmark.audioGuide?.script || landmark.overview;
    guideRef.current.speak(textToRead, playbackRate);
    if (ambientActive) {
      ambiancePlayer.startAmbiance(landmark.category === 'island_beach' ? 'waves' : 'breeze');
    }
  };

  const handlePlayToggle = () => {
    if (!guideRef.current) return;

    if (isPlaying) {
      if (isPaused) {
        guideRef.current.resume();
      } else {
        guideRef.current.pause();
      }
    } else {
      handlePlay();
    }
  };

  const handleStop = () => {
    if (guideRef.current) {
      guideRef.current.stop();
    }
    ambiancePlayer.stopAmbiance();
  };

  const handleClose = () => {
    handleStop();
    setIsExpanded(false);
  };

  const handleToggleAmbient = () => {
    if (ambientActive) {
      ambiancePlayer.stopAmbiance();
      setAmbientActive(false);
    } else {
      setAmbientActive(true);
      if (isPlaying) {
        ambiancePlayer.startAmbiance(landmark.category === 'island_beach' ? 'waves' : 'breeze');
      }
    }
  };

  const handleChangeRate = (rate: number) => {
    setPlaybackRate(rate);
    if (guideRef.current && isPlaying) {
      const textToRead = landmark.audioGuide?.script || landmark.overview;
      guideRef.current.setRate(rate, textToRead);
    }
  };

  // Do not render any floating element when idle / closed so it never blocks or overlaps the UI
  if (!isExpanded && !isPlaying) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 max-w-sm w-full px-4 animate-fade-in pointer-events-auto">
      <div className="w-full bg-[#1C1917]/95 text-stone-100 p-4 rounded-2xl shadow-2xl border border-stone-800 backdrop-blur-md transition-all">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-800/80">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Volume2 className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold block">
                Audio Guide Thuyết Minh
              </span>
              <h4 className="text-xs font-serif text-stone-200 truncate">
                {landmark.audioGuide?.title || `Thuyết minh ${landmark.name}`}
              </h4>
            </div>
          </div>
          
          <button
            onClick={handleClose}
            className="text-stone-400 hover:text-stone-100 p-1.5 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
            title="Đóng trình phát"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="space-y-1 my-2">
          <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-400 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-stone-400 font-mono">
            <span>{landmark.audioGuide?.durationEstimateMinutes || 3} phút nghe</span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-1 gap-2">
          {/* Speed Rate */}
          <div className="flex items-center bg-stone-800/80 rounded px-1.5 py-0.5 border border-stone-700/60">
            {[0.8, 1.0, 1.2].map((rate) => (
              <button
                key={rate}
                onClick={() => handleChangeRate(rate)}
                className={`px-1.5 py-0.5 text-[10px] rounded cursor-pointer transition-colors ${
                  playbackRate === rate ? 'text-amber-300 font-bold' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>

          {/* Ambient Sound */}
          <button
            onClick={handleToggleAmbient}
            className={`p-1.5 rounded text-xs transition-colors cursor-pointer border flex items-center gap-1 ${
              ambientActive
                ? 'border-amber-500/50 bg-amber-950/40 text-amber-300'
                : 'border-stone-800 text-stone-500 hover:text-stone-300'
            }`}
            title={ambientActive ? 'Tắt tiếng gió thiên nhiên' : 'Bật tiếng gió thiên nhiên'}
          >
            <Wind className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden sm:inline">Gió</span>
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={handlePlayToggle}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer transition-all shadow-md active:scale-95"
          >
            {isPlaying && !isPaused ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Tạm dừng</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isPaused ? 'Tiếp tục' : 'Phát'}</span>
              </>
            )}
          </button>

          {/* Stop Button */}
          {isPlaying && (
            <button
              onClick={handleStop}
              className="p-1.5 text-stone-400 hover:text-stone-100 bg-stone-800 hover:bg-stone-700 rounded-lg cursor-pointer transition-colors"
              title="Dừng phát"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
