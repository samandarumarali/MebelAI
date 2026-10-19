import React, { useState } from 'react';
import { FURNITURE_PRESETS, FurniturePreset } from '../utils/furniturePresets';
import { FurnitureConfig } from '../types/furniture';
import { calculateSmeta } from '../utils/smetaCalculator';
import { resolvePalette } from '../utils/themeColors';
import {
  LayoutGrid,
  Check,
  Maximize2,
  Sparkles,
  ArrowRight,
  Eye,
  Sliders,
  DollarSign,
  Palette,
} from 'lucide-react';

interface FurnitureCatalogProps {
  currentConfig: FurnitureConfig;
  onSelectPreset: (preset: FurniturePreset) => void;
  onOpenRoomSimulator: () => void;
}

export const FurnitureCatalog: React.FC<FurnitureCatalogProps> = ({
  currentConfig,
  onSelectPreset,
  onOpenRoomSimulator,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Barchasi (' + FURNITURE_PRESETS.length + ' ta)' },
    { id: 'bedroom', label: 'Yotoqxona & Garderob' },
    { id: 'living', label: 'Mehmonxona & TV Stenkalar' },
    { id: 'hallway', label: 'Dahliz & Prihojka' },
    { id: 'kitchen', label: 'Oshxona Garniturlari' },
    { id: 'office', label: 'Ish xonasi & Kutubxona' },
  ];

  const filteredPresets =
    selectedCategory === 'all'
      ? FURNITURE_PRESETS
      : FURNITURE_PRESETS.filter((p) => p.category === selectedCategory);

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-neutral-100 flex items-center gap-2">
              Namuna Mebel Modellari Katalogi
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-medium">
                {FURNITURE_PRESETS.length} ta tayyor dizayn
              </span>
            </h2>
            <p className="text-xs text-neutral-400">
              Istalgan namunani tanlang, ranglarini o'zingiz o'zgartiring va uy xonasiga joylashtiring
            </p>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === c.id
                  ? 'bg-amber-500 text-neutral-950 shadow-sm'
                  : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Furniture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredPresets.map((preset) => {
          const palette = resolvePalette(preset.config);
          const smeta = calculateSmeta(preset.config);
          const isCurrent =
            currentConfig.wallWidth === preset.config.wallWidth &&
            currentConfig.wallHeight === preset.config.wallHeight &&
            currentConfig.columns.length === preset.config.columns.length;

          return (
            <div
              key={preset.id}
              className={`group bg-neutral-950/80 border rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-amber-500/60 ${
                isCurrent ? 'border-amber-500 ring-1 ring-amber-500/40 bg-neutral-900/60' : 'border-neutral-800'
              }`}
            >
              <div className="space-y-3">
                {/* Visual Mockup Header */}
                <div className="relative w-full h-36 bg-gradient-to-b from-neutral-900 to-neutral-950 rounded-xl border border-neutral-850 p-3 flex items-center justify-center overflow-hidden">
                  {/* Badge */}
                  <span className="absolute top-2 left-2 z-10 text-[9px] px-2 py-0.5 rounded-md font-semibold bg-neutral-900/90 text-amber-300 border border-neutral-700 backdrop-blur-sm">
                    {preset.badge}
                  </span>

                  {/* Room Tag */}
                  <span className="absolute top-2 right-2 z-10 text-[9px] px-2 py-0.5 rounded-md font-medium bg-neutral-900/90 text-neutral-400 border border-neutral-800">
                    {preset.categoryLabel}
                  </span>

                  {/* Proportional Mini Furniture Visualizer */}
                  <div
                    className="h-28 rounded border-2 shadow-lg flex transition-transform group-hover:scale-105 duration-300"
                    style={{
                      width: `${Math.min(180, (preset.config.wallWidth / 300) * 140)}px`,
                      backgroundColor: palette.carcaseBg,
                      borderColor: palette.carcaseBorder,
                    }}
                  >
                    {preset.config.columns.map((col) => {
                      const totalSecs = col.sections.length;
                      return (
                        <div
                          key={col.id}
                          className="h-full flex-1 border-r border-neutral-700/50 last:border-r-0 flex flex-col"
                        >
                          {col.sections.map((sec) => (
                            <div
                              key={sec.id}
                              className="flex-1 border-b border-neutral-700/50 last:border-b-0 m-0.5 rounded-[1px] flex items-center justify-center relative overflow-hidden"
                              style={{
                                backgroundColor:
                                  sec.type === 'mirror'
                                    ? '#e2e8f0'
                                    : sec.type === 'door_glass'
                                    ? palette.glassColor
                                    : palette.facadeBg,
                              }}
                            >
                              {sec.type === 'mirror' && (
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent" />
                              )}
                              {sec.type === 'door_wood' && (
                                <div
                                  className="w-0.5 h-3 rounded-full absolute right-1"
                                  style={{ backgroundColor: palette.handleColor }}
                                />
                              )}
                              {sec.type === 'drawers' && (
                                <div className="w-full h-full flex flex-col justify-around p-0.5">
                                  <div className="h-0.5 bg-neutral-600 rounded" />
                                  <div className="h-0.5 bg-neutral-600 rounded" />
                                </div>
                              )}
                              {sec.type === 'tv_niche' && (
                                <div className="w-4/5 h-3/5 bg-neutral-950 rounded-[1px]" />
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Details */}
                <div>
                  <h3 className="text-sm font-bold text-neutral-100 group-hover:text-amber-400 transition-colors">
                    {preset.nameUz}
                  </h3>
                  <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2">
                    {preset.descriptionUz}
                  </p>
                </div>

                {/* Dimensions & Color tags */}
                <div className="flex items-center justify-between text-[11px] border-t border-neutral-850 pt-2 text-neutral-400">
                  <span className="font-mono text-neutral-300">{preset.dimensions}</span>
                  <div className="flex items-center gap-1">
                    <span
                      className="w-3 h-3 rounded-full border border-neutral-700"
                      style={{ backgroundColor: palette.facadeBg }}
                      title="Fasad"
                    />
                    <span
                      className="w-3 h-3 rounded-full border border-neutral-700 -ml-1.5"
                      style={{ backgroundColor: palette.carcaseBg }}
                      title="Karkas"
                    />
                  </div>
                </div>

                {/* Estimated Price */}
                <div className="bg-neutral-900/90 p-2.5 rounded-xl border border-neutral-800 flex items-center justify-between">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                    Taxminiy narxi:
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {smeta.grandTotal.toLocaleString()} so'm
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={() => onSelectPreset(preset)}
                  className={`flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isCurrent
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
                  }`}
                >
                  {isCurrent ? <Check className="w-3.5 h-3.5" /> : <Sliders className="w-3.5 h-3.5" />}
                  <span>{isCurrent ? 'Tanlangan' : 'Tanlash'}</span>
                </button>

                <button
                  onClick={() => {
                    onSelectPreset(preset);
                    onOpenRoomSimulator();
                  }}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs transition-colors shadow"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Xonada ko'rish</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
