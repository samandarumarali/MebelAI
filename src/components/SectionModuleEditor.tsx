import React from 'react';
import { SectionModule, ModuleType } from '../types/furniture';
import {
  DoorClosed,
  AppWindow,
  Glasses,
  Grid,
  MenuSquare,
  Shirt,
  Tv,
  Monitor,
  Sparkles,
  Layers,
  Trash2,
  Plus,
  X,
  Eye,
  EyeOff,
} from 'lucide-react';

interface SectionModuleEditorProps {
  module: SectionModule | null;
  columnIndex: number;
  sectionIndex: number;
  totalSectionsInCol: number;
  onUpdate: (updated: Partial<SectionModule>) => void;
  onDelete: () => void;
  onAddSectionAbove: () => void;
  onAddSectionBelow: () => void;
  onClose: () => void;
}

const MODULE_OPTIONS: {
  type: ModuleType;
  titleUz: string;
  descUz: string;
  icon: React.ReactNode;
  badge?: string;
}[] = [
  {
    type: 'door_wood',
    titleUz: "Yopiq eshikli javoncha",
    descUz: "MDF / LDSP eshikli yopiq shkaf, chang tushmaydi",
    icon: <DoorClosed className="w-5 h-5 text-amber-400" />,
  },
  {
    type: 'mirror',
    titleUz: "Ko'zgu / Oyna eshik",
    descUz: "To'liq bo'y-bastli ko'zgu, xonani kengaytiradi",
    icon: <AppWindow className="w-5 h-5 text-sky-400" />,
    badge: "Oyna",
  },
  {
    type: 'door_glass',
    titleUz: "Shisha vitrina eshik",
    descUz: "Qoraytirilgan toblangan shisha + LED yoritgich",
    icon: <Glasses className="w-5 h-5 text-emerald-400" />,
    badge: "Vitrina",
  },
  {
    type: 'open_shelf',
    titleUz: "Ochiq javon / polkalar",
    descUz: "Kitoblar, dekor va suvenirlar uchun qulay",
    icon: <Grid className="w-5 h-5 text-purple-400" />,
  },
  {
    type: 'drawers',
    titleUz: "Tortmalar bloki (3 ta)",
    descUz: "Silliq yuruvchi teleskopik tortmalar",
    icon: <MenuSquare className="w-5 h-5 text-orange-400" />,
  },
  {
    type: 'clothes_rail',
    titleUz: "Kiyim osgich (Shtanga)",
    descUz: "Kostyum, ko'ylak va qishki palto osish joyi",
    icon: <Shirt className="w-5 h-5 text-blue-400" />,
    badge: "Garderob",
  },
  {
    type: 'tv_niche',
    titleUz: "TV tokcha / Zonasi",
    descUz: "Televizor qo'yish uchun keng ochiq joy",
    icon: <Tv className="w-5 h-5 text-rose-400" />,
    badge: "TV Niche",
  },
  {
    type: 'desk_niche',
    titleUz: "Ish stoli / Noutbuk joyi",
    descUz: "O'qish va kompyuterda ishlash tokchasi",
    icon: <Monitor className="w-5 h-5 text-teal-400" />,
  },
];

export const SectionModuleEditor: React.FC<SectionModuleEditorProps> = ({
  module,
  columnIndex,
  sectionIndex,
  totalSectionsInCol,
  onUpdate,
  onDelete,
  onAddSectionAbove,
  onAddSectionBelow,
  onClose,
}) => {
  if (!module) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-700/80 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                Ustun #{columnIndex + 1} • Bo'lma #{sectionIndex + 1}
              </span>
              {module.label && (
                <span className="text-xs text-neutral-400">({module.label})</span>
              )}
            </div>
            <h3 className="text-lg font-bold text-neutral-100 mt-1">
              Bo'lmani sozlash va turini tanlash
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Choose Module Type */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-300 block">
            Ushbu joyga nima qo'yilsin?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {MODULE_OPTIONS.map((opt) => {
              const isSelected = module.type === opt.type;
              return (
                <button
                  key={opt.type}
                  onClick={() => onUpdate({ type: opt.type })}
                  className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 text-neutral-100 shadow-md ring-1 ring-amber-500'
                      : 'bg-neutral-950/60 border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-800/40'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 shrink-0 mt-0.5">
                    {opt.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-semibold truncate">{opt.titleUz}</span>
                      {opt.badge && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-800 text-amber-300">
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-2">
                      {opt.descUz}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Height Ratio & Shelves */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-950/60 p-4 rounded-xl border border-neutral-800">
          {/* Height Proportion */}
          <div>
            <label className="text-xs font-medium text-neutral-300 block mb-1.5">
              Balandlik ulushi (Proportsiya)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0.5"
                max="3.5"
                step="0.5"
                value={module.heightRatio}
                onChange={(e) => onUpdate({ heightRatio: Number(e.target.value) })}
                className="w-full accent-amber-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-amber-400 w-10 text-right">
                {module.heightRatio}x
              </span>
            </div>
            <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
              <span>0.5x (Past)</span>
              <span>1.0x (O'rta)</span>
              <span>2.5x+ (Baland)</span>
            </div>
          </div>

          {/* Shelves Count */}
          <div>
            <label className="text-xs font-medium text-neutral-300 block mb-1.5">
              Ichki polkalar soni
            </label>
            <div className="flex items-center gap-2">
              {[0, 1, 2, 3, 4].map((count) => (
                <button
                  key={count}
                  onClick={() => onUpdate({ shelvesCount: count })}
                  className={`flex-1 py-1.5 text-xs rounded-lg font-medium border transition-colors ${
                    (module.shelvesCount ?? 1) === count
                      ? 'bg-amber-500 text-neutral-950 font-bold border-amber-500'
                      : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  {count === 0 ? "Yo'q" : `${count} ta`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Features: LED Light & Open Door Preview */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* LED Toggle */}
          <button
            onClick={() => onUpdate({ hasLed: !module.hasLed })}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
              module.hasLed
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm shadow-amber-500/10'
                : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>LED yoritgich (Podsvetka):</span>
            <span className="font-bold">{module.hasLed ? "Yoqilgan" : "O'chirilgan"}</span>
          </button>

          {/* Open/Close toggle for doors */}
          <button
            onClick={() => onUpdate({ isOpen: !module.isOpen })}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium bg-neutral-950 border border-neutral-800 text-neutral-300 hover:text-neutral-100 transition-colors"
          >
            {module.isOpen ? (
              <>
                <EyeOff className="w-4 h-4 text-amber-400" />
                <span>Eshikni yopish</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 text-emerald-400" />
                <span>Ichini ko'rish (Eshikni ochish)</span>
              </>
            )}
          </button>
        </div>

        {/* 4. Section Management: Add Above/Below, Delete */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-neutral-800">
          <div className="flex items-center gap-2">
            <button
              onClick={onAddSectionAbove}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-300 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Tepasiga bo'lma qo'shish
            </button>
            <button
              onClick={onAddSectionBelow}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-300 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Pastiga bo'lma qo'shish
            </button>
          </div>

          {totalSectionsInCol > 1 && (
            <button
              onClick={onDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400 bg-red-950/40 hover:bg-red-900/50 border border-red-800/50 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Bo'lmani o'chirish
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
