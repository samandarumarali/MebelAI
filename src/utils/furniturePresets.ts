import { FurnitureConfig } from '../types/furniture';

export interface FurniturePreset {
  id: string;
  nameUz: string;
  descriptionUz: string;
  category: 'bedroom' | 'living' | 'kitchen' | 'hallway' | 'office';
  categoryLabel: string;
  badge: string;
  dimensions: string;
  config: FurnitureConfig;
}

export const FURNITURE_PRESETS: FurniturePreset[] = [
  {
    id: 'wardrobe_modern_combo',
    nameUz: "Garderob: 3-Eshikli Shkaf-Kupe va Ko'zgu",
    descriptionUz: "Kiyim osgich shtanga, to'liq bo'y ko'zgu eshik, antresol va keng ichki tortmalar",
    category: "bedroom",
    categoryLabel: "Yotoqxona",
    badge: "Eng ommabop",
    dimensions: "280 × 250 × 60 sm",
    config: {
      wallWidth: 280,
      wallHeight: 250,
      depth: 60,
      roomType: 'bedroom',
      carcaseMaterial: 'ldsp_egger',
      facadeMaterial: 'mdf_matte',
      colorTheme: 'cashmere',
      customFacadeColor: '#e8e2d8',
      customCarcaseColor: '#2b2927',
      customGlassColor: 'bronze',
      customHandleColor: 'black',
      hardwareGrade: 'standard',
      handlesType: 'black_bar',
      columns: [
        {
          id: 'col_1',
          title: "Chap: Kiyim osgich & Antresol",
          sections: [
            { id: 'sec_1_1', type: 'door_wood', heightRatio: 1, label: "Tepa antresol", shelvesCount: 1 },
            { id: 'sec_1_2', type: 'clothes_rail', heightRatio: 2.2, label: "Uzun kiyimlar osgichi", hasLed: true },
            { id: 'sec_1_3', type: 'drawers', heightRatio: 1, label: "3 ta pastki tortma" },
          ],
        },
        {
          id: 'col_2',
          title: "Markaz: To'liq Ko'zgu eshik",
          sections: [
            { id: 'sec_2_1', type: 'mirror', heightRatio: 1, label: "Tepa oyna eshik", shelvesCount: 1 },
            { id: 'sec_2_2', type: 'mirror', heightRatio: 2.2, label: "Bo'y-bastli ko'zgu eshik", shelvesCount: 3 },
            { id: 'sec_2_3', type: 'door_wood', heightRatio: 1, label: "Pastki yopiq quti" },
          ],
        },
        {
          id: 'col_3',
          title: "O'ng: Polkalar va Shisha vitrina",
          sections: [
            { id: 'sec_3_1', type: 'door_glass', heightRatio: 1.2, label: "Shisha vitrina + LED", hasLed: true, shelvesCount: 2 },
            { id: 'sec_3_2', type: 'door_wood', heightRatio: 2, label: "Kiyim javonlari", shelvesCount: 4 },
            { id: 'sec_3_3', type: 'drawers', heightRatio: 1, label: "Ichki kiyim tortmalari" },
          ],
        },
      ],
    },
  },
  {
    id: 'living_tv_wall',
    nameUz: "Zal: Zamonaviy TV Devor va Vitrina",
    descriptionUz: "Katta 65-75 dyuymli TV o'rni, qoraytirilgan oynali vitrina, LED yoritgichlar va konsol tortmalar",
    category: "living",
    categoryLabel: "Mehmonxona",
    badge: "Trend 2026",
    dimensions: "340 × 240 × 45 sm",
    config: {
      wallWidth: 340,
      wallHeight: 240,
      depth: 45,
      roomType: 'living',
      carcaseMaterial: 'ldsp_egger',
      facadeMaterial: 'mdf_matte',
      colorTheme: 'anthracite',
      customFacadeColor: '#282a2e',
      customCarcaseColor: '#1a1b1d',
      customGlassColor: 'black_tint',
      customHandleColor: 'hidden',
      hardwareGrade: 'premium',
      handlesType: 'gola',
      columns: [
        {
          id: 'col_1',
          title: "Chap vitrina",
          sections: [
            { id: 'sec_1_1', type: 'door_glass', heightRatio: 2.2, label: "Qoraytirilgan shisha vitrina", hasLed: true, shelvesCount: 3 },
            { id: 'sec_1_2', type: 'door_wood', heightRatio: 1, label: "Pastki tumba", shelvesCount: 1 },
          ],
        },
        {
          id: 'col_2',
          title: "Markaziy TV zonasi (Katta)",
          widthRatio: 1.8,
          sections: [
            { id: 'sec_2_1', type: 'open_shelf', heightRatio: 0.8, label: "Tepa ochiq dekor tokcha", hasLed: true },
            { id: 'sec_2_2', type: 'tv_niche', heightRatio: 2, label: "65-75 dyuymli TV o'rni", hasLed: true },
            { id: 'sec_2_3', type: 'drawers', heightRatio: 0.8, label: "Pastki konsol tortmalari" },
          ],
        },
        {
          id: 'col_3',
          title: "O'ng javon",
          sections: [
            { id: 'sec_3_1', type: 'open_shelf', heightRatio: 1.2, label: "Kitob & bezak javonlari", shelvesCount: 2 },
            { id: 'sec_3_2', type: 'door_wood', heightRatio: 2, label: "Yopiq saqlash bo'limi", shelvesCount: 3 },
          ],
        },
      ],
    },
  },
  {
    id: 'hallway_organizer',
    nameUz: "Dahliz: Prihojka, Oyna va Poyabzal Javoni",
    descriptionUz: "Ust-bosh kiyim osgich, pufik-o'tirgich, to'liq bo'y oyna eshik va shamollatishli poyabzal javoni",
    category: "hallway",
    categoryLabel: "Dahliz",
    badge: "Qulay & Ixcham",
    dimensions: "220 × 240 × 45 sm",
    config: {
      wallWidth: 220,
      wallHeight: 240,
      depth: 45,
      roomType: 'hallway',
      carcaseMaterial: 'dsp_standard',
      facadeMaterial: 'mdf_matte',
      colorTheme: 'oak_sonoma',
      customFacadeColor: '#e0c9aa',
      customCarcaseColor: '#b89f81',
      customGlassColor: 'clear',
      customHandleColor: 'black',
      hardwareGrade: 'standard',
      handlesType: 'black_bar',
      columns: [
        {
          id: 'col_1',
          title: "Kiyim osgich & Poyabzal",
          sections: [
            { id: 'sec_1_1', type: 'door_wood', heightRatio: 0.8, label: "Mavsumiy kiyimlar antresoli", shelvesCount: 1 },
            { id: 'sec_1_2', type: 'clothes_rail', heightRatio: 1.8, label: "Kundalik kiyim osgich" },
            { id: 'sec_1_3', type: 'drawers', heightRatio: 0.8, label: "Pufik / Poyabzal tortmasi" },
          ],
        },
        {
          id: 'col_2',
          title: "Ko'zgu & Yopiq shkaf",
          sections: [
            { id: 'sec_2_1', type: 'mirror', heightRatio: 2.2, label: "To'liq bo'y ko'zgu eshik", shelvesCount: 3 },
            { id: 'sec_2_2', type: 'door_wood', heightRatio: 1, label: "Poyabzal javoni (obuvnitsa)", shelvesCount: 2 },
          ],
        },
      ],
    },
  },
  {
    id: 'kitchen_modern_cabinet',
    nameUz: "Oshxona: 2-Qatorli Zamonaviy Oshxona Garnituri",
    descriptionUz: "Tepa vitrinalar, idish quritgich, texnika o'rni va pastki keng idish-tovoq tortmalari",
    category: "kitchen",
    categoryLabel: "Oshxona",
    badge: "Ergonomik",
    dimensions: "300 × 240 × 60 sm",
    config: {
      wallWidth: 300,
      wallHeight: 240,
      depth: 60,
      roomType: 'kitchen',
      carcaseMaterial: 'mdf_painted',
      facadeMaterial: 'mdf_matte',
      colorTheme: 'white_matte',
      customFacadeColor: '#ffffff',
      customCarcaseColor: '#dedede',
      customGlassColor: 'frosted',
      customHandleColor: 'hidden',
      hardwareGrade: 'premium',
      handlesType: 'gola',
      columns: [
        {
          id: 'col_1',
          title: "Chap qator",
          sections: [
            { id: 'sec_1_1', type: 'door_wood', heightRatio: 1.2, label: "Tepa quruq oziq-ovqat javoni", shelvesCount: 2 },
            { id: 'sec_1_2', type: 'open_shelf', heightRatio: 1.2, label: "Ziravorlar va chashkalar", hasLed: true },
            { id: 'sec_1_3', type: 'drawers', heightRatio: 1.2, label: "Pastki qozonlar tortmasi" },
          ],
        },
        {
          id: 'col_2',
          title: "Markaz: Vitrina & Ishchi zona",
          sections: [
            { id: 'sec_2_1', type: 'door_glass', heightRatio: 1.2, label: "Shisha idish vitrinasi", hasLed: true, shelvesCount: 2 },
            { id: 'sec_2_2', type: 'desk_niche', heightRatio: 1.2, label: "Oshxona ishchi stoli / fartuk" },
            { id: 'sec_2_3', type: 'drawers', heightRatio: 1.2, label: "Qoshiq-sanchqi tortmalari" },
          ],
        },
        {
          id: 'col_3',
          title: "O'ng: Idish quritgich & Shkaf",
          sections: [
            { id: 'sec_3_1', type: 'door_wood', heightRatio: 1.2, label: "Idish quritgich javoni (sushilka)", shelvesCount: 2 },
            { id: 'sec_3_2', type: 'empty_niche', heightRatio: 1.2, label: "Chanoq / moyka o'rni" },
            { id: 'sec_3_3', type: 'door_wood', heightRatio: 1.2, label: "Chanoq osti filtr bo'limi" },
          ],
        },
      ],
    },
  },
  {
    id: 'bedroom_luxury_4door',
    nameUz: "Yotoqxona: 4-Eshikli Lyuks Shkaf Antresoli Bilan",
    descriptionUz: "Simmetrik 4 ta qator, o'rtada 2 ta oyna, ikkala chetida kashmir fasadli shkaflar",
    category: "bedroom",
    categoryLabel: "Yotoqxona",
    badge: "Katta xonalar uchun",
    dimensions: "360 × 260 × 60 sm",
    config: {
      wallWidth: 360,
      wallHeight: 260,
      depth: 60,
      roomType: 'bedroom',
      carcaseMaterial: 'ldsp_egger',
      facadeMaterial: 'mdf_matte',
      colorTheme: 'cashmere',
      customFacadeColor: '#ece7df',
      customCarcaseColor: '#3d342c',
      customGlassColor: 'bronze',
      customHandleColor: 'gold',
      hardwareGrade: 'premium',
      handlesType: 'gold_brass',
      columns: [
        {
          id: 'col_1',
          title: "1-ustun: Erkaklar kiyimlari",
          sections: [
            { id: 'sec_1_1', type: 'door_wood', heightRatio: 0.9, label: "Antresol", shelvesCount: 1 },
            { id: 'sec_1_2', type: 'clothes_rail', heightRatio: 2.1, label: "Kostyum & shimlar osgichi", hasLed: true },
            { id: 'sec_1_3', type: 'drawers', heightRatio: 1, label: "Aksessuarlar tortmasi" },
          ],
        },
        {
          id: 'col_2',
          title: "2-ustun: Markaziy Ko'zgu",
          sections: [
            { id: 'sec_2_1', type: 'mirror', heightRatio: 0.9, label: "Tepa ko'zgu" },
            { id: 'sec_2_2', type: 'mirror', heightRatio: 2.1, label: "Katta bo'y ko'zgu", shelvesCount: 3 },
            { id: 'sec_2_3', type: 'door_wood', heightRatio: 1, label: "Pastki quti" },
          ],
        },
        {
          id: 'col_3',
          title: "3-ustun: Markaziy Ko'zgu 2",
          sections: [
            { id: 'sec_3_1', type: 'mirror', heightRatio: 0.9, label: "Tepa ko'zgu" },
            { id: 'sec_3_2', type: 'mirror', heightRatio: 2.1, label: "Katta bo'y ko'zgu", shelvesCount: 3 },
            { id: 'sec_3_3', type: 'door_wood', heightRatio: 1, label: "Pastki quti" },
          ],
        },
        {
          id: 'col_4',
          title: "4-ustun: Ayollar kiyimlari",
          sections: [
            { id: 'sec_4_1', type: 'door_wood', heightRatio: 0.9, label: "Antresol", shelvesCount: 1 },
            { id: 'sec_4_2', type: 'clothes_rail', heightRatio: 2.1, label: "Ko'ylaklar uzun osgichi", hasLed: true },
            { id: 'sec_4_3', type: 'drawers', heightRatio: 1, label: "Ichki kiyimlar tortmasi" },
          ],
        },
      ],
    },
  },
  {
    id: 'office_library',
    nameUz: "Ish xonasi: Kutubxona, Vitrina va Ish Stoli",
    descriptionUz: "Ko'p qavatli kitob polkalari, shisha eshikli arxiv, hujjatlar tortmalari va klassik yong'oq yog'och",
    category: "office",
    categoryLabel: "Ish xonasi",
    badge: "Klassik & Premium",
    dimensions: "300 × 260 × 50 sm",
    config: {
      wallWidth: 300,
      wallHeight: 260,
      depth: 50,
      roomType: 'office',
      carcaseMaterial: 'ldsp_egger',
      facadeMaterial: 'mdf_shpon',
      colorTheme: 'walnut',
      customFacadeColor: '#5c3e29',
      customCarcaseColor: '#3a2416',
      customGlassColor: 'clear',
      customHandleColor: 'gold',
      hardwareGrade: 'premium',
      handlesType: 'gold_brass',
      columns: [
        {
          id: 'col_1',
          title: "Chap: Kitoblar javoni",
          sections: [
            { id: 'sec_1_1', type: 'open_shelf', heightRatio: 2, label: "Ochiq kitob polkalari", shelvesCount: 4, hasLed: true },
            { id: 'sec_1_2', type: 'door_wood', heightRatio: 1, label: "Arxiv hujjatlari javoni", shelvesCount: 2 },
          ],
        },
        {
          id: 'col_2',
          title: "Markaz: Vitrina & Shkaf",
          sections: [
            { id: 'sec_2_1', type: 'door_glass', heightRatio: 1.8, label: "Shisha eshikli kitob javoni", shelvesCount: 3, hasLed: true },
            { id: 'sec_2_2', type: 'drawers', heightRatio: 1.2, label: "Kantselyariya tortmalari" },
          ],
        },
        {
          id: 'col_3',
          title: "O'ng: Yopiq shkaf",
          sections: [
            { id: 'sec_3_1', type: 'door_wood', heightRatio: 2, label: "Katta kiyim & buyum shkafi", shelvesCount: 3 },
            { id: 'sec_3_2', type: 'door_wood', heightRatio: 1, label: "Pastki seyf bo'lmasi" },
          ],
        },
      ],
    },
  },
  {
    id: 'emerald_luxury_tv',
    nameUz: "Zal: Zumrad Yashil & Oltin Profilli TV Devor",
    descriptionUz: "Noyob zumrad-yashil fasad, oltin tutqichlar, LED chiroqli ochiq polkalar va 70 dyuymli TV o'rni",
    category: "living",
    categoryLabel: "Mehmonxona",
    badge: "Eksklyuziv",
    dimensions: "320 × 240 × 45 sm",
    config: {
      wallWidth: 320,
      wallHeight: 240,
      depth: 45,
      roomType: 'living',
      carcaseMaterial: 'ldsp_egger',
      facadeMaterial: 'mdf_matte',
      colorTheme: 'emerald_gold',
      customFacadeColor: '#173f30',
      customCarcaseColor: '#0e261d',
      customGlassColor: 'bronze',
      customHandleColor: 'gold',
      hardwareGrade: 'premium',
      handlesType: 'gold_brass',
      columns: [
        {
          id: 'col_1',
          title: "Chap vitrina",
          sections: [
            { id: 'sec_1_1', type: 'door_glass', heightRatio: 2.2, label: "Oltin ramkali vitrina", hasLed: true, shelvesCount: 3 },
            { id: 'sec_1_2', type: 'door_wood', heightRatio: 1, label: "Pastki tumba", shelvesCount: 1 },
          ],
        },
        {
          id: 'col_2',
          title: "Markaziy TV bo'limi",
          widthRatio: 1.8,
          sections: [
            { id: 'sec_2_1', type: 'open_shelf', heightRatio: 0.8, label: "Oltin profilli LED tokcha", hasLed: true },
            { id: 'sec_2_2', type: 'tv_niche', heightRatio: 2, label: "70 dyuymli TV o'rni", hasLed: true },
            { id: 'sec_2_3', type: 'drawers', heightRatio: 0.8, label: "Konsol tortmalari" },
          ],
        },
        {
          id: 'col_3',
          title: "O'ng polkalar",
          sections: [
            { id: 'sec_3_1', type: 'open_shelf', heightRatio: 1.2, label: "Suvenirlar javoni", shelvesCount: 2, hasLed: true },
            { id: 'sec_3_2', type: 'door_wood', heightRatio: 2, label: "Yopiq shkafcha", shelvesCount: 3 },
          ],
        },
      ],
    },
  },
  {
    id: 'kids_study_combo',
    nameUz: "Bolalar xonasi: Dars Stoli va Shkaf Kombinatsiyasi",
    descriptionUz: "Yorug' oq-sonoma dizayn, qulay o'quv stoli, darsliklar uchun ochiq tokchalar va kiyim javoni",
    category: "bedroom",
    categoryLabel: "Bolalar xonasi",
    badge: "O'quvchilar uchun",
    dimensions: "260 × 230 × 55 sm",
    config: {
      wallWidth: 260,
      wallHeight: 230,
      depth: 55,
      roomType: 'bedroom',
      carcaseMaterial: 'ldsp_egger',
      facadeMaterial: 'mdf_matte',
      colorTheme: 'oak_sonoma',
      customFacadeColor: '#f7f6f2',
      customCarcaseColor: '#c4ad90',
      customGlassColor: 'clear',
      customHandleColor: 'black',
      hardwareGrade: 'standard',
      handlesType: 'black_bar',
      columns: [
        {
          id: 'col_1',
          title: "Kiyim shkafi",
          sections: [
            { id: 'sec_1_1', type: 'door_wood', heightRatio: 1, label: "Tepa javon", shelvesCount: 1 },
            { id: 'sec_1_2', type: 'clothes_rail', heightRatio: 2, label: "Maktab formasi osgichi" },
            { id: 'sec_1_3', type: 'drawers', heightRatio: 1, label: "Kiyim tortmalari" },
          ],
        },
        {
          id: 'col_2',
          title: "Darsliklar & Ish stoli",
          widthRatio: 1.5,
          sections: [
            { id: 'sec_2_1', type: 'open_shelf', heightRatio: 1.5, label: "Darsliklar va kitoblar", shelvesCount: 3, hasLed: true },
            { id: 'sec_2_2', type: 'desk_niche', heightRatio: 1.5, label: "Noutbuk / Dars tayyorlash stoli" },
            { id: 'sec_2_3', type: 'drawers', heightRatio: 1, label: "Daftarlar va ruchkalar tortmasi" },
          ],
        },
      ],
    },
  },
];
