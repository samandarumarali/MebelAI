import React, { useState } from 'react';
import {
  FurnitureConfig,
  SmetaSummary,
  AiAnalysisResult,
} from '../types/furniture';
import {
  Sparkles,
  Bot,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Wrench,
  Send,
  Loader2,
  Image as ImageIcon,
  Maximize2,
  RefreshCw,
} from 'lucide-react';

interface AiAdvisorProps {
  config: FurnitureConfig;
  smeta: SmetaSummary;
  onApplyNewConfig: (newConfig: FurnitureConfig) => void;
}

export const AiAdvisor: React.FC<AiAdvisorProps> = ({
  config,
  smeta,
  onApplyNewConfig,
}) => {
  const [activeTab, setActiveTab] = useState<'audit' | 'prompt' | 'render'>('audit');

  // AI Audit State
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [auditResult, setAuditResult] = useState<AiAnalysisResult | null>(null);
  const [auditError, setAuditError] = useState<string | null>(null);

  // AI Prompt State
  const [promptText, setPromptText] = useState('');
  const [loadingPrompt, setLoadingPrompt] = useState(false);
  const [promptError, setPromptError] = useState<string | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);

  // AI Render State
  const [loadingRender, setLoadingRender] = useState(false);
  const [renderImage, setRenderImage] = useState<string | null>(null);
  const [renderNotice, setRenderNotice] = useState<string | null>(null);
  const [renderPrompt, setRenderPrompt] = useState<string | null>(null);

  // 1. Analyze Furniture
  const handleAnalyzeFurniture = async () => {
    setLoadingAudit(true);
    setAuditError(null);
    try {
      const res = await fetch('/api/ai/analyze-furniture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          furnitureConfig: config,
          smetaData: smeta,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'AI tahlili serverida xatolik');
      }

      const data: AiAnalysisResult = await res.json();
      setAuditResult(data);
    } catch (err: any) {
      setAuditError(err.message || "AI tahlilida xatolik yuz berdi");
    } finally {
      setLoadingAudit(false);
    }
  };

  // 2. Generate Layout from Prompt
  const handleGenerateLayout = async () => {
    if (!promptText.trim()) return;
    setLoadingPrompt(true);
    setPromptError(null);
    setAiExplanation(null);

    try {
      const res = await fetch('/api/ai/generate-layout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: promptText,
          currentDimensions: {
            wallWidth: config.wallWidth,
            wallHeight: config.wallHeight,
            depth: config.depth,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'AI dizayn tuzishda xatolik');
      }

      const data = await res.json();
      if (data.columns && data.columns.length > 0) {
        onApplyNewConfig({
          wallWidth: data.wallWidth || config.wallWidth,
          wallHeight: data.wallHeight || config.wallHeight,
          depth: data.depth || config.depth,
          roomType: data.roomType || config.roomType,
          carcaseMaterial: data.carcaseMaterial || config.carcaseMaterial,
          facadeMaterial: data.facadeMaterial || config.facadeMaterial,
          colorTheme: data.colorTheme || config.colorTheme,
          hardwareGrade: data.hardwareGrade || config.hardwareGrade,
          handlesType: data.handlesType || config.handlesType,
          columns: data.columns,
        });
        setAiExplanation(data.summaryExplanation || "Loyiha muvaffaqiyatli chizildi va smetasi hisoblandi!");
      }
    } catch (err: any) {
      setPromptError(err.message || "Dizayn yaratishda xatolik");
    } finally {
      setLoadingPrompt(false);
    }
  };

  // 3. Render Photorealistic Concept
  const handleRenderVisual = async () => {
    setLoadingRender(true);
    setRenderNotice(null);
    try {
      const res = await fetch('/api/ai/render-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ furnitureConfig: config }),
      });

      const data = await res.json();
      if (data.imageUrl) {
        setRenderImage(data.imageUrl);
      }
      if (data.notice) {
        setRenderNotice(data.notice);
      }
      if (data.prompt) {
        setRenderPrompt(data.prompt);
      }
    } catch (err: any) {
      setRenderNotice("Render yaratishda xatolik yuz berdi");
    } finally {
      setLoadingRender(false);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-neutral-950 font-black shadow-lg shadow-amber-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-neutral-100 flex items-center gap-2">
              4. Sun'iy Intellekt (AI) Mebel Maslahatchisi va Dizayneri
            </h2>
            <p className="text-xs text-neutral-400">
              Gemini AI yordamida smetani baholash, xarajatni tejash va matn orqali yangi mebel chizish
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'audit'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Smeta va Sifat Tahlili
          </button>
          <button
            onClick={() => setActiveTab('prompt')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'prompt'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Matn orqali AI Chizma
          </button>
          <button
            onClick={() => setActiveTab('render')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'render'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            AI Render / Konsept
          </button>
        </div>
      </div>

      {/* Tab 1: AI Furniture Audit & Smeta Optimization */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-950/80 p-4 rounded-xl border border-neutral-800">
            <div>
              <h3 className="text-sm font-semibold text-neutral-200">
                Loyiha va Smeta bo'yicha usta tahlili
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                AI hozirgi o'lchamlar, eshiklar, furnituralar va umumiy summani tekshirib xulosa beradi
              </p>
            </div>

            <button
              onClick={handleAnalyzeFurniture}
              disabled={loadingAudit}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/10 transition-all disabled:opacity-50"
            >
              {loadingAudit ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AI hisoblamoqda...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Smetani AI bilan tahlil qilish</span>
                </>
              )}
            </button>
          </div>

          {auditError && (
            <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-xl text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{auditError}</span>
            </div>
          )}

          {auditResult && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Score card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-neutral-950/90 border border-neutral-800 p-4 rounded-xl flex items-center gap-3">
                  <div className="text-3xl font-black font-mono text-amber-400">
                    {auditResult.qualityScore}
                    <span className="text-sm text-neutral-500">/100</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-neutral-200 block">Sifat va Loyiha Bahosi</span>
                    <span className="text-[11px] text-neutral-400">Ergonomika va mustahkamlik</span>
                  </div>
                </div>

                <div className="sm:col-span-2 bg-neutral-950/90 border border-neutral-800 p-4 rounded-xl">
                  <span className="text-xs font-bold text-neutral-200 block mb-1">
                    Bosh Usta Xulosasi:
                  </span>
                  <p className="text-xs text-neutral-300 leading-relaxed italic">
                    "{auditResult.carpenterVerdict}"
                  </p>
                </div>
              </div>

              {/* Detailed reviews */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Ergonomics & Durability */}
                <div className="bg-neutral-950/60 border border-neutral-800 p-4 rounded-xl space-y-3">
                  <div>
                    <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5 mb-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Ergonomika va Qulaylik
                    </span>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      {auditResult.ergonomicsReview}
                    </p>
                  </div>
                  <div className="border-t border-neutral-800/80 pt-2.5">
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 mb-1">
                      <Wrench className="w-3.5 h-3.5" /> Konstruksiya Mustahkamligi
                    </span>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      {auditResult.durabilityReview}
                    </p>
                  </div>
                </div>

                {/* Cost Optimization */}
                <div className="bg-neutral-950/60 border border-neutral-800 p-4 rounded-xl space-y-3">
                  <span className="text-xs font-semibold text-sky-400 flex items-center gap-1.5">
                    <TrendingDown className="w-3.5 h-3.5" /> Narxni Tejash va Optimallashtirish
                  </span>
                  <ul className="space-y-2">
                    {auditResult.costOptimizationTips.map((tip, idx) => (
                      <li key={idx} className="text-xs text-neutral-300 flex items-start gap-2 bg-neutral-900/80 p-2 rounded-lg border border-neutral-800">
                        <span className="text-amber-400 font-bold">#{idx + 1}</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-neutral-800/80 pt-2 text-[11px] text-neutral-400">
                    <span className="font-semibold text-neutral-300">Furnitura tavsiyasi: </span>
                    {auditResult.hardwareAdvice}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: AI Prompt Layout Generator */}
      {activeTab === 'prompt' && (
        <div className="space-y-4">
          <div className="bg-neutral-950/80 p-4 rounded-xl border border-neutral-800 space-y-3">
            <div>
              <label className="text-xs font-semibold text-neutral-200 block mb-1">
                Mebel haqidagi g'oyangizni o'zbek tilida yozing:
              </label>
              <p className="text-xs text-neutral-400">
                Masalan: "Devorim 340 sm. O'rtasiga katta 65 dyuymli TV zonasi, tepasida 3 ta shisha vitrina eshik, yonida kiyim osgich shkaf va pastida 4 ta tortma qilib ber"
              </p>
            </div>

            <div className="relative">
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Bu yerga qanday mebel xohlayotganingizni yozing..."
                rows={3}
                className="w-full bg-neutral-900 border border-neutral-700/80 rounded-xl p-3 text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              />
            </div>

            {/* Quick Prompt Ideas */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-neutral-400">Tayyor g'oyalar:</span>
              {[
                "Katta oyna eshikli shkaf-kupe va tortmalar",
                "Mehmonxona uchun TV devor va LED vitrinalar",
                "Dahliz uchun kiyim osgich, ko'zgu va poyabzal javoni",
              ].map((sample, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => setPromptText(sample)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:border-amber-500/50 hover:text-amber-400 transition-colors"
                >
                  {sample}
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={handleGenerateLayout}
                disabled={loadingPrompt || !promptText.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl shadow-lg transition-all disabled:opacity-50"
              >
                {loadingPrompt ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>AI mebel loyihasini chizmoqda...</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-4 h-4" />
                    <span>AI bilan Konstruktorni tuzish</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {promptError && (
            <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-xl text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{promptError}</span>
            </div>
          )}

          {aiExplanation && (
            <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-emerald-200">AI loyihani muvaffaqiyatli chizdi!</span>
                <p className="mt-0.5 text-neutral-300">{aiExplanation}</p>
                <p className="mt-1 text-[11px] text-amber-400 font-medium">
                  Yuqoridagi interaktiv konstruktorda chizma yangilandi, xarajatlar smetasi avtomatik hisoblandi!
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: AI Photorealistic 3D Concept */}
      {activeTab === 'render' && (
        <div className="space-y-4">
          <div className="bg-neutral-950/80 p-4 rounded-xl border border-neutral-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-neutral-200">
                AI Fotorealistik 3D Render Konsepti
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Hozirgi tanlangan o'lcham va materiallar bo'yicha interyerda 3D render yaratish
              </p>
            </div>

            <button
              onClick={handleRenderVisual}
              disabled={loadingRender}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-neutral-950 font-bold text-xs rounded-xl shadow-lg transition-all disabled:opacity-50"
            >
              {loadingRender ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>3D Render yaratilmoqda...</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4" />
                  <span>3D Render yaratish</span>
                </>
              )}
            </button>
          </div>

          {renderImage && (
            <div className="rounded-xl overflow-hidden border border-neutral-800 shadow-2xl bg-neutral-950">
              <img
                src={renderImage}
                alt="AI Generated Furniture Render"
                className="w-full h-auto object-cover max-h-[500px]"
              />
            </div>
          )}

          {renderNotice && (
            <div className="p-4 bg-neutral-950/90 border border-neutral-800 rounded-xl text-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>AI Dizayn Konsepti tavsifi:</span>
              </div>
              <p className="text-neutral-300 text-xs italic bg-neutral-900/90 p-3 rounded-lg border border-neutral-800 font-mono">
                {renderPrompt}
              </p>
              <p className="text-[11px] text-neutral-400">{renderNotice}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
