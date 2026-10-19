import React from 'react';
import {
  FurnitureConfig,
  CarcaseMaterial,
  FacadeMaterial,
  ColorTheme,
  HardwareGrade,
  HandlesType,
  RoomType,
} from '../types/furniture';
import {
  Layers,
  Sparkles,
  Sliders,
  Maximize2,
  Columns as ColumnsIcon,
  Plus,
  Trash2,
} from 'lucide-react';

interface DimensionInputsProps {
  config: FurnitureConfig;
  onChange: (updated: FurnitureConfig) => void;
  onAddColumn: () => void;
  onRemoveColumn: (colIndex: number) => void;
}

export const DimensionInputs: React.FC<DimensionInputsProps> = ({
  config,
  onChange,
  onAddColumn,
  onRemoveColumn,
}) => {
  const updateField = <K extends keyof FurnitureConfig>(key: K, value: FurnitureConfig[K]) => {
    onChange({
      ...config,
      [key]: value,
    });
  };

  return (
    <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-5 shadow-xl space-y-6">
      {/* 1. Header with Room Category */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800/80 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Maximize2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-neutral-100">1. Devor va Joy O'lchamlari</h2>
            <p className="text-xs text-neutral-400">Santimetrda (sm) kiriting, mebel avtomatik moslashadi</p>
          </div>
        </div>

        {/* Room select */}
        <div className="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
          {(
            [
              { id: 'bedroom', label: 'Yotoqxona' },
              { id: 'living', label: 'Mehmonxona' },
              { id: 'hallway', label: 'Dahliz' },
              { id: 'office', label: 'Ish xonasi' },
              { id: 'kitchen', label: 'Oshxona' },
            ] as const
          ).map((room) => (
            <button
              key={room.id}
              onClick={() => updateField('roomType', room.id)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                config.roomType === room.id
                  ? 'bg-amber-500 text-neutral-950 font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
              }`}
            >
              {room.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Numeric Dimension Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Wall Width */}
        <div className="bg-neutral-950/80 p-3.5 rounded-xl border border-neutral-800 focus-within:border-amber-500/50 transition-colors">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-medium text-neutral-300">Devor Eni (Kengligi)</label>
            <span className="text-xs font-mono font-bold text-amber-400">{config.wallWidth} sm</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="100"
              max="500"
              step="5"
              value={config.wallWidth}
              onChange={(e) => updateField('wallWidth', Number(e.target.value))}
              className="w-full accent-amber-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
            />
            <input
              type="number"
              min="80"
              max="600"
              value={config.wallWidth}
              onChange={(e) => updateField('wallWidth', Math.max(80, Number(e.target.value) || 100))}
              className="w-16 px-2 py-1 text-xs bg-neutral-900 border border-neutral-700 rounded text-center font-mono font-bold text-neutral-100"
            />
          </div>
          <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
            <span>Min: 1.0 m</span>
            <span>Standart: 2.8 - 3.4 m</span>
            <span>Max: 5.0 m</span>
          </div>
        </div>

        {/* Wall Height */}
        <div className="bg-neutral-950/80 p-3.5 rounded-xl border border-neutral-800 focus-within:border-amber-500/50 transition-colors">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-medium text-neutral-300">Devor Bo'yi (Balandligi)</label>
            <span className="text-xs font-mono font-bold text-amber-400">{config.wallHeight} sm</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="160"
              max="320"
              step="5"
              value={config.wallHeight}
              onChange={(e) => updateField('wallHeight', Number(e.target.value))}
              className="w-full accent-amber-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
            />
            <input
              type="number"
              min="120"
              max="360"
              value={config.wallHeight}
              onChange={(e) => updateField('wallHeight', Math.max(120, Number(e.target.value) || 160))}
              className="w-16 px-2 py-1 text-xs bg-neutral-900 border border-neutral-700 rounded text-center font-mono font-bold text-neutral-100"
            />
          </div>
          <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
            <span>Standart shift: 2.4 - 2.8 m</span>
            <span>Shiftgacha (Antresol)</span>
          </div>
        </div>

        {/* Depth */}
        <div className="bg-neutral-950/80 p-3.5 rounded-xl border border-neutral-800 focus-within:border-amber-500/50 transition-colors">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-medium text-neutral-300">Mebel Chuqurligi</label>
            <span className="text-xs font-mono font-bold text-amber-400">{config.depth} sm</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="35"
              max="75"
              step="5"
              value={config.depth}
              onChange={(e) => updateField('depth', Number(e.target.value))}
              className="w-full accent-amber-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
            />
            <input
              type="number"
              min="30"
              max="80"
              value={config.depth}
              onChange={(e) => updateField('depth', Math.max(30, Number(e.target.value) || 45))}
              className="w-16 px-2 py-1 text-xs bg-neutral-900 border border-neutral-700 rounded text-center font-mono font-bold text-neutral-100"
            />
          </div>
          <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
            <span>40-45 sm: TV / Dahliz</span>
            <span>60 sm: Shkaf / Garderob</span>
          </div>
        </div>
      </div>

      {/* 3. Columns Manager */}
      <div className="bg-neutral-950/60 p-3.5 rounded-xl border border-neutral-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ColumnsIcon className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold text-neutral-200">
            Bo'limlar (Ustunlar) soni: <span className="text-amber-400">{config.columns.length} ta</span>
          </span>
          <span className="text-[11px] text-neutral-400">
            (Har bir ustun kengligi: ~{Math.round(config.wallWidth / Math.max(1, config.columns.length))} sm)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {config.columns.length < 6 && (
            <button
              onClick={onAddColumn}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Ustun qo'shish
            </button>
          )}

          {config.columns.length > 1 && (
            <button
              onClick={() => onRemoveColumn(config.columns.length - 1)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors"
              title="Oxirgi ustunni o'chirish"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 4. Materials & Finishing Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
        {/* Carcase Material */}
        <div>
          <label className="block text-[11px] font-medium text-neutral-400 mb-1.5">
            Ichki Karkas (Plita turi)
          </label>
          <select
            value={config.carcaseMaterial}
            onChange={(e) => updateField('carcaseMaterial', e.target.value as CarcaseMaterial)}
            className="w-full text-xs bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-xl px-3 py-2.5 focus:border-amber-500 focus:outline-none"
          >
            <option value="dsp_standard">Standart LDSP 16/18mm (Hamyonbop)</option>
            <option value="ldsp_egger">Egger / Kastamonu LDSP (Yuqori sifat)</option>
            <option value="mdf_painted">Bo'yalgan MDF 18mm (Namlikka chidamli)</option>
          </select>
        </div>

        {/* Facade Material */}
        <div>
          <label className="block text-[11px] font-medium text-neutral-400 mb-1.5">
            Eshik Fasadlari (Yuzi)
          </label>
          <select
            value={config.facadeMaterial}
            onChange={(e) => updateField('facadeMaterial', e.target.value as FacadeMaterial)}
            className="w-full text-xs bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-xl px-3 py-2.5 focus:border-amber-500 focus:outline-none"
          >
            <option value="dsp_laminate">LDSP Laminat (Eng arzon)</option>
            <option value="mdf_matte">MDF Mat emal (Zamonaviy soft-touch)</option>
            <option value="mdf_glossy">MDF Akril glyans (Yaltiroq silliq)</option>
            <option value="mdf_shpon">MDF Tabiiy Shpon (Klassik eman)</option>
            <option value="wood_solid">Tabiiy toza yog'och massivi</option>
          </select>
        </div>

        {/* Color / Texture Theme */}
        <div>
          <label className="block text-[11px] font-medium text-neutral-400 mb-1.5">
            Rang va Tekstura Uslubi
          </label>
          <select
            value={config.colorTheme}
            onChange={(e) => updateField('colorTheme', e.target.value as ColorTheme)}
            className="w-full text-xs bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-xl px-3 py-2.5 focus:border-amber-500 focus:outline-none"
          >
            <option value="white_matte">Toza oq mat (Zamonaviy Skandi)</option>
            <option value="cashmere">Kashmir issiq qaymoqrang (Elegant)</option>
            <option value="oak_sonoma">Sonoma eman (Iliq tabiiy yog'och)</option>
            <option value="anthracite">Antratsit / Grafit qora (Loft / High-tech)</option>
            <option value="walnut">To'q yong'oq yog'och (Premium)</option>
            <option value="emerald_gold">To'q zumrad yashil & oltin profil</option>
            <option value="marble_white">Oq marmar tekstura (Karrara)</option>
            <option value="midnight_blue">Tungi moviy (Midnight blue)</option>
            <option value="mocha_brown">Qahva & Moxiri (Mocha brown)</option>
            <option value="custom">Erkin maxsus rang (Studiyada tanlangan)</option>
          </select>
        </div>

        {/* Hardware Grade */}
        <div>
          <label className="block text-[11px] font-medium text-neutral-400 mb-1.5">
            Furnitura va Ilgaklar (Petlyalar)
          </label>
          <select
            value={config.hardwareGrade}
            onChange={(e) => updateField('hardwareGrade', e.target.value as HardwareGrade)}
            className="w-full text-xs bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-xl px-3 py-2.5 focus:border-amber-500 focus:outline-none"
          >
            <option value="budget">Ekonóm (Oddiy prujinali ilmoqlar)</option>
            <option value="standard">Standart (Boyard/GTV sekin yopiluvchi)</option>
            <option value="premium">Blum Blumotion (Avstriya original)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
