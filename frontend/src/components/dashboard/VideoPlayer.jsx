import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Play, Pause, SkipBack, SkipForward, Maximize, Volume2,
    ZoomIn, ZoomOut, Settings, Info, Monitor, ChevronLeft, ChevronRight
} from 'lucide-react';

const VideoPlayer = memo(({ defect, totalFrames = 300 }) => {
    const [currentFrame, setCurrentFrame] = useState(defect?.frameNumber || 1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [zoom, setZoom] = useState(1);
    const canvasRef = useRef(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (defect) setCurrentFrame(defect.frameNumber);
    }, [defect]);

    useEffect(() => {
        setProgress((currentFrame / totalFrames) * 100);
    }, [currentFrame, totalFrames]);

    // Draw frame with bounding box
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        // Background - simulate infrastructure image
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, w, h);

        // Simulated infrastructure pattern
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i < w; i += 30) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, h);
            ctx.stroke();
        }
        for (let j = 0; j < h; j += 30) {
            ctx.beginPath();
            ctx.moveTo(0, j);
            ctx.lineTo(w, j);
            ctx.stroke();
        }

        // Simulated concrete texture
        ctx.fillStyle = 'rgba(180, 170, 160, 0.15)';
        ctx.fillRect(50, 20, w - 100, h - 40);
        ctx.fillStyle = 'rgba(160, 150, 140, 0.1)';
        ctx.fillRect(80, 50, w - 160, h - 100);

        // Frame number overlay
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, 120, 28);
        ctx.font = '12px monospace';
        ctx.fillStyle = '#00d4ff';
        ctx.fillText(`Frame: ${currentFrame}/${totalFrames}`, 8, 18);

        // Draw bounding box if defect selected
        if (defect && currentFrame === defect.frameNumber) {
            const box = defect.coordinates;
            const scaleX = w / 800;
            const scaleY = h / 500;

            // Red bounding box
            ctx.strokeStyle = defect.severityColor || '#ff3366';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 3]);
            ctx.strokeRect(box.x * scaleX, box.y * scaleY, box.width * scaleX, box.height * scaleY);
            ctx.setLineDash([]);

            // Label background
            const label = `${defect.typeLabel} ${defect.confidence}%`;
            ctx.font = 'bold 11px Inter, sans-serif';
            const textW = ctx.measureText(label).width + 10;
            ctx.fillStyle = defect.severityColor || '#ff3366';
            ctx.fillRect(box.x * scaleX, (box.y * scaleY) - 22, textW, 20);

            // Label text
            ctx.fillStyle = '#ffffff';
            ctx.fillText(label, (box.x * scaleX) + 5, (box.y * scaleY) - 7);
        }
    }, [currentFrame, defect, totalFrames]);

    const togglePlay = useCallback(() => {
        if (isPlaying) {
            clearInterval(intervalRef.current);
            setIsPlaying(false);
        } else {
            setIsPlaying(true);
            intervalRef.current = setInterval(() => {
                setCurrentFrame(prev => {
                    if (prev >= totalFrames) {
                        clearInterval(intervalRef.current);
                        setIsPlaying(false);
                        return totalFrames;
                    }
                    return prev + 1;
                });
            }, 100);
        }
    }, [isPlaying, totalFrames]);

    const prevFrame = () => setCurrentFrame(prev => Math.max(1, prev - 1));
    const nextFrame = () => setCurrentFrame(prev => Math.min(totalFrames, prev + 1));

    useEffect(() => {
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, []);

    return (
        <div className="space-y-3">
            {/* Canvas */}
            <div className="relative rounded-lg overflow-hidden bg-dark-800 border border-white/5">
                <canvas
                    ref={canvasRef}
                    width={640}
                    height={360}
                    className="w-full h-auto"
                    style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
                />

                {/* Overlay controls */}
                {defect && currentFrame === defect.frameNumber && (
                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 text-xs text-cyan-400 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        {defect.typeLabel}
                    </div>
                )}
            </div>

            {/* Progress bar */}
            <div
                className="w-full h-2 bg-white/5 rounded-full cursor-pointer group"
                onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pct = (e.clientX - rect.left) / rect.width;
                    setCurrentFrame(Math.round(pct * totalFrames));
                }}
            >
                <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full relative transition-all"
                    style={{ width: `${progress}%` }}
                >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-glow-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <button onClick={prevFrame} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                        <SkipBack className="w-4 h-4" />
                    </button>
                    <button onClick={togglePlay} className="p-2 rounded-lg text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 transition-all">
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <button onClick={nextFrame} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                        <SkipForward className="w-4 h-4" />
                    </button>
                </div>

                <span className="text-xs text-gray-500 font-mono">
                    {currentFrame} / {totalFrames}
                </span>

                <div className="flex items-center gap-1">
                    <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                        <ZoomOut className="w-4 h-4" />
                    </button>
                    <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                        <ZoomIn className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                        <Settings className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
});

VideoPlayer.displayName = 'VideoPlayer';
export default VideoPlayer;
