export type ModuleType =
  | 'door_wood'     // Yopiq yog'och / MDF eshikli javoncha
  | 'door_glass'    // Shisha / vitrina eshik (alyuminiy ramkada)
  | 'mirror'        // Ko'zgu / oyna eshik
  | 'open_shelf'    // Ochiq javon / polkalar
  | 'drawers'       // Tortmalar bloki (teleskopik)
  | 'clothes_rail'  // Kiyim osgich shtanga (garderob)
  | 'tv_niche'      // TV zonasi
  | 'desk_niche'    // Ish stoli / tokcha
  | 'empty_niche';  // Bo'sh joy

export interface SectionModule {
  id: string;
  type: ModuleType;
  heightRatio: number; // relative share of column height, e.g. 1, 1.5, 2
  hasLed?: boolean;
  shelvesCount?: number;
  label?: string;
  customColor?: string;
  isOpen?: boolean; // visual toggle to see interior
}

export interface FurnitureColumn {
  id: string;
  title: string;
  widthRatio?: number; // relative width (default 1)
  sections: SectionModule[];
}

export type CarcaseMaterial = 'dsp_standard' | 'ldsp_egger' | 'mdf_painted';
export type FacadeMaterial = 'dsp_laminate' | 'mdf_matte' | 'mdf_glossy' | 'mdf_shpon' | 'wood_solid';
export type ColorTheme =
  | 'white_matte'
  | 'oak_sonoma'
  | 'anthracite'
  | 'walnut'
  | 'cashmere'
  | 'emerald_gold'
  | 'marble_white'
  | 'midnight_blue'
  | 'mocha_brown'
  | 'custom';

export type GlassColor = 'clear' | 'black_tint' | 'bronze' | 'frosted';
export type HandleColor = 'black' | 'gold' | 'chrome' | 'bronze' | 'hidden';

export type HardwareGrade = 'budget' | 'standard' | 'premium';
export type HandlesType = 'gola' | 'black_bar' | 'gold_brass' | 'minimal_knob';
export type RoomType = 'bedroom' | 'living' | 'kitchen' | 'hallway' | 'office';

export interface FurnitureConfig {
  wallWidth: number;   // in cm, e.g. 280
  wallHeight: number;  // in cm, e.g. 240
  depth: number;       // in cm, e.g. 55
  roomType: RoomType;
  carcaseMaterial: CarcaseMaterial;
  facadeMaterial: FacadeMaterial;
  colorTheme: ColorTheme;
  customFacadeColor?: string; // custom hex color e.g. #f3efe8
  customCarcaseColor?: string; // custom hex color e.g. #2e3035
  customGlassColor?: GlassColor;
  customHandleColor?: HandleColor;
  hardwareGrade: HardwareGrade;
  handlesType: HandlesType;
  columns: FurnitureColumn[];
}

export interface SmetaItem {
  id: string;
  category: 'materials' | 'hardware' | 'glass_mirror' | 'lighting' | 'labor';
  nameUz: string;
  description: string;
  unit: string;
  quantity: number;
  unitPriceUzs: number;
  totalPriceUzs: number;
  unitPriceUsd: number;
  totalPriceUsd: number;
}

export interface SmetaSummary {
  items: SmetaItem[];
  totalMaterialsCost: number;
  totalHardwareCost: number;
  totalGlassCost: number;
  totalLightingCost: number;
  laborCost: number;
  installationCost: number;
  grandTotal: number;
  grandTotalUsd: number;
  totalSheetsCount: number;
  totalEdgeMeters: number;
  totalHingesCount: number;
  totalDrawersCount: number;
  totalHandlesCount: number;
  exchangeRate: number; // e.g. 12850 UZS per USD
}

export interface AiAnalysisResult {
  ergonomicsReview: string;
  durabilityReview: string;
  costOptimizationTips: string[];
  hardwareAdvice: string;
  qualityScore: number;
  carpenterVerdict: string;
}
