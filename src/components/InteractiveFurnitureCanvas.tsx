import React, { useState } from 'react';
import {
  FurnitureConfig,
  FurnitureColumn,
  SectionModule,
  ColorTheme,
  HandlesType,
} from '../types/furniture';
import { resolvePalette } from '../utils/themeColors';
import {
  Maximize2,
  Sparkles,
  Eye,
  EyeOff,
  Edit3,
  Layers,
  ZoomIn,
} from 'lucide-react';

interface InteractiveFurnitureCanvasProps {
  config: FurnitureConfig;
  onSelectSection: (colIndex: number, secIndex: number) => void;
  selectedCoordinates?: { colIndex: number; secIndex: number } | null;
}

export const InteractiveFurnitureCanvas: React.FC<InteractiveFurnitureCanvasProps> = ({
  config,
  onSelectSection,
  selectedCoordinates,
}) => {
  const [openAllDoors, setOpenAllDoors] = useState(false);
  const [showDimensions, setShowDimensions] = useState(true);

  const { wallWidth, wallHeight, depth, columns, colorTheme, handlesType } = config;

  // Visual aspect ratio and SVG coordinate sizing
  // We'll normalize SVG viewBox based on real wall dimensions in cm with padding for dimension lines
  const paddingX = 70; // cm for dimension labels
  const paddingY = 60; // cm for top/bottom dimension labels
  const svgWidth = wallWidth + paddingX * 2;
  const svgHeight = wallHeight + paddingY * 2;
  const originX = paddingX;
  const originY = paddingY;

  // Calculate column widths
  const totalColRatios = columns.reduce((acc, col) => acc + (col.widthRatio || 1), 0);
  let currentX = originX;

  const themeStyles = resolvePalette(config);

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-2xl flex flex-col space-y-4">
      {/* 1. Canvas Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <h2 className="text-sm font-bold text-neutral-100 uppercase tracking-wider">
            2. Interaktiv Konstruktor (Chizma va Ko'rinish)
          </h2>
          <span className="text-xs text-neutral-400 hidden sm:inline">
            • Istalgan qismni bosib almashtiring
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Doors Open/Close */}
          <button
            onClick={() => setOpenAllDoors(!openAllDoors)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              openAllDoors
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:text-white'
            }`}
          >
            {openAllDoors ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{openAllDoors ? 'Eshiklarni yopish' : 'Ichini ko\'rish (Eshiklarni ochish)'}</span>
          </button>

          {/* Toggle Dimensions */}
          <button
            onClick={() => setShowDimensions(!showDimensions)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              showDimensions
                ? 'bg-neutral-800 text-neutral-200 border-neutral-700'
                : 'bg-neutral-950 text-neutral-400 border-neutral-800'
            }`}
          >
            O'lcham chiziqlari {showDimensions ? '✓' : ''}
          </button>
        </div>
      </div>

      {/* 2. Main Architectural SVG Canvas */}
      <div className="relative w-full bg-neutral-950 rounded-xl border border-neutral-800/80 p-2 sm:p-4 overflow-hidden flex items-center justify-center min-h-[380px] lg:min-h-[460px] select-none">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, #525252 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
        />

        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full max-h-[580px] h-auto drop-shadow-2xl transition-all duration-300"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Mirror Silver Reflection Gradient */}
            <linearGradient id="mirrorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#cfd8dc" stopOpacity="0.9" />
              <stop offset="25%" stopColor="#f5f7f8" stopOpacity="0.95" />
              <stop offset="45%" stopColor="#b0bec5" stopOpacity="0.85" />
              <stop offset="70%" stopColor="#eceff1" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#90a4ae" stopOpacity="0.9" />
            </linearGradient>

            {/* Glass Smoked Vitrina Gradient */}
            <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.85" />
              <stop offset="40%" stopColor="#334155" stopOpacity="0.75" />
              <stop offset="60%" stopColor="#0f172a" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#1e293b" stopOpacity="0.85" />
            </linearGradient>

            {/* Warm LED Glow Filter */}
            <filter id="ledGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Soft Drop Shadow for Facades */}
            <filter id="facadeShadow" x="-5%" y="-5%" width="110%" height="110%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Wall background indicator */}
          <rect
            x={originX - 12}
            y={originY - 12}
            width={wallWidth + 24}
            height={wallHeight + 24}
            fill="#121316"
            stroke="#262626"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            rx="4"
          />

          {/* Floor / Plinth base line */}
          <line
            x1={originX - 25}
            y1={originY + wallHeight}
            x2={originX + wallWidth + 25}
            y2={originY + wallHeight}
            stroke="#525252"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Plinth (Tsokol) under furniture */}
          <rect
            x={originX + 2}
            y={originY + wallHeight - 8}
            width={wallWidth - 4}
            height={8}
            fill="#171717"
            stroke="#404040"
            strokeWidth="1"
          />

          {/* Furniture Main Outer Carcase Frame */}
          <rect
            x={originX}
            y={originY}
            width={wallWidth}
            height={wallHeight - 8}
            fill={themeStyles.carcaseBg}
            stroke={themeStyles.carcaseBorder}
            strokeWidth="2.5"
            rx="2"
          />

          {/* Render Columns & Sections */}
          {columns.map((col, colIdx) => {
            const colRatio = col.widthRatio || 1;
            const colWidth = (colRatio / totalColRatios) * wallWidth;
            const colX = currentX;
            currentX += colWidth;

            // Height ratios
            const totalRatios = col.sections.reduce((acc, s) => acc + (s.heightRatio || 1), 0);
            let currentSecY = originY;

            return (
              <g key={col.id}>
                {/* Column divider vertical wall */}
                {colIdx > 0 && (
                  <line
                    x1={colX}
                    y1={originY}
                    x2={colX}
                    y2={originY + wallHeight - 8}
                    stroke={themeStyles.carcaseBorder}
                    strokeWidth="2"
                  />
                )}

                {/* Sections in this column */}
                {col.sections.map((sec, secIdx) => {
                  const secHeight = (sec.heightRatio / totalRatios) * (wallHeight - 8);
                  const secY = currentSecY;
                  currentSecY += secHeight;

                  const isSelected =
                    selectedCoordinates?.colIndex === colIdx &&
                    selectedCoordinates?.secIndex === secIdx;
                  const isDoorOpen = openAllDoors || sec.isOpen;

                  return (
                    <g
                      key={sec.id}
                      onClick={() => onSelectSection(colIdx, secIdx)}
                      className="cursor-pointer group"
                    >
                      {/* Section interior background (always behind) */}
                      <rect
                        x={colX + 2}
                        y={secY + 2}
                        width={colWidth - 4}
                        height={secHeight - 4}
                        fill={themeStyles.shelfBg}
                        stroke={themeStyles.carcaseBorder}
                        strokeWidth="1"
                      />

                      {/* Internal Shelves */}
                      {Array.from({ length: sec.shelvesCount ?? 1 }).map((_, shelfIdx) => {
                        const shelfY =
                          secY + ((shelfIdx + 1) / ((sec.shelvesCount ?? 1) + 1)) * secHeight;
                        return (
                          <g key={shelfIdx}>
                            <rect
                              x={colX + 3}
                              y={shelfY - 1}
                              width={colWidth - 6}
                              height={2.5}
                              fill={themeStyles.carcaseBorder}
                            />
                            {/* Decorative books or objects on some open shelves */}
                            {sec.type === 'open_shelf' && shelfIdx === 0 && colWidth > 40 && (
                              <g opacity="0.6">
                                <rect x={colX + 8} y={shelfY - 14} width={5} height={13} fill="#f59e0b" rx="1" />
                                <rect x={colX + 14} y={shelfY - 16} width={6} height={15} fill="#3b82f6" rx="1" />
                                <rect x={colX + 21} y={shelfY - 12} width={5} height={11} fill="#10b981" rx="1" />
                              </g>
                            )}
                          </g>
                        );
                      })}

                      {/* Clothes rail if type === clothes_rail */}
                      {sec.type === 'clothes_rail' && (
                        <g>
                          {/* Chrome rail pipe */}
                          <rect
                            x={colX + 6}
                            y={secY + 18}
                            width={colWidth - 12}
                            height={4}
                            fill="#cbd5e1"
                            stroke="#64748b"
                            strokeWidth="0.8"
                            rx="1"
                          />
                          {/* Clothes hangers silhouettes */}
                          {Array.from({ length: Math.max(2, Math.floor(colWidth / 18)) }).map((_, i) => {
                            const hx = colX + 12 + i * 18;
                            return (
                              <g key={i} opacity="0.75">
                                {/* Hanger hook */}
                                <path
                                  d={`M ${hx + 5} ${secY + 18} Q ${hx + 5} ${secY + 12} ${hx + 9} ${secY + 14}`}
                                  stroke="#94a3b8"
                                  strokeWidth="1.2"
                                  fill="none"
                                />
                                {/* Clothes outline */}
                                <path
                                  d={`M ${hx} ${secY + 22} L ${hx + 18} ${secY + 22} L ${hx + 16} ${secY + Math.min(secHeight - 10, 70)} L ${hx + 2} ${secY + Math.min(secHeight - 10, 70)} Z`}
                                  fill={i % 2 === 0 ? '#334155' : '#475569'}
                                  rx="2"
                                />
                              </g>
                            );
                          })}
                        </g>
                      )}

                      {/* TV Screen if type === tv_niche */}
                      {sec.type === 'tv_niche' && (
                        <g>
                          {/* TV frame */}
                          <rect
                            x={colX + 10}
                            y={secY + 10}
                            width={colWidth - 20}
                            height={secHeight - 20}
                            fill="#09090b"
                            stroke="#27272a"
                            strokeWidth="2"
                            rx="3"
                          />
                          {/* TV Screen glare */}
                          <rect
                            x={colX + 12}
                            y={secY + 12}
                            width={colWidth - 24}
                            height={secHeight - 24}
                            fill="#18181b"
                            rx="2"
                          />
                          <path
                            d={`M ${colX + 15} ${secY + 15} L ${colX + colWidth * 0.45} ${secY + 15} L ${colX + 15} ${secY + secHeight * 0.4} Z`}
                            fill="#ffffff"
                            opacity="0.05"
                          />
                          <text
                            x={colX + colWidth / 2}
                            y={secY + secHeight / 2 + 3}
                            textAnchor="middle"
                            fill="#71717a"
                            fontSize="8"
                            fontFamily="sans-serif"
                            fontWeight="bold"
                          >
                            SMART TV 4K
                          </text>
                        </g>
                      )}

                      {/* Desk Niche */}
                      {sec.type === 'desk_niche' && (
                        <g>
                          {/* Desk countertop */}
                          <rect
                            x={colX + 2}
                            y={secY + secHeight - 8}
                            width={colWidth - 4}
                            height={6}
                            fill={themeStyles.carcaseBorder}
                            stroke="#000"
                            strokeWidth="0.5"
                          />
                          {/* Laptop */}
                          <rect
                            x={colX + colWidth / 2 - 12}
                            y={secY + secHeight - 18}
                            width={24}
                            height={10}
                            fill="#334155"
                            rx="1"
                          />
                        </g>
                      )}

                      {/* Drawers block if type === drawers */}
                      {sec.type === 'drawers' && !isDoorOpen && (
                        <g>
                          {[0, 1, 2].map((drwIdx) => {
                            const drwH = (secHeight - 6) / 3;
                            const drwY = secY + 3 + drwIdx * drwH;
                            return (
                              <g key={drwIdx} filter="url(#facadeShadow)">
                                <rect
                                  x={colX + 3}
                                  y={drwY + 1}
                                  width={colWidth - 6}
                                  height={drwH - 2}
                                  fill={themeStyles.facadeBg}
                                  stroke={themeStyles.facadeBorder}
                                  strokeWidth="1.2"
                                  rx="2"
                                />
                                {/* Drawer handle */}
                                {handlesType === 'gola' ? (
                                  <line
                                    x1={colX + 8}
                                    y1={drwY + 3}
                                    x2={colX + colWidth - 8}
                                    y2={drwY + 3}
                                    stroke="#171717"
                                    strokeWidth="1.5"
                                  />
                                ) : handlesType === 'minimal_knob' ? (
                                  <circle
                                    cx={colX + colWidth / 2}
                                    cy={drwY + drwH / 2}
                                    r="2.5"
                                    fill={themeStyles.handleColor}
                                  />
                                ) : (
                                  <rect
                                    x={colX + colWidth / 2 - 12}
                                    y={drwY + drwH / 2 - 1.2}
                                    width={24}
                                    height={2.5}
                                    fill={themeStyles.handleColor}
                                    rx="1"
                                  />
                                )}
                              </g>
                            );
                          })}
                        </g>
                      )}

                      {/* Wooden Door Facade */}
                      {sec.type === 'door_wood' && !isDoorOpen && (
                        <g filter="url(#facadeShadow)">
                          <rect
                            x={colX + 2.5}
                            y={secY + 2.5}
                            width={colWidth - 5}
                            height={secHeight - 5}
                            fill={themeStyles.facadeBg}
                            stroke={themeStyles.facadeBorder}
                            strokeWidth="1.2"
                            rx="2"
                          />
                          {/* Subtle door edge bevel highlight */}
                          <line
                            x1={colX + 4}
                            y1={secY + 4}
                            x2={colX + colWidth - 4}
                            y2={secY + 4}
                            stroke={themeStyles.accent}
                            strokeWidth="0.8"
                            opacity="0.4"
                          />

                          {/* Handle placement */}
                          {handlesType === 'gola' ? (
                            <line
                              x1={colX + colWidth - 3}
                              y1={secY + 6}
                              x2={colX + colWidth - 3}
                              y2={secY + secHeight - 6}
                              stroke="#000000"
                              strokeWidth="2"
                              opacity="0.6"
                            />
                          ) : handlesType === 'minimal_knob' ? (
                            <circle
                              cx={colX + colWidth - 8}
                              cy={secY + secHeight / 2}
                              r="3"
                              fill={themeStyles.handleColor}
                            />
                          ) : (
                            <rect
                              x={colX + colWidth - 8}
                              y={secY + secHeight / 2 - 14}
                              width={2.5}
                              height={28}
                              fill={themeStyles.handleColor}
                              rx="1"
                            />
                          )}
                        </g>
                      )}

                      {/* Mirror Door Facade */}
                      {sec.type === 'mirror' && !isDoorOpen && (
                        <g filter="url(#facadeShadow)">
                          <rect
                            x={colX + 2.5}
                            y={secY + 2.5}
                            width={colWidth - 5}
                            height={secHeight - 5}
                            fill="url(#mirrorGradient)"
                            stroke="#94a3b8"
                            strokeWidth="1.5"
                            rx="2"
                          />
                          {/* Diagonal mirror sheen reflections */}
                          <path
                            d={`M ${colX + 10} ${secY + secHeight - 10} L ${colX + colWidth - 10} ${secY + 10}`}
                            stroke="#ffffff"
                            strokeWidth="1.8"
                            opacity="0.6"
                            strokeDasharray="15 8"
                          />
                          <path
                            d={`M ${colX + 16} ${secY + secHeight - 8} L ${colX + colWidth - 8} ${secY + 16}`}
                            stroke="#ffffff"
                            strokeWidth="1"
                            opacity="0.4"
                            strokeDasharray="20 10"
                          />

                          {/* Subtle mirror handle */}
                          <circle
                            cx={colX + colWidth - 8}
                            cy={secY + secHeight / 2}
                            r="2.5"
                            fill="#64748b"
                          />
                        </g>
                      )}

                      {/* Glass Door Vitrina */}
                      {sec.type === 'door_glass' && !isDoorOpen && (
                        <g>
                          {/* Glass pane (semi-transparent so shelves show through) */}
                          <rect
                            x={colX + 2.5}
                            y={secY + 2.5}
                            width={colWidth - 5}
                            height={secHeight - 5}
                            fill="url(#glassGradient)"
                            stroke="#0f172a"
                            strokeWidth="2"
                            rx="2"
                            opacity="0.85"
                          />
                          {/* Aluminum thin frame */}
                          <rect
                            x={colX + 3.5}
                            y={secY + 3.5}
                            width={colWidth - 7}
                            height={secHeight - 7}
                            fill="none"
                            stroke="#334155"
                            strokeWidth="1"
                          />
                          {/* Glass diagonal highlight */}
                          <line
                            x1={colX + 8}
                            y1={secY + secHeight - 8}
                            x2={colX + colWidth - 8}
                            y2={secY + 8}
                            stroke="#94a3b8"
                            strokeWidth="1"
                            opacity="0.3"
                          />

                          {/* Vitrina vertical profile handle */}
                          <rect
                            x={colX + colWidth - 7}
                            y={secY + secHeight / 2 - 12}
                            width={1.8}
                            height={24}
                            fill="#0f172a"
                            rx="0.5"
                          />
                        </g>
                      )}

                      {/* Warm LED Strip Lighting (if enabled) */}
                      {sec.hasLed && (
                        <g filter="url(#ledGlow)">
                          <rect
                            x={colX + 4}
                            y={secY + 3}
                            width={colWidth - 8}
                            height={2}
                            fill="#fef08a"
                          />
                          <rect
                            x={colX + 4}
                            y={secY + 3}
                            width={colWidth - 8}
                            height={8}
                            fill="#fef08a"
                            opacity="0.25"
                          />
                        </g>
                      )}

                      {/* Interactive Selection Highlight */}
                      {isSelected ? (
                        <rect
                          x={colX + 1}
                          y={secY + 1}
                          width={colWidth - 2}
                          height={secHeight - 2}
                          fill="#f59e0b"
                          fillOpacity="0.15"
                          stroke="#f59e0b"
                          strokeWidth="2.5"
                          strokeDasharray="4 2"
                          rx="3"
                        />
                      ) : (
                        <rect
                          x={colX + 1}
                          y={secY + 1}
                          width={colWidth - 2}
                          height={secHeight - 2}
                          fill="transparent"
                          className="hover:stroke-amber-400 hover:stroke-[2] transition-colors"
                          rx="2"
                        />
                      )}

                      {/* Module Badge / Tooltip Label */}
                      <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <rect
                          x={colX + colWidth / 2 - 38}
                          y={secY + secHeight / 2 - 10}
                          width="76"
                          height="20"
                          rx="4"
                          fill="#09090b"
                          fillOpacity="0.9"
                          stroke="#f59e0b"
                          strokeWidth="1"
                        />
                        <text
                          x={colX + colWidth / 2}
                          y={secY + secHeight / 2 + 3}
                          textAnchor="middle"
                          fill="#fef08a"
                          fontSize="7.5"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                        >
                          ✎ O'zgartirish
                        </text>
                      </g>
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* 3. Architectural Dimension Markers (Width & Height) */}
          {showDimensions && (
            <g className="font-mono text-neutral-400 select-none">
              {/* Overall Top Width Line */}
              <line
                x1={originX}
                y1={originY - 18}
                x2={originX + wallWidth}
                y2={originY - 18}
                stroke="#737373"
                strokeWidth="1"
              />
              <line x1={originX} y1={originY - 24} x2={originX} y2={originY - 12} stroke="#737373" strokeWidth="1" />
              <line x1={originX + wallWidth} y1={originY - 24} x2={originX + wallWidth} y2={originY - 12} stroke="#737373" strokeWidth="1" />
              <rect
                x={originX + wallWidth / 2 - 28}
                y={originY - 27}
                width="56"
                height="16"
                rx="3"
                fill="#09090b"
                stroke="#525252"
                strokeWidth="0.8"
              />
              <text
                x={originX + wallWidth / 2}
                y={originY - 16}
                textAnchor="middle"
                fill="#f59e0b"
                fontSize="9"
                fontWeight="bold"
              >
                {wallWidth} sm
              </text>

              {/* Overall Right Height Line */}
              <line
                x1={originX + wallWidth + 18}
                y1={originY}
                x2={originX + wallWidth + 18}
                y2={originY + wallHeight}
                stroke="#737373"
                strokeWidth="1"
              />
              <line x1={originX + wallWidth + 12} y1={originY} x2={originX + wallWidth + 24} y2={originY} stroke="#737373" strokeWidth="1" />
              <line x1={originX + wallWidth + 12} y1={originY + wallHeight} x2={originX + wallWidth + 24} y2={originY + wallHeight} stroke="#737373" strokeWidth="1" />
              <rect
                x={originX + wallWidth + 24}
                y={originY + wallHeight / 2 - 10}
                width="48"
                height="18"
                rx="3"
                fill="#09090b"
                stroke="#525252"
                strokeWidth="0.8"
              />
              <text
                x={originX + wallWidth + 48}
                y={originY + wallHeight / 2 + 2}
                textAnchor="middle"
                fill="#f59e0b"
                fontSize="9"
                fontWeight="bold"
              >
                {wallHeight} sm
              </text>

              {/* Bottom Depth indicator */}
              <text
                x={originX + wallWidth / 2}
                y={originY + wallHeight + 20}
                textAnchor="middle"
                fill="#a3a3a3"
                fontSize="8"
              >
                Chuqurlik: <tspan fill="#f59e0b" fontWeight="bold">{depth} sm</tspan> • Tsokol balandligi: 8 sm
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* 3. Legend / Quick Keys */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-400 bg-neutral-950/60 p-3 rounded-xl border border-neutral-800/80">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-amber-400/80 inline-block border border-amber-300" />
            <span>Yopiq eshikli javoncha</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-sky-300/80 inline-block border border-sky-200" />
            <span>Ko'zgu / Oyna eshik</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-emerald-500/40 inline-block border border-emerald-400" />
            <span>Shisha vitrina</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-purple-500/40 inline-block border border-purple-400" />
            <span>Ochiq polkalar</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-orange-500/40 inline-block border border-orange-400" />
            <span>Tortmalar</span>
          </div>
        </div>

        <span className="text-[11px] text-amber-400/90 font-medium">
          Maslahat: Har bir katak ustiga bosib, joyiga nima qo'yishni o'zgartiring!
        </span>
      </div>
    </div>
  );
};
