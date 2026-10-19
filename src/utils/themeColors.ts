import { ColorTheme, FurnitureConfig, GlassColor, HandleColor } from '../types/furniture';

export interface ResolvedPalette {
  carcaseBg: string;
  carcaseSide: string;
  carcaseBorder: string;
  facadeBg: string;
  facadeShadow: string;
  facadeBorder: string;
  shelfBg: string;
  accent: string;
  handleColor: string;
  glassColor: string;
  glassOpacity: number;
}

export const COLOR_PRESETS: {
  id: ColorTheme;
  nameUz: string;
  facadeHex: string;
  carcaseHex: string;
  descUz: string;
  category: 'monochrome' | 'wood' | 'accent' | 'luxury';
}[] = [
  {
    id: 'white_matte',
    nameUz: 'Toza Oq Mat',
    facadeHex: '#fafafa',
    carcaseHex: '#ebebeb',
    descUz: 'Skandinavcha toza, yorug\' va zamonaviy uslub',
    category: 'monochrome',
  },
  {
    id: 'cashmere',
    nameUz: 'Kashmir Qaymoqrang',
    facadeHex: '#eae5dd',
    carcaseHex: '#2b2927',
    descUz: 'Issiq qaymoqrang, ko\'zga yoqimli va juda ommabop',
    category: 'luxury',
  },
  {
    id: 'oak_sonoma',
    nameUz: 'Sonoma Eman (Yog\'och)',
    facadeHex: '#d8c2a7',
    carcaseHex: '#bfa07d',
    descUz: 'Tabiiy och eman teksturasi, shinam xonadonlar uchun',
    category: 'wood',
  },
  {
    id: 'walnut',
    nameUz: 'Klassik To\'q Yong\'oq',
    facadeHex: '#5c402d',
    carcaseHex: '#3b281c',
    descUz: 'Qimmatbaho aristokratik quyuq daraxt rangi',
    category: 'wood',
  },
  {
    id: 'anthracite',
    nameUz: 'Grafit & Antratsit Qora',
    facadeHex: '#282a2e',
    carcaseHex: '#1a1b1d',
    descUz: 'Loft va High-Tech uslubidagi qat\'iy qora grafit',
    category: 'monochrome',
  },
  {
    id: 'emerald_gold',
    nameUz: 'Zumrad Yashil & Oltin',
    facadeHex: '#133527',
    carcaseHex: '#0d241a',
    descUz: 'Boy zumrad rangli fasad va zarhal bezaklar',
    category: 'accent',
  },
  {
    id: 'marble_white',
    nameUz: 'Oq Marmar Tekstura',
    facadeHex: '#f1f5f9',
    carcaseHex: '#334155',
    descUz: 'Oliyjanob oq karrara marmari naqshidagi fasad',
    category: 'luxury',
  },
  {
    id: 'midnight_blue',
    nameUz: 'Tungi Moviy (Midnight)',
    facadeHex: '#1e293b',
    carcaseHex: '#0f172a',
    descUz: 'Chuqur to\'q ko\'k, sokin va hashamatli dizayn',
    category: 'accent',
  },
  {
    id: 'mocha_brown',
    nameUz: 'Qahva va Moxiri (Mocha)',
    facadeHex: '#4a3b32',
    carcaseHex: '#2d231e',
    descUz: 'Shokolad va qahva ohangidagi issiq mebel',
    category: 'wood',
  },
];

export const GLASS_PRESETS: { id: GlassColor; nameUz: string; color: string; opacity: number }[] = [
  { id: 'black_tint', nameUz: 'Qoraytirilgan (Qora shisha)', color: '#090a0f', opacity: 0.85 },
  { id: 'bronze', nameUz: 'Iliq Bronza oyna', color: '#634b35', opacity: 0.8 },
  { id: 'clear', nameUz: 'Shaffof billur shisha', color: '#cbd5e1', opacity: 0.35 },
  { id: 'frosted', nameUz: 'Muzlatilgan xira oq shisha', color: '#f8fafc', opacity: 0.65 },
];

export const HANDLE_PRESETS: { id: HandleColor; nameUz: string; hex: string }[] = [
  { id: 'black', nameUz: 'Qora mat (Black Bar)', hex: '#171717' },
  { id: 'gold', nameUz: 'Oltin latun (Gold Brass)', hex: '#d4af37' },
  { id: 'chrome', nameUz: 'Kumush xrom (Polished Chrome)', hex: '#94a3b8' },
  { id: 'bronze', nameUz: 'Antik bronza (Antique)', hex: '#785233' },
  { id: 'hidden', nameUz: 'Yashirin Gola profil', hex: '#404040' },
];

export function resolvePalette(config: FurnitureConfig): ResolvedPalette {
  const { colorTheme, customFacadeColor, customCarcaseColor, customGlassColor, customHandleColor, handlesType } = config;

  // Base theme definitions
  let baseFacade = '#fafafa';
  let baseCarcase = '#ebebeb';
  let baseCarcaseSide = '#d4d4d4';
  let baseBorder = '#a3a3a3';
  let baseShadow = '#e5e5e5';
  let baseShelf = '#f0f0f0';
  let baseAccent = '#ffffff';

  switch (colorTheme) {
    case 'white_matte':
      baseFacade = '#fafafa';
      baseCarcase = '#e5e5e5';
      baseCarcaseSide = '#d4d4d4';
      baseBorder = '#a3a3a3';
      baseShadow = '#e5e5e5';
      baseShelf = '#f5f5f5';
      baseAccent = '#ffffff';
      break;

    case 'oak_sonoma':
      baseFacade = '#d8c2a7';
      baseCarcase = '#bfa07d';
      baseCarcaseSide = '#a68560';
      baseBorder = '#8c6d48';
      baseShadow = '#9d7c57';
      baseShelf = '#cfb79b';
      baseAccent = '#eddcc8';
      break;

    case 'anthracite':
      baseFacade = '#282a2e';
      baseCarcase = '#1f2123';
      baseCarcaseSide = '#141414';
      baseBorder = '#404040';
      baseShadow = '#0d0d0e';
      baseShelf = '#2c2e33';
      baseAccent = '#383b40';
      break;

    case 'walnut':
      baseFacade = '#5c402d';
      baseCarcase = '#4a3324';
      baseCarcaseSide = '#2c1e15';
      baseBorder = '#3b281c';
      baseShadow = '#24160c';
      baseShelf = '#523826';
      baseAccent = '#6e4d37';
      break;

    case 'cashmere':
      baseFacade = '#eae5dd';
      baseCarcase = '#dcd6cd';
      baseCarcaseSide = '#b8b0a5';
      baseBorder = '#a8a095';
      baseShadow = '#c2baa7';
      baseShelf = '#e2dcd4';
      baseAccent = '#f7f4ee';
      break;

    case 'emerald_gold':
      baseFacade = '#133527';
      baseCarcase = '#0f291e';
      baseCarcaseSide = '#081711';
      baseBorder = '#1c4d39';
      baseShadow = '#05110c';
      baseShelf = '#17402f';
      baseAccent = '#235c44';
      break;

    case 'marble_white':
      baseFacade = '#f1f5f9';
      baseCarcase = '#334155';
      baseCarcaseSide = '#1e293b';
      baseBorder = '#94a3b8';
      baseShadow = '#cbd5e1';
      baseShelf = '#e2e8f0';
      baseAccent = '#ffffff';
      break;

    case 'midnight_blue':
      baseFacade = '#1e293b';
      baseCarcase = '#0f172a';
      baseCarcaseSide = '#020617';
      baseBorder = '#334155';
      baseShadow = '#090d16';
      baseShelf = '#1e293b';
      baseAccent = '#293548';
      break;

    case 'mocha_brown':
      baseFacade = '#4a3b32';
      baseCarcase = '#33261f';
      baseCarcaseSide = '#1f1612';
      baseBorder = '#3d2f27';
      baseShadow = '#18120e';
      baseShelf = '#42332a';
      baseAccent = '#59463c';
      break;

    case 'custom':
      baseFacade = customFacadeColor || '#e8e2d8';
      baseCarcase = customCarcaseColor || '#2b2927';
      baseCarcaseSide = '#1c1b1a';
      baseBorder = '#555555';
      baseShadow = '#111111';
      baseShelf = baseFacade;
      baseAccent = '#ffffff';
      break;
  }

  // Handle overrides
  if (customFacadeColor) {
    baseFacade = customFacadeColor;
    baseShelf = customFacadeColor;
  }
  if (customCarcaseColor) {
    baseCarcase = customCarcaseColor;
  }

  // Glass resolution
  const glassSetting = GLASS_PRESETS.find((g) => g.id === customGlassColor) || GLASS_PRESETS[0];

  // Handle color resolution
  let resolvedHandle = '#262626';
  if (customHandleColor) {
    const foundHandle = HANDLE_PRESETS.find((h) => h.id === customHandleColor);
    if (foundHandle) resolvedHandle = foundHandle.hex;
  } else if (handlesType === 'gold_brass' || colorTheme === 'emerald_gold') {
    resolvedHandle = '#d4af37';
  } else if (handlesType === 'gola') {
    resolvedHandle = '#404040';
  }

  return {
    carcaseBg: baseCarcase,
    carcaseSide: baseCarcaseSide,
    carcaseBorder: baseBorder,
    facadeBg: baseFacade,
    facadeShadow: baseShadow,
    facadeBorder: baseBorder,
    shelfBg: baseShelf,
    accent: baseAccent,
    handleColor: resolvedHandle,
    glassColor: glassSetting.color,
    glassOpacity: glassSetting.opacity,
  };
}
