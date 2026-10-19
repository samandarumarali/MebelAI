import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini AI client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// 1. AI Furniture Analysis & Smeta Optimization
app.post('/api/ai/analyze-furniture', async (req, res) => {
  try {
    const { furnitureConfig, smetaData } = req.body;

    if (!furnitureConfig) {
      return res.status(400).json({ error: "Mebel parametrlari kiritilmadi" });
    }

    if (!apiKey) {
      return res.status(503).json({
        error: "GEMINI_API_KEY sozlanmagan. Iltimos, sozlamalardan API kalitini kiriting.",
      });
    }

    const prompt = `
Siz professional mebel ustasi, bosh muhandis-texnolog va smeta mutaxassisisiz (O'zbekiston mebel ishlab chiqarish standartlari bo'yicha).
Quyidagi mebel loyihasi va smetasini chuqur tahlil qiling va o'zbek tilida professional, amaliy maslahatlar bering.

Mebel loyihasi ma'lumotlari:
- Devor o'lchamlari: Eni ${furnitureConfig.wallWidth} sm, Bo'yi ${furnitureConfig.wallHeight} sm, Chuqurligi ${furnitureConfig.depth} sm
- Xona turi: ${furnitureConfig.roomType}
- Sektsiyalar (ustunlar) soni: ${furnitureConfig.columns?.length || 0} ta
- Karkas materiali: ${furnitureConfig.carcaseMaterial}
- Fasad materiali: ${furnitureConfig.facadeMaterial}
- Rang va uslub: ${furnitureConfig.colorTheme}
- Furnitura darajasi: ${furnitureConfig.hardwareGrade}
- Tutqich turi: ${furnitureConfig.handlesType}

Sektsiyalar tarkibi:
${JSON.stringify(furnitureConfig.columns, null, 2)}

Hisoblangan xarajatlar smetasi:
- Jami materiallar: ${smetaData?.totalMaterialsCost?.toLocaleString()} so'm ($${smetaData?.totalMaterialsCostUsd})
- Ish haqi va o'rnatish: ${smetaData?.laborCost?.toLocaleString()} so'm
- Umumiy jamlama narx: ${smetaData?.grandTotal?.toLocaleString()} so'm ($${smetaData?.grandTotalUsd})

Vazifangiz quyidagi JSON formatida javob qaytarish:
{
  "ergonomicsReview": "Mebel o'lchamlari, qulayligi, polkalar orasi, eshiklarning ochilish radiusi bo'yicha tahlil",
  "durabilityReview": "Konstruksiya mustahkamligi, oraliq tirgaklar, og'ir yuk ko'tarish qobiliyati bo'yicha tahlil",
  "costOptimizationTips": [
    "Narxni sifatni yo'qotmagan holda qanday 10-25% tejalishi mumkinligi haqida aniq 2-3 ta maslahat"
  ],
  "hardwareAdvice": "Ilgaklar (petlyalar), napravlyayushiy relslar va tutqichlar bo'yicha usta tavsiyasi",
  "qualityScore": 88, // 1 dan 100 gacha baho
  "carpenterVerdict": "Usta xulosasi: umumiy baho va yakuniy tavsiya"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ergonomicsReview: { type: Type.STRING },
            durabilityReview: { type: Type.STRING },
            costOptimizationTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            hardwareAdvice: { type: Type.STRING },
            qualityScore: { type: Type.NUMBER },
            carpenterVerdict: { type: Type.STRING },
          },
          required: [
            'ergonomicsReview',
            'durabilityReview',
            'costOptimizationTips',
            'hardwareAdvice',
            'qualityScore',
            'carpenterVerdict',
          ],
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    return res.json(result);
  } catch (error: any) {
    console.error('Furniture analysis error:', error);
    return res.status(500).json({ error: error.message || 'AI tahlilida xatolik yuz berdi' });
  }
});

// 2. AI Generate Layout from Natural Language Prompt
app.post('/api/ai/generate-layout', async (req, res) => {
  try {
    const { userPrompt, currentDimensions } = req.body;

    if (!userPrompt) {
      return res.status(400).json({ error: "Foydalanuvchi talabi kiritilmadi" });
    }

    if (!apiKey) {
      return res.status(503).json({
        error: "GEMINI_API_KEY sozlanmagan. Iltimos, sozlamalardan API kalitini kiriting.",
      });
    }

    const prompt = `
Siz aqlli mebel konstruktori arxitektori bo'lib ishlaysiz.
Foydalanuvchi o'z devoriga mos mebel qanday bo'lishini so'zlar bilan tushuntirdi:
"${userPrompt}"

Hozirgi devor o'lchamlari (agar foydalanuvchi matnda boshqasini aytmagan bo'lsa):
Eni: ${currentDimensions?.wallWidth || 280} sm, Bo'yi: ${currentDimensions?.wallHeight || 240} sm, Chuqurligi: ${currentDimensions?.depth || 55} sm

Quyidagi qoidalar asosida loyihalashtiring:
1. Mebel eniga qarab 2 tadan 6 tagacha teng yoki moslashuvchan sektsiyalarga (ustunlarga) bo'linadi. Har bir ustunning kengligi 50-90 sm oralig'ida bo'lishi maqbul.
2. Har bir sektsiyada vertikal modullar bo'ladi.
Modul turlari (type):
- "door_wood": Yog'och / MDF yopiq eshikli javoncha
- "door_glass": Oynali / vitrina shisha eshik
- "mirror": To'liq bo'y-bastli ko'zgu eshik
- "open_shelf": Ochiq polkalar (kitoblar, suvenirlar uchun)
- "drawers": Tortmalar bloki (pastki qismda)
- "clothes_rail": Kiyim osgich shtanga (garderoblar uchun, balandligi kamida 90 sm yoki ratio 2+)
- "tv_niche": TV zonasi (odatda markaziy 1 yoki 2 ta sektsiyada, baland bo'sh joy)
- "desk_niche": Ish stoli
- "empty_niche": Ochiq tokcha
3. Har bir modul uchun "heightRatio" (1 dan 4 gacha raqam, masalan pastki tortmalar 1, o'rta TV yoki kiyim osgich 2 yoki 3, tepa antresol 1) ko'rsatilsin.
4. "hasLed" true/false - shisha javonlar yoki ochiq tokchalarda LED yoritgich bo'lsa chiroyli ko'rinadi.
5. "shelvesCount" - ichidagi polkalar soni (1 dan 4 gacha).

Qaytaring:
- wallWidth, wallHeight, depth (santimetrda)
- roomType: 'bedroom' | 'living' | 'kitchen' | 'hallway' | 'office'
- carcaseMaterial: 'dsp_standard' | 'ldsp_egger' | 'mdf_painted'
- facadeMaterial: 'dsp_laminate' | 'mdf_matte' | 'mdf_glossy' | 'mdf_shpon' | 'wood_solid'
- colorTheme: 'white_matte' | 'oak_sonoma' | 'anthracite' | 'walnut' | 'cashmere' | 'emerald_gold'
- hardwareGrade: 'standard' | 'premium' | 'budget'
- handlesType: 'gola' | 'black_bar' | 'gold_brass' | 'minimal_knob'
- columns: massiv [
    {
      "id": "col_1",
      "title": "Chap sektsiya",
      "sections": [
        {
          "id": "sec_1_1",
          "type": "door_wood",
          "heightRatio": 1,
          "hasLed": false,
          "shelvesCount": 2,
          "label": "Tepa antresol"
        },
        ...
      ]
    }
  ]
- summaryExplanation: Nima sababdan ushbu dizayn tanlangani haqida 2-3 jumlali o'zbekcha izoh.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            wallWidth: { type: Type.NUMBER },
            wallHeight: { type: Type.NUMBER },
            depth: { type: Type.NUMBER },
            roomType: { type: Type.STRING },
            carcaseMaterial: { type: Type.STRING },
            facadeMaterial: { type: Type.STRING },
            colorTheme: { type: Type.STRING },
            hardwareGrade: { type: Type.STRING },
            handlesType: { type: Type.STRING },
            summaryExplanation: { type: Type.STRING },
            columns: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  sections: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        type: { type: Type.STRING },
                        heightRatio: { type: Type.NUMBER },
                        hasLed: { type: Type.BOOLEAN },
                        shelvesCount: { type: Type.NUMBER },
                        label: { type: Type.STRING },
                      },
                      required: ['id', 'type', 'heightRatio'],
                    },
                  },
                },
                required: ['id', 'sections'],
              },
            },
          },
          required: ['wallWidth', 'wallHeight', 'depth', 'columns', 'summaryExplanation'],
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    return res.json(result);
  } catch (error: any) {
    console.error('Generate layout error:', error);
    return res.status(500).json({ error: error.message || 'AI dizayn tuzishda xatolik yuz berdi' });
  }
});

// 3. AI Realistic Concept Image Prompt & Generation
app.post('/api/ai/render-image', async (req, res) => {
  try {
    const { furnitureConfig } = req.body;
    if (!furnitureConfig) {
      return res.status(400).json({ error: "Mebel konfiguratsiyasi yo'q" });
    }

    if (!apiKey) {
      return res.status(503).json({
        error: "GEMINI_API_KEY sozlanmagan.",
      });
    }

    // Try generating high quality rendering concept with gemini-3.1-flash-lite-image
    const imagePrompt = `Architectural 3D interior design render of a custom custom built-in wall unit furniture. Width ${furnitureConfig.wallWidth}cm, height ${furnitureConfig.wallHeight}cm, depth ${furnitureConfig.depth}cm. Room setting: luxurious modern ${furnitureConfig.roomType || 'living room'}. Materials: ${furnitureConfig.carcaseMaterial}, facades in ${furnitureConfig.facadeMaterial}, color finish ${furnitureConfig.colorTheme}. Features: modular storage with sections of glass display cabinets with soft warm LED interior strip lights, sleek mirrored panels, push-to-open seamless flush doors, and deep pull-out drawers. Photorealistic, 8k resolution, architectural digest style, warm ambient lighting, ray-traced shadows, hyper-realistic wood grain texture.`;

    try {
      const imgResponse = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [{ text: imagePrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: '16:9',
          },
        },
      });

      for (const part of imgResponse.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData?.data) {
          const imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          return res.json({ imageUrl, prompt: imagePrompt });
        }
      }
    } catch (imgError: any) {
      console.warn("Direct image generation not available or requires paid key, returning concept description:", imgError.message);
      return res.json({
        imageUrl: null,
        prompt: imagePrompt,
        notice: "AI 3D render konsepti tayyorlandi. Real vaqtli interaktiv 3D va 2D model to'liq ishlamoqda."
      });
    }

    return res.json({ imageUrl: null, prompt: imagePrompt });
  } catch (err: any) {
    console.error('Image render error:', err);
    return res.status(500).json({ error: err.message || 'Render tayyorlashda xatolik' });
  }
});

// Vite middleware in dev or static files in production
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

setupVite().catch(console.error);
