import React from 'react';
import { FurnitureConfig, ColorTheme, GlassColor, HandleColor } from '../types/furniture';
import { COLOR_PRESETS, GLASS_PRESETS, HANDLE_PRESETS, resolvePalette } from '../utils/themeColors';
import { Palette, Check, Sparkles, SlidersHorizontal, RefreshCw } from 'lucide-react';

interface ColorStudioProps {
  config: FurnitureConfig;
  onChange: (updated: FurnitureConfig) => void;
}

export const ColorStudio: React.FC<ColorStudioProps> = ({ config, onChange }) => {
  const palette = resolvePalette(config);

  const handleSelectTheme = (themeId: ColorTheme) => {
    const preset = COLOR_PRESETS.find((p) => p.id === themeId);
    if (preset) {
      onChange({
        ...config,
        colorTheme: themeId,
        customFacadeColor: preset.facadeHex,
        customCarcaseColor: preset.carcaseHex,
      });
    } else {
      onChange({
        ...config,
        colorTheme: themeId,
      });
    }
  };

  const handleCustomFacade = (hex: string) => {
    onChange({
      ...config,
      colorTheme: 'custom',
      customFacadeColor: hex,
    });
  };

  const handleCustomCarcase = (hex: string) => {
    onChange({
      ...config,
      colorTheme: 'custom',
      customCarcaseColor: hex,
    });
  };

  const handleGlassColor = (glassId: GlassColor) => {
    onChange({
      ...config,
      customGlassColor: glassId,
    });
  };

  const handleHandleColor = (handleId: HandleColor) => {
    onChange({
      ...config,
      customHandleColor: handleId,
    });
  };

  const handleResetColors = () => {
    onChange({
      ...config,
      colorTheme: 'cashmere',
      customFacadeColor: undefined,
      customCarcaseColor: undefined,
      customGlassColor: 'bronze',
      customHandleColor: 'black',
    });
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-100 uppercase tracking-wider flex items-center gap-2">
              Mebel Rang va Teksturalar Studiyasi
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium normal-case">
                Jonli almashtirish
              </span>
            </h3>
            <p className="text-xs text-neutral-400">
              Har bir mebelning fasad, karkas, oyna va tutqich ranglarini erkin o'zingiz tanlang
            </p>
          </div>
        </div>

        {/* Live Swatch Preview & Reset */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-950 rounded-xl border border-neutral-800">
            <span className="text-[11px] text-neutral-400">Tanlangan:</span>
            <div
              className="w-5 h-5 rounded-full border border-neutral-600 shadow-sm"
              style={{ backgroundColor: palette.facadeBg }}
              title="Fasad rangi"
            />
            <div
              className="w-5 h-5 rounded-full border border-neutral-600 shadow-sm -ml-2"
              style={{ backgroundColor: palette.carcaseBg }}
              title="Karkas rangi"
            />
            <div
              className="w-4 h-4 rounded-full border border-neutral-600 shadow-sm -ml-2"
              style={{ backgroundColor: palette.handleColor }}
              title="Tutqich rangi"
            />
          </div>

          <button
            onClick={handleResetColors}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-neutral-400 hover:text-white bg-neutral-950 border border-neutral-800 hover:border-neutral-700 rounded-xl transition-colors"
            title="Dastlabki holatga qaytarish"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Qaytarish</span>
          </button>
        </div>
      </div>

      {/* 1. Popular Finish Color Themes */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-neutral-300 block">
          1. Ommabop Ranglar To'plami:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {COLOR_PRESETS.map((preset) => {
            const isSelected =
              config.colorTheme === preset.id ||
              (!config.customFacadeColor && config.colorTheme === preset.id);

            return (
              <button
                key={preset.id}
                onClick={() => handleSelectTheme(preset.id)}
                className={`flex flex-col text-left p-2.5 rounded-xl border transition-all text-xs relative ${
                  isSelected
                    ? 'bg-neutral-800/90 border-amber-500 shadow-lg shadow-amber-500/10'
                    : 'bg-neutral-950/70 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span
                      className="w-6 h-6 rounded-lg border border-black/30 shadow-inner"
                      style={{ backgroundColor: preset.facadeHex }}
                    />
                    <span
                      className="w-6 h-6 rounded-lg border border-black/30 shadow-inner -ml-2"
                      style={{ backgroundColor: preset.carcaseHex }}
                    />
                  </div>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>

                <span className="font-semibold text-neutral-200 line-clamp-1">
                  {preset.nameUz}
                </span>
                <span className="text-[10px] text-neutral-500 mt-0.5 line-clamp-1">
                  {preset.descUz}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Detailed Fine-Tuning: Facade & Carcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {/* Facade Color Picker */}
        <div className="bg-neutral-950/80 p-4 rounded-xl border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-neutral-200 block">
                Fasad Rangi (Eshiklar va Tortmalar)
              </span>
              <span className="text-[11px] text-neutral-400">
                Mebelning asosiy tashqi ko'rinishi
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={palette.facadeBg}
                onChange={(e) => handleCustomFacade(e.target.value)}
                className="w-8 h-8 rounded-lg border border-neutral-700 cursor-pointer bg-transparent"
                title="Erkin rang tanlash"
              />
              <span className="text-xs font-mono font-bold text-amber-400">
                {palette.facadeBg.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Quick Swatches for Facade */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { hex: '#fafafa', name: 'Oq Mat' },
              { hex: '#eae5dd', name: 'Kashmir' },
              { hex: '#d8c2a7', name: 'Sonoma Eman' },
              { hex: '#5c402d', name: 'Yong\'oq' },
              { hex: '#282a2e', name: 'Antratsit' },
              { hex: '#133527', name: 'Zumrad' },
              { hex: '#1e293b', name: 'Moviy' },
              { hex: '#4a3b32', name: 'Qahva' },
            ].map((c) => (
              <button
                key={c.hex}
                onClick={() => handleCustomFacade(c.hex)}
                className="w-7 h-7 rounded-lg border border-neutral-700 shadow transition-transform hover:scale-110 active:scale-95 flex items-center justify-center"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              >
                {palette.facadeBg.toLowerCase() === c.hex.toLowerCase() && (
                  <Check
                    className={`w-3.5 h-3.5 ${
                      c.hex === '#fafafa' ? 'text-black' : 'text-white'
                    }`}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Carcase Color Picker */}
        <div className="bg-neutral-950/80 p-4 rounded-xl border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-neutral-200 block">
                Karkas Rangi (Korpus & Ichki tokchalar)
              </span>
              <span className="text-[11px] text-neutral-400">
                Kontrast kombinatsiya yaratish mumkin
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={palette.carcaseBg}
                onChange={(e) => handleCustomCarcase(e.target.value)}
                className="w-8 h-8 rounded-lg border border-neutral-700 cursor-pointer bg-transparent"
                title="Erkin karkas rangi"
              />
              <span className="text-xs font-mono font-bold text-amber-400">
                {palette.carcaseBg.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Quick Swatches for Carcase */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { hex: '#ebebeb', name: 'Oq/Kulrang' },
              { hex: '#2b2927', name: 'Qora grafit' },
              { hex: '#bfa07d', name: 'Eman korpus' },
              { hex: '#3b281c', name: 'To\'q daraxt' },
              { hex: '#141414', name: 'Chuqur qora' },
              { hex: '#dcd6cd', name: 'Kashmir krem' },
              { hex: '#0f172a', name: 'Tungi to\'q' },
            ].map((c) => (
              <button
                key={c.hex}
                onClick={() => handleCustomCarcase(c.hex)}
                className="w-7 h-7 rounded-lg border border-neutral-700 shadow transition-transform hover:scale-110 active:scale-95 flex items-center justify-center"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              >
                {palette.carcaseBg.toLowerCase() === c.hex.toLowerCase() && (
                  <Check
                    className={`w-3.5 h-3.5 ${
                      c.hex === '#ebebeb' ? 'text-black' : 'text-white'
                    }`}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Glass & Hardware Customization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Glass Tint */}
        <div className="bg-neutral-950/80 p-3.5 rounded-xl border border-neutral-800 space-y-2">
          <label className="text-xs font-semibold text-neutral-300 block">
            Vitrina Shisha Rangi:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {GLASS_PRESETS.map((g) => {
              const isSelected = (config.customGlassColor || 'bronze') === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => handleGlassColor(g.id)}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-xs text-left transition-colors ${
                    isSelected
                      ? 'bg-neutral-800 border-amber-500 text-neutral-100 font-semibold'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-md border border-neutral-600 shadow"
                    style={{ backgroundColor: g.color }}
                  />
                  <span className="truncate">{g.nameUz}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Handle / Profile Color */}
        <div className="bg-neutral-950/80 p-3.5 rounded-xl border border-neutral-800 space-y-2">
          <label className="text-xs font-semibold text-neutral-300 block">
            Tutqich & Profil Rangi:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {HANDLE_PRESETS.map((h) => {
              const isSelected = (config.customHandleColor || 'black') === h.id;
              return (
                <button
                  key={h.id}
                  onClick={() => handleHandleColor(h.id)}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-xs text-left transition-colors ${
                    isSelected
                      ? 'bg-neutral-800 border-amber-500 text-neutral-100 font-semibold'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-neutral-600 shadow"
                    style={{ backgroundColor: h.hex }}
                  />
                  <span className="truncate">{h.nameUz.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
