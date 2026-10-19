import React, { useState } from 'react';
import { FurnitureConfig } from '../types/furniture';
import { resolvePalette } from '../utils/themeColors';
import { Box, Eye, EyeOff, Sparkles, RotateCw } from 'lucide-react';

interface Perspective3DViewerProps {
  config: FurnitureConfig;
}

export const Perspective3DViewer: React.FC<Perspective3DViewerProps> = ({ config }) => {
  const [doorAngle, setDoorAngle] = useState(0); // 0 (closed) to 75 deg (open)
  const [viewAngle, setViewAngle] = useState<'front_left' | 'isometric' | 'front_right'>('isometric');

  const { wallWidth, wallHeight, depth, columns } = config;

  const resolved = resolvePalette(config);
  const palette = {
    carcase: resolved.carcaseBg,
    carcaseSide: resolved.carcaseSide,
    facade: resolved.facadeBg,
    facadeShadow: resolved.facadeShadow,
    border: resolved.carcaseBorder,
    handleColor: resolved.handleColor,
    glassColor: resolved.glassColor,
  };

  // Dynamic CSS 3D perspective transforms
  const rotationStyles = {
    front_left: 'rotateY(16deg) rotateX(4deg)',
    isometric: 'rotateY(-18deg) rotateX(10deg)',
    front_right: 'rotateY(-24deg) rotateX(6deg)',
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-2xl flex flex-col space-y-4">
      {/* 3D Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Box className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-100 uppercase tracking-wider">
              3D Real Perspektiva va Chuqurlik
            </h3>
            <p className="text-xs text-neutral-400">
              Mebelning xonadagi 3 o'lchamli ko'rinishi (Chuqurlik: {depth} sm)
            </p>
          </div>
        </div>

        {/* 3D Controls */}
        <div className="flex items-center gap-2">
          {/* Angle buttons */}
          <div className="flex items-center bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
            <button
              onClick={() => setViewAngle('front_left')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                viewAngle === 'front_left' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400'
              }`}
            >
              Chapdan
            </button>
            <button
              onClick={() => setViewAngle('isometric')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                viewAngle === 'isometric' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400'
              }`}
            >
              Izometriya
            </button>
            <button
              onClick={() => setViewAngle('front_right')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                viewAngle === 'front_right' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400'
              }`}
            >
              O'ngdan
            </button>
          </div>

          {/* Open/Close doors slider */}
          <button
            onClick={() => setDoorAngle(doorAngle > 0 ? 0 : 65)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              doorAngle > 0
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:text-white'
            }`}
          >
            {doorAngle > 0 ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{doorAngle > 0 ? 'Eshiklarni yopish' : '3D Eshiklarni ochish'}</span>
          </button>
        </div>
      </div>

      {/* 3D Stage Container */}
      <div
        className="relative w-full bg-gradient-to-b from-neutral-950 via-neutral-900/60 to-neutral-950 rounded-xl border border-neutral-800/80 p-8 sm:p-12 overflow-hidden flex items-center justify-center min-h-[380px] lg:min-h-[440px]"
        style={{ perspective: '1200px' }}
      >
        {/* Soft studio floor shadow */}
        <div
          className="absolute bottom-6 w-3/4 h-12 bg-black/70 rounded-full blur-xl pointer-events-none transform scale-y-50"
        />

        {/* 3D Model Wrapper */}
        <div
          className="relative transition-transform duration-500 ease-out flex items-center justify-center"
          style={{
            transform: rotationStyles[viewAngle],
            transformStyle: 'preserve-3d',
            maxWidth: '92%',
          }}
        >
          {/* Main Furniture Box */}
          <div
            className="relative border-4 rounded shadow-2xl flex"
            style={{
              width: `${Math.min(520, Math.max(280, (wallWidth / 280) * 440))}px`,
              height: `${Math.min(360, Math.max(220, (wallHeight / 240) * 300))}px`,
              backgroundColor: palette.carcase,
              borderColor: palette.border,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 2px 4px rgba(255,255,255,0.1)',
            }}
          >
            {/* 3D Extruded Depth Side (Simulated side panel) */}
            <div
              className="absolute top-0 right-0 h-full origin-left transition-all"
              style={{
                width: `${Math.max(20, Math.min(60, depth * 0.7))}px`,
                backgroundColor: palette.carcaseSide,
                transform: 'rotateY(90deg) translateZ(0px)',
                filter: 'brightness(0.75)',
              }}
            />

            {/* Render 3D Columns */}
            {columns.map((col, colIdx) => {
              const colRatio = col.widthRatio || 1;
              const totalColRatios = columns.reduce((acc, c) => acc + (c.widthRatio || 1), 0);
              const colWidthPercent = (colRatio / totalColRatios) * 100;
              const totalRatios = col.sections.reduce((acc, s) => acc + (s.heightRatio || 1), 0);

              return (
                <div
                  key={col.id}
                  className="h-full flex flex-col border-r border-neutral-700/60 last:border-r-0 relative"
                  style={{ width: `${colWidthPercent}%` }}
                >
                  {col.sections.map((sec, secIdx) => {
                    const secHeightPercent = (sec.heightRatio / totalRatios) * 100;

                    return (
                      <div
                        key={sec.id}
                        className="relative border-b border-neutral-700/60 last:border-b-0 overflow-hidden flex flex-col justify-center items-center"
                        style={{
                          height: `${secHeightPercent}%`,
                          backgroundColor:
                            sec.type === 'mirror'
                              ? '#cbd5e1'
                              : sec.type === 'door_glass'
                              ? '#1e293b'
                              : palette.carcase,
                        }}
                      >
                        {/* If door_wood or mirror or door_glass with 3D open angle */}
                        {(sec.type === 'door_wood' || sec.type === 'mirror' || sec.type === 'door_glass') && (
                          <div
                            className="absolute inset-0.5 border rounded-sm transition-transform duration-700 ease-out origin-left flex items-center justify-end pr-1.5 shadow-md"
                            style={{
                              transform: `rotateY(-${sec.isOpen ? 75 : doorAngle}deg)`,
                              backgroundColor:
                                sec.type === 'mirror'
                                  ? '#e2e8f0'
                                  : sec.type === 'door_glass'
                                  ? 'rgba(30, 41, 59, 0.85)'
                                  : palette.facade,
                              borderColor: palette.border,
                            }}
                          >
                            {/* Reflection sheen for mirror */}
                            {sec.type === 'mirror' && (
                              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent pointer-events-none" />
                            )}

                            {/* Handle in 3D */}
                            <div
                              className="w-1 h-8 rounded-full shadow-sm"
                              style={{ backgroundColor: palette.handleColor }}
                            />
                          </div>
                        )}

                        {/* If Drawers in 3D */}
                        {sec.type === 'drawers' && (
                          <div className="w-full h-full flex flex-col p-0.5 gap-0.5">
                            {[0, 1, 2].map((d) => (
                              <div
                                key={d}
                                className="flex-1 rounded-sm border flex items-center justify-center shadow-inner"
                                style={{
                                  backgroundColor: palette.facade,
                                  borderColor: palette.border,
                                }}
                              >
                                <div className="w-6 h-0.5 bg-neutral-800 rounded" />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* If TV Niche */}
                        {sec.type === 'tv_niche' && (
                          <div className="w-4/5 h-3/4 bg-neutral-950 rounded border border-neutral-800 flex items-center justify-center shadow-lg">
                            <span className="text-[9px] font-bold text-neutral-500 tracking-wider">
                              SMART TV
                            </span>
                          </div>
                        )}

                        {/* If Clothes Rail */}
                        {sec.type === 'clothes_rail' && (
                          <div className="w-full h-full p-2 flex flex-col items-center justify-center">
                            <div className="w-full h-1 bg-slate-300 rounded shadow-sm mb-1" />
                            <span className="text-[9px] text-neutral-400">Garderob Shtanga</span>
                          </div>
                        )}

                        {/* If Open Shelf */}
                        {sec.type === 'open_shelf' && (
                          <div className="w-full h-full flex flex-col justify-around p-1">
                            <div className="w-full h-0.5 bg-neutral-600" />
                            <div className="w-full h-0.5 bg-neutral-600" />
                          </div>
                        )}

                        {/* Warm LED Light glow if enabled */}
                        {sec.hasLed && (
                          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-300 shadow-[0_0_12px_#fde047]" />
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
