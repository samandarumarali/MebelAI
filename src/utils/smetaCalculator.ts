import { FurnitureConfig, SmetaItem, SmetaSummary, HardwareGrade, CarcaseMaterial, FacadeMaterial } from '../types/furniture';

export const USD_EXCHANGE_RATE = 12850;

// Pricing lookup tables (based on Uzbekistan market averages)
const CARCASE_PRICES: Record<CarcaseMaterial, { nameUz: string; pricePerSheet: number }> = {
  dsp_standard: {
    nameUz: "Standart LDSP 16/18mm (Karkas va ichki polkalar)",
    pricePerSheet: 390000, // ~ $30.3
  },
  ldsp_egger: {
    nameUz: "Premium Egger / Kastamonu LDSP 18mm",
    pricePerSheet: 640000, // ~ $49.8
  },
  mdf_painted: {
    nameUz: "Namlikka chidamli bo'yalgan MDF 18mm",
    pricePerSheet: 980000, // ~ $76.2
  },
};

const FACADE_PRICES: Record<FacadeMaterial, { nameUz: string; pricePerM2: number }> = {
  dsp_laminate: {
    nameUz: "LDSP Laminat eshik fasadlari",
    pricePerM2: 240000,
  },
  mdf_matte: {
    nameUz: "MDF Mat bo'yoq (Soft-touch emal)",
    pricePerM2: 520000,
  },
  mdf_glossy: {
    nameUz: "MDF Yaltiroq Akril (High Gloss)",
    pricePerM2: 650000,
  },
  mdf_shpon: {
    nameUz: "MDF Tabiiy Eman Shponi (Laklangan)",
    pricePerM2: 950000,
  },
  wood_solid: {
    nameUz: "Tabiiy toza yog'och massivi (Dub / Qarag'ay)",
    pricePerM2: 1600000,
  },
};

const HARDWARE_PRICES: Record<HardwareGrade, {
  hingePrice: number;
  hingeName: string;
  slidePrice: number;
  slideName: string;
}> = {
  budget: {
    hingePrice: 15000,
    hingeName: "Oddiy prujinali ilmoq (petlya)",
    slidePrice: 45000,
    slideName: "Standart rolikli rels",
  },
  standard: {
    hingePrice: 38000,
    hingeName: "GTV / Boyard yumshoq yopiluvchi ilmoq (dovodchik)",
    slidePrice: 135000,
    slideName: "Teleskopik yashirin dovodchikli rels (Boyard/GTV)",
  },
  premium: {
    hingePrice: 98000,
    hingeName: "Blum Clip Top Blumotion (Avstriya original ilmoq)",
    slidePrice: 380000,
    slideName: "Blum Tandembox / Movento yumshoq tortma tizimi",
  },
};

export function calculateSmeta(config: FurnitureConfig): SmetaSummary {
  const items: SmetaItem[] = [];
  const widthM = config.wallWidth / 100;
  const heightM = config.wallHeight / 100;
  const depthM = config.depth / 100;
  const colCount = Math.max(1, config.columns.length);
  const avgColWidthM = widthM / colCount;

  // 1. Karkas maydonini hisoblash (m2)
  // - Chap va o'ng tashqi devorlar: 2 * (heightM * depthM)
  // - Ustki va pastki qopqoq: 2 * (widthM * depthM)
  // - Vertikal bo'luvchi tik tirgaklar: (colCount - 1) * (heightM * depthM)
  // - Gorizontal polkalar va tagliklar
  let shelvesAreaM2 = 0;
  let totalHingesCount = 0;
  let totalDrawersCount = 0;
  let totalHandlesCount = 0;
  let mirrorAreaM2 = 0;
  let glassAreaM2 = 0;
  let facadeWoodAreaM2 = 0;
  let ledLengthM = 0;
  let clothesRailsCount = 0;

  config.columns.forEach((col) => {
    const totalRatios = col.sections.reduce((acc, s) => acc + (s.heightRatio || 1), 0);

    col.sections.forEach((sec) => {
      const secHeightM = (sec.heightRatio / totalRatios) * heightM;
      const secAreaM2 = avgColWidthM * secHeightM;

      // Polkalar
      const shelves = sec.shelvesCount ?? 1;
      shelvesAreaM2 += shelves * (avgColWidthM * depthM);

      // LED
      if (sec.hasLed) {
        ledLengthM += avgColWidthM + secHeightM * 0.5;
      }

      switch (sec.type) {
        case 'door_wood':
          facadeWoodAreaM2 += secAreaM2;
          totalHandlesCount += 1;
          totalHingesCount += secHeightM > 1.8 ? 4 : secHeightM > 1.0 ? 3 : 2;
          break;
        case 'door_glass':
          glassAreaM2 += secAreaM2;
          totalHandlesCount += 1;
          totalHingesCount += secHeightM > 1.4 ? 3 : 2;
          break;
        case 'mirror':
          mirrorAreaM2 += secAreaM2;
          totalHandlesCount += 1;
          totalHingesCount += secHeightM > 1.8 ? 4 : 3;
          break;
        case 'drawers':
          const drawersInSec = 3;
          totalDrawersCount += drawersInSec;
          totalHandlesCount += drawersInSec;
          facadeWoodAreaM2 += secAreaM2;
          break;
        case 'clothes_rail':
          clothesRailsCount += 1;
          // Kiyim shkaf eshiklari odatda yog'och yoki oyna bo'ladi
          facadeWoodAreaM2 += secAreaM2;
          totalHandlesCount += 1;
          totalHingesCount += secHeightM > 1.8 ? 4 : 3;
          break;
        case 'open_shelf':
        case 'tv_niche':
        case 'desk_niche':
        case 'empty_niche':
          // faqat ochiq karkas va polkalar
          break;
      }
    });
  });

  const carcaseSidesArea = 2 * (heightM * depthM);
  const carcaseTopBottomArea = 2 * (widthM * depthM);
  const carcaseDividersArea = (colCount - 1) * (heightM * depthM);
  const totalCarcaseAreaM2 = carcaseSidesArea + carcaseTopBottomArea + carcaseDividersArea + shelvesAreaM2;

  // List o'lchami: 2.80m x 2.07m = 5.796 m2, 82% unumdorlik (qirqish chiqindilari)
  const SHEET_USEFUL_AREA = 5.796 * 0.82; // ~4.75 m2
  const carcaseSheetsCount = Math.max(1, Math.ceil(totalCarcaseAreaM2 / SHEET_USEFUL_AREA));

  // Karkas plitasi
  const carcaseInfo = CARCASE_PRICES[config.carcaseMaterial];
  const carcaseTotalUzs = carcaseSheetsCount * carcaseInfo.pricePerSheet;
  items.push({
    id: 'mat_carcase',
    category: 'materials',
    nameUz: carcaseInfo.nameUz,
    description: `Umumiy karkas maydoni ~${totalCarcaseAreaM2.toFixed(1)} m². Format: 2800x2070mm.`,
    unit: 'list',
    quantity: carcaseSheetsCount,
    unitPriceUzs: carcaseInfo.pricePerSheet,
    totalPriceUzs: carcaseTotalUzs,
    unitPriceUsd: Math.round(carcaseInfo.pricePerSheet / USD_EXCHANGE_RATE),
    totalPriceUsd: Math.round(carcaseTotalUzs / USD_EXCHANGE_RATE),
  });

  // Fasadlar (Eshiklar va tortma oldi panellari)
  if (facadeWoodAreaM2 > 0) {
    const facadeInfo = FACADE_PRICES[config.facadeMaterial];
    const facadeTotalUzs = Math.round(facadeWoodAreaM2 * facadeInfo.pricePerM2);
    items.push({
      id: 'mat_facade',
      category: 'materials',
      nameUz: facadeInfo.nameUz,
      description: `Yopiq eshiklar va tortma fasadlari maydoni: ${facadeWoodAreaM2.toFixed(2)} m²`,
      unit: 'm²',
      quantity: Number(facadeWoodAreaM2.toFixed(2)),
      unitPriceUzs: facadeInfo.pricePerM2,
      totalPriceUzs: facadeTotalUzs,
      unitPriceUsd: Math.round(facadeInfo.pricePerM2 / USD_EXCHANGE_RATE),
      totalPriceUsd: Math.round(facadeTotalUzs / USD_EXCHANGE_RATE),
    });
  }

  // Orqa devor (DVP / HDF 3.2mm laminatlangan oq yoki yog'och rang)
  const backPanelAreaM2 = widthM * heightM;
  const backPanelSheets = Math.max(1, Math.ceil(backPanelAreaM2 / (2.8 * 2.07 * 0.9)));
  const backPanelPricePerSheet = 145000;
  const backPanelTotalUzs = backPanelSheets * backPanelPricePerSheet;
  items.push({
    id: 'mat_back_panel',
    category: 'materials',
    nameUz: "Orqa devor: HDF / DVP 3.2mm laminatlangan",
    description: `Devor to'liq maydoni: ${backPanelAreaM2.toFixed(2)} m²`,
    unit: 'list',
    quantity: backPanelSheets,
    unitPriceUzs: backPanelPricePerSheet,
    totalPriceUzs: backPanelTotalUzs,
    unitPriceUsd: Math.round(backPanelPricePerSheet / USD_EXCHANGE_RATE),
    totalPriceUsd: Math.round(backPanelTotalUzs / USD_EXCHANGE_RATE),
  });

  // Kromka tasma (PVC edge banding 1mm & 2mm)
  // Taxminan: har bir list uchun 25 metr kromka
  const totalEdgeMeters = Math.max(15, Math.round(carcaseSheetsCount * 22 + (facadeWoodAreaM2 * 8)));
  const edgePricePerMeter = 6500;
  const edgeTotalUzs = totalEdgeMeters * edgePricePerMeter;
  items.push({
    id: 'mat_edge_banding',
    category: 'materials',
    nameUz: "Kromka PVC lenta (1mm / 2mm qalinlikda)",
    description: "Barcha ko'rinadigan qirralar va polkalar himoya qoplamasi",
    unit: 'metr',
    quantity: totalEdgeMeters,
    unitPriceUzs: edgePricePerMeter,
    totalPriceUzs: edgeTotalUzs,
    unitPriceUsd: Math.round((edgePricePerMeter / USD_EXCHANGE_RATE) * 100) / 100,
    totalPriceUsd: Math.round(edgeTotalUzs / USD_EXCHANGE_RATE),
  });

  // Oyna / Ko'zgu (Mirror)
  if (mirrorAreaM2 > 0) {
    const mirrorPricePerM2 = 360000; // 4mm silver float oyna + orqasiga xavfsizlik plyonkasi
    const mirrorTotalUzs = Math.round(mirrorAreaM2 * mirrorPricePerM2);
    items.push({
      id: 'mat_mirror',
      category: 'glass_mirror',
      nameUz: "Kumush ko'zgu (4mm Silver Float + himoya plyonkasi)",
      description: `To'liq bo'y-bastli oyna eshiklar: ${mirrorAreaM2.toFixed(2)} m²`,
      unit: 'm²',
      quantity: Number(mirrorAreaM2.toFixed(2)),
      unitPriceUzs: mirrorPricePerM2,
      totalPriceUzs: mirrorTotalUzs,
      unitPriceUsd: Math.round(mirrorPricePerM2 / USD_EXCHANGE_RATE),
      totalPriceUsd: Math.round(mirrorTotalUzs / USD_EXCHANGE_RATE),
    });
  }

  // Shisha vitrina (Tempered glass + aluminium profile)
  if (glassAreaM2 > 0) {
    const glassPricePerM2 = 580000; // Toblangan shisha (tonirovanniy grafit/bronza) + ingichka qora alyuminiy ramka
    const glassTotalUzs = Math.round(glassAreaM2 * glassPricePerM2);
    items.push({
      id: 'mat_glass',
      category: 'glass_mirror',
      nameUz: "Vitrina: Qoraytirilgan toblangan shisha + Alyuminiy profil ramka",
      description: `Shisha vitrina eshiklar maydoni: ${glassAreaM2.toFixed(2)} m²`,
      unit: 'm²',
      quantity: Number(glassAreaM2.toFixed(2)),
      unitPriceUzs: glassPricePerM2,
      totalPriceUzs: glassTotalUzs,
      unitPriceUsd: Math.round(glassPricePerM2 / USD_EXCHANGE_RATE),
      totalPriceUsd: Math.round(glassTotalUzs / USD_EXCHANGE_RATE),
    });
  }

  // Furnitura (Hardware)
  const hw = HARDWARE_PRICES[config.hardwareGrade];

  // Petlyalar (Ilmoqlar)
  if (totalHingesCount > 0) {
    const hingesTotalUzs = totalHingesCount * hw.hingePrice;
    items.push({
      id: 'hw_hinges',
      category: 'hardware',
      nameUz: hw.hingeName,
      description: "Eshiklarni qisib ochilib-yopilmasdan jim ishlashini ta'minlovchi mexanizmlar",
      unit: 'dona',
      quantity: totalHingesCount,
      unitPriceUzs: hw.hingePrice,
      totalPriceUzs: hingesTotalUzs,
      unitPriceUsd: Math.round((hw.hingePrice / USD_EXCHANGE_RATE) * 10) / 10,
      totalPriceUsd: Math.round(hingesTotalUzs / USD_EXCHANGE_RATE),
    });
  }

  // Tortma relslari
  if (totalDrawersCount > 0) {
    const slidesTotalUzs = totalDrawersCount * hw.slidePrice;
    items.push({
      id: 'hw_slides',
      category: 'hardware',
      nameUz: hw.slideName,
      description: "Tortmalarning to'liq chiqariluvchi silliq rels tizimi",
      unit: 'juft',
      quantity: totalDrawersCount,
      unitPriceUzs: hw.slidePrice,
      totalPriceUzs: slidesTotalUzs,
      unitPriceUsd: Math.round(hw.slidePrice / USD_EXCHANGE_RATE),
      totalPriceUsd: Math.round(slidesTotalUzs / USD_EXCHANGE_RATE),
    });
  }

  // Tutqichlar / Mexanizmlar
  if (totalHandlesCount > 0) {
    let handlePrice = 45000;
    let handleName = "Profil qora tutqich (zamonaviy)";
    if (config.handlesType === 'gola') {
      handlePrice = 65000;
      handleName = "Yashirin Gola profil / Push-to-open mexanizm";
    } else if (config.handlesType === 'gold_brass') {
      handlePrice = 75000;
      handleName = "Oltin/Latun cho'tkalangan zamonaviy tutqich";
    } else if (config.handlesType === 'minimal_knob') {
      handlePrice = 28000;
      handleName = "Minimalistik nuqtali metall tugma tutqich";
    }

    const handlesTotalUzs = totalHandlesCount * handlePrice;
    items.push({
      id: 'hw_handles',
      category: 'hardware',
      nameUz: handleName,
      description: "Eshik va tortmalar uchun ushlagichlar",
      unit: 'dona',
      quantity: totalHandlesCount,
      unitPriceUzs: handlePrice,
      totalPriceUzs: handlesTotalUzs,
      unitPriceUsd: Math.round((handlePrice / USD_EXCHANGE_RATE) * 10) / 10,
      totalPriceUsd: Math.round(handlesTotalUzs / USD_EXCHANGE_RATE),
    });
  }

  // Kiyim osgich truba va kronshteynlar
  if (clothesRailsCount > 0) {
    const railPrice = 65000;
    const railsTotalUzs = clothesRailsCount * railPrice;
    items.push({
      id: 'hw_rails',
      category: 'hardware',
      nameUz: "Xrom kiyim osgich oval truba + yon flaneslar",
      description: "Og'ir qishki va yozgi kiyimlar uchun mustahkam metall shtanga",
      unit: 'to\'plam',
      quantity: clothesRailsCount,
      unitPriceUzs: railPrice,
      totalPriceUzs: railsTotalUzs,
      unitPriceUsd: Math.round(railPrice / USD_EXCHANGE_RATE),
      totalPriceUsd: Math.round(railsTotalUzs / USD_EXCHANGE_RATE),
    });
  }

  // LED yoritgich va quvvat bloki
  if (ledLengthM > 0) {
    const ledMeterPrice = 110000; // LED lenta + alyuminiy korpus + matoviy diffuzor
    const ledTotalUzs = Math.round(ledLengthM * ledMeterPrice) + 160000; // +160k transformator quvvat bloki
    items.push({
      id: 'light_led',
      category: 'lighting',
      nameUz: "LED profilli yoritish (Iliq 3000K/4000K + Transformator bloki)",
      description: "Shisha vitrinalar va ochiq tokchalardagi ichki yoritgich tasmasi",
      unit: 'metr',
      quantity: Number(ledLengthM.toFixed(1)),
      unitPriceUzs: ledMeterPrice,
      totalPriceUzs: ledTotalUzs,
      unitPriceUsd: Math.round(ledMeterPrice / USD_EXCHANGE_RATE),
      totalPriceUsd: Math.round(ledTotalUzs / USD_EXCHANGE_RATE),
    });
  }

  // Mahsulotlar jami summasi
  const materialsCost = items
    .filter(i => i.category === 'materials')
    .reduce((acc, i) => acc + i.totalPriceUzs, 0);

  const hardwareCost = items
    .filter(i => i.category === 'hardware')
    .reduce((acc, i) => acc + i.totalPriceUzs, 0);

  const glassCost = items
    .filter(i => i.category === 'glass_mirror')
    .reduce((acc, i) => acc + i.totalPriceUzs, 0);

  const lightingCost = items
    .filter(i => i.category === 'lighting')
    .reduce((acc, i) => acc + i.totalPriceUzs, 0);

  const totalRawCost = materialsCost + hardwareCost + glassCost + lightingCost;

  // 8. Usta xizmati: Yasash, raskroy, frezerovka va montaj
  // Mebelchilar qoidasi: Usta mehnati umumiy material xarajatining ~22-25% qismini tashkil qiladi
  const laborCost = Math.round(totalRawCost * 0.22);
  items.push({
    id: 'labor_manufacture',
    category: 'labor',
    nameUz: "Usta xizmati: Mebelni sexda yasash, frezalash va tayyorlash",
    description: "Formatli qirqish, kromkalash, teshiklarni aniq burg'ilash (pristrelka)",
    unit: 'loyixa',
    quantity: 1,
    unitPriceUzs: laborCost,
    totalPriceUzs: laborCost,
    unitPriceUsd: Math.round(laborCost / USD_EXCHANGE_RATE),
    totalPriceUsd: Math.round(laborCost / USD_EXCHANGE_RATE),
  });

  // 9. Yetkazib berish, ko'tarish va joyida devorga o'rnatish
  const installationCost = Math.max(300000, Math.round(totalRawCost * 0.08));
  items.push({
    id: 'labor_install',
    category: 'labor',
    nameUz: "Yetkazib berish, qavatga olib chiqish va joyida montaj qilish",
    description: "Devorga ankerli mahkamlash, eshiklarni sozlash va tozalash",
    unit: 'xizmat',
    quantity: 1,
    unitPriceUzs: installationCost,
    totalPriceUzs: installationCost,
    unitPriceUsd: Math.round(installationCost / USD_EXCHANGE_RATE),
    totalPriceUsd: Math.round(installationCost / USD_EXCHANGE_RATE),
  });

  const grandTotal = totalRawCost + laborCost + installationCost;
  const grandTotalUsd = Math.round(grandTotal / USD_EXCHANGE_RATE);

  return {
    items,
    totalMaterialsCost: materialsCost,
    totalHardwareCost: hardwareCost,
    totalGlassCost: glassCost,
    totalLightingCost: lightingCost,
    laborCost,
    installationCost,
    grandTotal,
    grandTotalUsd,
    totalSheetsCount: carcaseSheetsCount + backPanelSheets,
    totalEdgeMeters,
    totalHingesCount,
    totalDrawersCount,
    totalHandlesCount,
    exchangeRate: USD_EXCHANGE_RATE,
  };
}
