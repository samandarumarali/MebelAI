import React, { useState, useRef } from 'react';
import { FurnitureConfig } from '../types/furniture';
import { resolvePalette } from '../utils/themeColors';
import {
  Home,
  Maximize,
  Sun,
  Moon,
  Sparkles,
  Sliders,
  Ruler,
  Eye,
  EyeOff,
  Download,
  Camera,
  Layers,
  CheckCircle2,
  Compass,
} from 'lucide-react';

interface RoomPlacementSimulatorProps {
  config: FurnitureConfig;
  onOpenConstructor: () => void;
}

interface RoomScene {
  id: string;
  nameUz: string;
  category: string;
  imageSrc: string;
  wallXPercent: number; // default horizontal center
  wallYPercent: number; // default vertical baseline (floor contact)
  defaultScale: number;
  wallDescUz: string;
}

const ROOM_SCENES: RoomScene[] = [
  {
    id: 'living',
    nameUz: 'Mehmonxona (Zal)',
    category: 'Mehmonxona',
    imageSrc: '/src/assets/images/room_living_modern_1790228559884.jpg',
    wallXPercent: 50,
    wallYPercent: 82,
    defaultScale: 1,
    wallDescUz: 'Yog\'och parketli, keng derazali va baland shiftli zamonaviy xona',
  },
  {
    id: 'bedroom',
    nameUz: 'Yotoqxona',
    category: 'Yotoqxona',
    imageSrc: '/src/assets/images/room_bedroom_luxury_1790228576183.jpg',
    wallXPercent: 50,
    wallYPercent: 84,
    defaultScale: 1.05,
    wallDescUz: 'Shinam gilam va iliq fon yoritgichli lyuks yotoqxona devori',
  },
  {
    id: 'hallway',
    nameUz: 'Dahliz (Prihojka)',
    category: 'Dahliz',
    imageSrc: '/src/assets/images/room_hallway_entry_1790228589692.jpg',
    wallXPercent: 50,
    wallYPercent: 82,
    defaultScale: 0.95,
    wallDescUz: 'Marmar polli va shipli yoritishga ega keng dahliz yo\'lagi',
  },
  {
    id: 'kitchen',
    nameUz: 'Oshxona & Oshxona zali',
    category: 'Oshxona',
    imageSrc: '/src/assets/images/room_kitchen_dining_1790228604163.jpg',
    wallXPercent: 50,
    wallYPercent: 84,
    defaultScale: 1,
    wallDescUz: 'Zamonaviy oshxona garnituri uchun tayyorlangan toza devor',
  },
  {
    id: 'studio',
    nameUz: 'Skandinavcha Studio',
    category: 'Studio',
    imageSrc: '/src/assets/images/room_studio_apartment_1790228620164.jpg',
    wallXPercent: 50,
    wallYPercent: 83,
    defaultScale: 0.98,
    wallDescUz: 'Ochiq rangli tabiiy yog\'och polli ixcham shinam xona',
  },
];

export const RoomPlacementSimulator: React.FC<RoomPlacementSimulatorProps> = ({
  config,
  onOpenConstructor,
}) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string>('living');
  const [furnitureXOffset, setFurnitureXOffset] = useState<number>(0); // -40% to +40%
  const [scaleMultiplier, setScaleMultiplier] = useState<number>(1); // 0.7 to 1.3
  const [lightingMode, setLightingMode] = useState<'day' | 'warm_evening' | 'neon_led'>('day');
  const [showRuler, setShowRuler] = useState<boolean>(true);
  const [doorsOpen, setDoorsOpen] = useState<boolean>(false);
  const [isAiRendering, setIsAiRendering] = useState<boolean>(false);
  const [aiRenderResult, setAiRenderResult] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const activeRoom = ROOM_SCENES.find((r) => r.id === selectedRoomId) || ROOM_SCENES[0];
  const palette = resolvePalette(config);

  const { wallWidth, wallHeight, depth, columns } = config;

  // Base sizing calculation: proportional to real cm
  // Normalize 300cm to around 420px width on standard display
  const basePixelWidth = Math.min(560, Math.max(260, (wallWidth / 300) * 440 * scaleMultiplier));
  const basePixelHeight = Math.min(420, Math.max(200, (wallHeight / 250) * 320 * scaleMultiplier));

  // Lighting filters applied over the furniture
  const lightingStyles = {
    day: {
      filter: 'brightness(1.02) contrast(1.02)',
      shadowColor: 'rgba(0, 0, 0, 0.45)',
    },
    warm_evening: {
      filter: 'sepia(0.18) brightness(0.92) contrast(1.05)',
      shadowColor: 'rgba(35, 20, 10, 0.65)',
    },
    neon_led: {
      filter: 'brightness(1.08) drop-shadow(0 0 15px rgba(245, 158, 11, 0.35))',
      shadowColor: 'rgba(0, 0, 0, 0.6)',
    },
  };

  const handleCaptureSnapshot = () => {
    window.print();
  };

  const handleGenerateAiRoomRender = async () => {
    setIsAiRendering(true);
    try {
      const res = await fetch('/api/ai/render-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          furnitureConfig: config,
          roomType: activeRoom.nameUz,
        }),
      });

      const data = await res.json();
      if (data.imageUrl) {
        setAiRenderResult(data.imageUrl);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiRendering(false);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-neutral-950 font-black shadow-lg shadow-amber-500/20">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-neutral-100 flex items-center gap-2">
              Xonada Joylashtirish va Namoyish (Interyer Simulyatori)
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-medium">
                Real masshtab
              </span>
            </h2>
            <p className="text-xs text-neutral-400">
              Tanlangan mebelingizni haqiqiy uy xonasida joylashtirib ko'ring, suring va o'lchamlarini tekshiring
            </p>
          </div>
        </div>

        {/* Room selector buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {ROOM_SCENES.map((scene) => (
            <button
              key={scene.id}
              onClick={() => {
                setSelectedRoomId(scene.id);
                setAiRenderResult(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedRoomId === scene.id
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {scene.nameUz}
            </button>
          ))}
        </div>
      </div>

      {/* Simulator Control Bar */}
      <div className="bg-neutral-950/90 border border-neutral-800 rounded-xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Position Slider */}
        <div className="flex items-center gap-2.5 min-w-[200px]">
          <span className="text-xs font-medium text-neutral-400 whitespace-nowrap">
            Devorda joylashuvi:
          </span>
          <input
            type="range"
            min="-35"
            max="35"
            step="1"
            value={furnitureXOffset}
            onChange={(e) => setFurnitureXOffset(Number(e.target.value))}
            className="w-28 sm:w-36 accent-amber-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
          />
          <button
            onClick={() => setFurnitureXOffset(0)}
            className="text-[10px] text-neutral-500 hover:text-amber-400"
            title="Markazga qo'yish"
          >
            Markaz
          </button>
        </div>

        {/* Scale Slider */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-medium text-neutral-400 whitespace-nowrap">Masshtab:</span>
          <button
            onClick={() => setScaleMultiplier(Math.max(0.75, scaleMultiplier - 0.1))}
            className="w-6 h-6 rounded bg-neutral-800 text-neutral-300 flex items-center justify-center text-xs hover:bg-neutral-700"
          >
            -
          </button>
          <span className="text-xs font-mono font-bold text-amber-400 min-w-[40px] text-center">
            {Math.round(scaleMultiplier * 100)}%
          </span>
          <button
            onClick={() => setScaleMultiplier(Math.min(1.3, scaleMultiplier + 0.1))}
            className="w-6 h-6 rounded bg-neutral-800 text-neutral-300 flex items-center justify-center text-xs hover:bg-neutral-700"
          >
            +
          </button>
        </div>

        {/* Lighting Atmosphere */}
        <div className="flex items-center gap-1.5 bg-neutral-900 p-1 rounded-xl border border-neutral-800 text-xs">
          <button
            onClick={() => setLightingMode('day')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
              lightingMode === 'day' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kunduzgi</span>
          </button>
          <button
            onClick={() => setLightingMode('warm_evening')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
              lightingMode === 'warm_evening'
                ? 'bg-amber-500 text-neutral-950 font-bold'
                : 'text-neutral-400'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kechki</span>
          </button>
          <button
            onClick={() => setLightingMode('neon_led')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
              lightingMode === 'neon_led'
                ? 'bg-amber-500 text-neutral-950 font-bold'
                : 'text-neutral-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">LED nur</span>
          </button>
        </div>

        {/* Toggles: Ruler & Doors */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRuler(!showRuler)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs transition-colors ${
              showRuler
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-neutral-900 text-neutral-400 border-neutral-800'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ruletka</span>
          </button>

          <button
            onClick={() => setDoorsOpen(!doorsOpen)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs transition-colors ${
              doorsOpen
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-neutral-900 text-neutral-400 border-neutral-800'
            }`}
          >
            {doorsOpen ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{doorsOpen ? 'Eshikni yopish' : 'Eshikni ochish'}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage Container */}
      <div
        ref={containerRef}
        className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[580px] rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl select-none flex items-center justify-center bg-neutral-950"
      >
        {/* Room Photorealistic Background Image */}
        <img
          src={activeRoom.imageSrc}
          alt={activeRoom.nameUz}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 pointer-events-none"
        />

        {/* Atmospheric lighting overlay depending on mode */}
        <div
          className="absolute inset-0 pointer-events-none transition-colors duration-500"
          style={{
            backgroundColor:
              lightingMode === 'warm_evening'
                ? 'rgba(180, 83, 9, 0.12)'
                : lightingMode === 'neon_led'
                ? 'rgba(15, 23, 42, 0.22)'
                : 'transparent',
          }}
        />

        {/* Realistic Floor Ambient Shadow for the Furniture */}
        <div
          className="absolute transition-all duration-300 pointer-events-none"
          style={{
            bottom: '12%',
            left: `calc(50% + ${furnitureXOffset}%)`,
            transform: 'translateX(-50%)',
            width: `${basePixelWidth * 1.08}px`,
            height: '24px',
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 70%)',
            filter: 'blur(6px)',
          }}
        />

        {/* Simulated Wall Drop Shadow */}
        <div
          className="absolute transition-all duration-300 pointer-events-none"
          style={{
            bottom: '14%',
            left: `calc(50% + ${furnitureXOffset}% + 10px)`,
            transform: 'translateX(-50%)',
            width: `${basePixelWidth}px`,
            height: `${basePixelHeight}px`,
            backgroundColor: 'rgba(0,0,0,0.3)',
            filter: 'blur(16px)',
          }}
        />

        {/* Furniture Model placed against the wall */}
        <div
          className="absolute transition-all duration-300 rounded-sm overflow-hidden flex flex-col"
          style={{
            bottom: '14%',
            left: `calc(50% + ${furnitureXOffset}%)`,
            transform: 'translateX(-50%)',
            width: `${basePixelWidth}px`,
            height: `${basePixelHeight}px`,
            backgroundColor: palette.carcaseBg,
            borderColor: palette.carcaseBorder,
            borderWidth: '3px',
            borderStyle: 'solid',
            boxShadow: `0 20px 40px ${lightingStyles[lightingMode].shadowColor}, inset 0 2px 4px rgba(255,255,255,0.15)`,
            filter: lightingStyles[lightingMode].filter,
          }}
        >
          {/* Columns & Sections layout inside room */}
          <div className="w-full h-full flex">
            {columns.map((col) => {
              const colRatio = col.widthRatio || 1;
              const totalColRatios = columns.reduce((acc, c) => acc + (c.widthRatio || 1), 0);
              const colWidthPercent = (colRatio / totalColRatios) * 100;
              const totalRatios = col.sections.reduce((acc, s) => acc + (s.heightRatio || 1), 0);

              return (
                <div
                  key={col.id}
                  className="h-full flex flex-col border-r border-neutral-700/50 last:border-r-0 relative"
                  style={{ width: `${colWidthPercent}%` }}
                >
                  {col.sections.map((sec) => {
                    const secHeightPercent = (sec.heightRatio / totalRatios) * 100;

                    return (
                      <div
                        key={sec.id}
                        className="relative border-b border-neutral-700/50 last:border-b-0 overflow-hidden flex flex-col justify-center items-center"
                        style={{
                          height: `${secHeightPercent}%`,
                          backgroundColor:
                            sec.type === 'mirror'
                              ? '#cbd5e1'
                              : sec.type === 'door_glass'
                              ? palette.glassColor
                              : palette.carcaseBg,
                        }}
                      >
                        {/* Door Facade layer */}
                        {sec.type === 'door_wood' && (
                          <div
                            className="absolute inset-0.5 border rounded-sm transition-transform duration-500 flex items-center justify-end pr-1.5 shadow"
                            style={{
                              backgroundColor: palette.facadeBg,
                              borderColor: palette.facadeBorder,
                              transform: doorsOpen ? 'translateX(70%) scaleX(0.2)' : 'none',
                              opacity: doorsOpen ? 0.3 : 1,
                            }}
                          >
                            {/* Handle */}
                            <div
                              className="w-1 rounded-full shadow-sm"
                              style={{
                                height: '24px',
                                backgroundColor: palette.handleColor,
                              }}
                            />
                          </div>
                        )}

                        {/* Mirror Door */}
                        {sec.type === 'mirror' && (
                          <div
                            className="absolute inset-0.5 border border-slate-300 rounded-sm bg-gradient-to-tr from-slate-200 via-white to-slate-300 transition-transform duration-500 shadow flex items-center justify-end pr-1.5"
                            style={{
                              transform: doorsOpen ? 'translateX(70%) scaleX(0.2)' : 'none',
                              opacity: doorsOpen ? 0.3 : 1,
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/70 to-transparent pointer-events-none" />
                            <div
                              className="w-1 rounded-full shadow-sm"
                              style={{
                                height: '24px',
                                backgroundColor: palette.handleColor,
                              }}
                            />
                          </div>
                        )}

                        {/* Glass Vitrina */}
                        {sec.type === 'door_glass' && (
                          <div
                            className="absolute inset-0.5 border border-neutral-600 rounded-sm transition-all flex flex-col justify-around p-1 shadow-inner"
                            style={{
                              backgroundColor: palette.glassColor,
                              opacity: palette.glassOpacity,
                            }}
                          >
                            <div className="w-full h-0.5 bg-neutral-500/50" />
                            <div className="w-full h-0.5 bg-neutral-500/50" />
                          </div>
                        )}

                        {/* Drawers */}
                        {sec.type === 'drawers' && (
                          <div className="w-full h-full flex flex-col p-0.5 gap-0.5">
                            {[0, 1, 2].map((d) => (
                              <div
                                key={d}
                                className="flex-1 rounded-sm border flex items-center justify-center shadow-inner"
                                style={{
                                  backgroundColor: palette.facadeBg,
                                  borderColor: palette.facadeBorder,
                                }}
                              >
                                <div
                                  className="w-5 h-0.5 rounded shadow-sm"
                                  style={{ backgroundColor: palette.handleColor }}
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* TV Niche */}
                        {sec.type === 'tv_niche' && (
                          <div className="w-4/5 h-3/4 bg-neutral-950 rounded border border-neutral-800 flex items-center justify-center shadow-md">
                            <span className="text-[8px] font-bold text-neutral-500 tracking-wider">
                              SMART TV
                            </span>
                          </div>
                        )}

                        {/* Clothes rail */}
                        {sec.type === 'clothes_rail' && (
                          <div className="w-full h-full p-2 flex flex-col items-center justify-center">
                            <div className="w-full h-1 bg-neutral-300 rounded shadow-sm mb-1" />
                            <span className="text-[8px] text-neutral-400">Garderob</span>
                          </div>
                        )}

                        {/* Open Shelf */}
                        {sec.type === 'open_shelf' && (
                          <div className="w-full h-full flex flex-col justify-around p-1">
                            <div className="w-full h-0.5 bg-neutral-600/70" />
                            <div className="w-full h-0.5 bg-neutral-600/70" />
                          </div>
                        )}

                        {/* LED glow if configured */}
                        {sec.hasLed && (
                          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-300 shadow-[0_0_10px_#fde047]" />
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Dimension Tape Ruler Overlay on wall */}
          {showRuler && (
            <>
              {/* Width label (Top) */}
              <div className="absolute -top-7 left-0 right-0 flex items-center justify-center pointer-events-none">
                <div className="bg-neutral-950/90 text-amber-400 border border-amber-500/50 px-2 py-0.5 rounded text-[11px] font-mono font-bold shadow-lg flex items-center gap-1">
                  <span>Eni: {wallWidth} sm</span>
                </div>
              </div>

              {/* Height label (Right side) */}
              <div className="absolute -right-16 top-0 bottom-0 flex items-center pointer-events-none">
                <div className="bg-neutral-950/90 text-amber-400 border border-amber-500/50 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold shadow-lg rotate-90 origin-left">
                  Bo'yi: {wallHeight} sm
                </div>
              </div>
            </>
          )}
        </div>

        {/* AI Render Result Overlay if available */}
        {aiRenderResult && (
          <div className="absolute inset-0 z-20 bg-neutral-950/95 p-4 flex flex-col items-center justify-center animate-in fade-in">
            <div className="relative max-w-full max-h-full rounded-xl overflow-hidden border border-neutral-700 shadow-2xl">
              <img
                src={aiRenderResult}
                alt="AI Generated Room Interior"
                referrerPolicy="no-referrer"
                className="max-h-[500px] w-auto object-contain"
              />
              <button
                onClick={() => setAiRenderResult(null)}
                className="absolute top-3 right-3 bg-neutral-900/80 hover:bg-neutral-900 text-white px-3 py-1 rounded-lg text-xs font-bold border border-neutral-700"
              >
                ✕ Yopish
              </button>
            </div>
            <p className="text-xs text-neutral-400 mt-2">
              Gemini AI tomonidan {activeRoom.nameUz} xonasida fotorealistik interyer tasviri yaratildi
            </p>
          </div>
        )}
      </div>

      {/* Footer Actions: Dimensions, Room description & Export */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-2 text-xs text-neutral-300">
          <span className="font-semibold text-amber-400">Xona haqida:</span>
          <span>{activeRoom.wallDescUz}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* AI Render button */}
          <button
            onClick={handleGenerateAiRoomRender}
            disabled={isAiRendering}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-neutral-950 rounded-xl shadow-lg shadow-amber-500/10 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAiRendering ? 'Render qilinmoqda...' : 'AI Fotorealistik Xona Renderi'}</span>
          </button>

          {/* Snapshot / Print */}
          <button
            onClick={handleCaptureSnapshot}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded-xl transition-colors"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Skrinshot / Chop etish</span>
          </button>
        </div>
      </div>
    </div>
  );
};
