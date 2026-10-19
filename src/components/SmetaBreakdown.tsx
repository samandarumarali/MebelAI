import React, { useState } from 'react';
import { SmetaSummary, SmetaItem } from '../types/furniture';
import {
  DollarSign,
  Calculator,
  Printer,
  CheckCircle2,
  FileSpreadsheet,
  Package,
  Wrench,
  Sparkles,
  Info,
  Layers,
} from 'lucide-react';

interface SmetaBreakdownProps {
  smeta: SmetaSummary;
  wallWidth: number;
  wallHeight: number;
  depth: number;
}

export const SmetaBreakdown: React.FC<SmetaBreakdownProps> = ({
  smeta,
  wallWidth,
  wallHeight,
  depth,
}) => {
  const [currency, setCurrency] = useState<'UZS' | 'USD'>('UZS');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const formatPrice = (uzs: number, usd: number) => {
    if (currency === 'USD') {
      return `$${usd.toLocaleString()}`;
    }
    return `${uzs.toLocaleString()} so'm`;
  };

  const categories = [
    { id: 'all', label: 'Barchasi' },
    { id: 'materials', label: 'Plita & Kromka' },
    { id: 'glass_mirror', label: 'Oyna & Vitrina' },
    { id: 'hardware', label: 'Furnituralar' },
    { id: 'lighting', label: 'LED Yoritish' },
    { id: 'labor', label: 'Usta & Montaj' },
  ];

  const filteredItems =
    activeCategory === 'all'
      ? smeta.items
      : smeta.items.filter((i) => i.category === activeCategory);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-6 print:bg-white print:text-black print:border-none print:p-0">
      {/* 1. Header with Currency Toggle & Print */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-4 print:border-neutral-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 print:hidden">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-neutral-100 print:text-black">
              3. Mebel Xarajatlari va Materiallar Smetasi (Kalkulyatsiya)
            </h2>
            <p className="text-xs text-neutral-400 print:text-neutral-600">
              O'lcham: {wallWidth} x {wallHeight} x {depth} sm • Aniq sarflanadigan mahsulotlar ro'yxati
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 print:hidden">
          {/* Currency Toggle */}
          <div className="flex items-center bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
            <button
              onClick={() => setCurrency('UZS')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                currency === 'UZS'
                  ? 'bg-amber-500 text-neutral-950 shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              So'm (UZS)
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                currency === 'USD'
                  ? 'bg-amber-500 text-neutral-950 shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              USD ($)
            </button>
          </div>

          {/* Print / Export button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded-xl transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Chop etish / PDF</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Grand Total */}
        <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-amber-500/20 via-neutral-900 to-neutral-950 border border-amber-500/40 p-4 rounded-xl">
          <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block">
            Jami Umumiy Xarajat
          </span>
          <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono mt-1">
            {formatPrice(smeta.grandTotal, smeta.grandTotalUsd)}
          </div>
          <span className="text-[10px] text-neutral-400 mt-1 block">
            Materiallar + Usta mehnati + Montaj
          </span>
        </div>

        {/* Materials Total */}
        <div className="bg-neutral-950/80 border border-neutral-800 p-4 rounded-xl">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
            Jami Xom-ashyo & Plitalar
          </span>
          <div className="text-lg sm:text-xl font-bold text-neutral-100 font-mono mt-1">
            {formatPrice(smeta.totalMaterialsCost, Math.round(smeta.totalMaterialsCost / smeta.exchangeRate))}
          </div>
          <span className="text-[10px] text-neutral-500 mt-1 block">
            {smeta.totalSheetsCount} ta formatli plita listi
          </span>
        </div>

        {/* Hardware & Glass Total */}
        <div className="bg-neutral-950/80 border border-neutral-800 p-4 rounded-xl">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
            Furnitura, Oyna & LED
          </span>
          <div className="text-lg sm:text-xl font-bold text-neutral-100 font-mono mt-1">
            {formatPrice(
              smeta.totalHardwareCost + smeta.totalGlassCost + smeta.totalLightingCost,
              Math.round((smeta.totalHardwareCost + smeta.totalGlassCost + smeta.totalLightingCost) / smeta.exchangeRate)
            )}
          </div>
          <span className="text-[10px] text-neutral-500 mt-1 block">
            {smeta.totalHingesCount} ta ilmoq, {smeta.totalDrawersCount} ta tortma
          </span>
        </div>

        {/* Labor & Installation */}
        <div className="bg-neutral-950/80 border border-neutral-800 p-4 rounded-xl">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
            Usta xizmati & Montaj
          </span>
          <div className="text-lg sm:text-xl font-bold text-neutral-100 font-mono mt-1">
            {formatPrice(
              smeta.laborCost + smeta.installationCost,
              Math.round((smeta.laborCost + smeta.installationCost) / smeta.exchangeRate)
            )}
          </div>
          <span className="text-[10px] text-neutral-500 mt-1 block">
            Sexda yasash va xonaga o'rnatish
          </span>
        </div>
      </div>

      {/* 3. Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-neutral-800 pb-2 print:hidden">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
              activeCategory === cat.id
                ? 'bg-neutral-800 text-amber-400 font-semibold border border-neutral-700'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 4. Detailed Smeta Table */}
      <div className="overflow-x-auto rounded-xl border border-neutral-800 print:border-neutral-300">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-neutral-950/90 text-neutral-400 border-b border-neutral-800 font-semibold print:bg-neutral-100 print:text-black print:border-neutral-300">
              <th className="py-3 px-4">№</th>
              <th className="py-3 px-4">Mahsulot / Xizmat nomi</th>
              <th className="py-3 px-4">Birlik</th>
              <th className="py-3 px-4 text-center">Miqdori</th>
              <th className="py-3 px-4 text-right">Dona narxi</th>
              <th className="py-3 px-4 text-right">Jami summa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/70 text-neutral-200 print:divide-neutral-200 print:text-black">
            {filteredItems.map((item, idx) => (
              <tr
                key={item.id}
                className="hover:bg-neutral-800/30 transition-colors print:hover:bg-transparent"
              >
                <td className="py-3 px-4 font-mono text-neutral-500 print:text-neutral-600">
                  {idx + 1}
                </td>
                <td className="py-3 px-4">
                  <div className="font-semibold text-neutral-100 print:text-black">
                    {item.nameUz}
                  </div>
                  <div className="text-[11px] text-neutral-400 print:text-neutral-600">
                    {item.description}
                  </div>
                </td>
                <td className="py-3 px-4 font-mono text-neutral-400 print:text-neutral-600">
                  {item.unit}
                </td>
                <td className="py-3 px-4 text-center font-bold font-mono text-amber-400 print:text-black">
                  {item.quantity}
                </td>
                <td className="py-3 px-4 text-right font-mono text-neutral-400 print:text-black">
                  {formatPrice(item.unitPriceUzs, item.unitPriceUsd)}
                </td>
                <td className="py-3 px-4 text-right font-mono font-bold text-neutral-100 print:text-black">
                  {formatPrice(item.totalPriceUzs, item.totalPriceUsd)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-neutral-950 font-bold border-t-2 border-neutral-700 text-sm print:bg-neutral-100 print:text-black print:border-neutral-400">
              <td colSpan={4} className="py-3.5 px-4 text-right uppercase tracking-wider text-neutral-400 print:text-black">
                Jami Umumiy Qiymat:
              </td>
              <td colSpan={2} className="py-3.5 px-4 text-right font-mono text-amber-400 text-base font-black print:text-black">
                {formatPrice(smeta.grandTotal, smeta.grandTotalUsd)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* 5. Notes & Market Transparency */}
      <div className="flex items-start gap-2.5 bg-neutral-950/60 p-3.5 rounded-xl border border-neutral-800/80 text-[11px] text-neutral-400 print:hidden">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-neutral-300">Smeta hisob-kitobi haqida eslatma:</span> Narxlar Toshkent va O'zbekiston viloyatlaridagi mebel sexlari o'rtacha bozor baholari asosida shakllantirilgan (1 USD = {smeta.exchangeRate.toLocaleString()} so'm). Materiallar sifat toifasiga qarab yakuniy narx ±10% farqlanishi mumkin.
        </div>
      </div>
    </div>
  );
};
