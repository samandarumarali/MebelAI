import React, { useState, useMemo } from 'react';
import { FurnitureConfig, SectionModule, FurnitureColumn } from './types/furniture';
import { FURNITURE_PRESETS, FurniturePreset } from './utils/furniturePresets';
import { calculateSmeta } from './utils/smetaCalculator';
import { DimensionInputs } from './components/DimensionInputs';
import { InteractiveFurnitureCanvas } from './components/InteractiveFurnitureCanvas';
import { Perspective3DViewer } from './components/Perspective3DViewer';
import { SectionModuleEditor } from './components/SectionModuleEditor';
import { SmetaBreakdown } from './components/SmetaBreakdown';
import { AiAdvisor } from './components/AiAdvisor';
import { ColorStudio } from './components/ColorStudio';
import { RoomPlacementSimulator } from './components/RoomPlacementSimulator';
import { FurnitureCatalog } from './components/FurnitureCatalog';
import {
  Sparkles,
  Layout,
  Box,
  Compass,
  CheckCircle,
  HelpCircle,
  Home,
  Palette,
  LayoutGrid,
  Calculator,
  Eye,
  Sliders,
} from 'lucide-react';

export default function App() {
  // Current active furniture configuration
  const [config, setConfig] = useState<FurnitureConfig>(FURNITURE_PRESETS[0].config);

  // Active top navigation tab
  // 'room_sim': In-Home placement simulator
  // 'catalog': Showcase of sample furniture designs
  // 'constructor': 2D/3D interactive modular editor & dimensions
  // 'colors': Dedicated Color & Finish Studio
  // 'smeta': Bill of materials & AI cost advisor
  const [activeMainTab, setActiveMainTab] = useState<'room_sim' | 'catalog' | 'constructor' | 'colors' | 'smeta'>('room_sim');

  // Constructor view mode: 2D Interactive Elevation Canvas or 3D Isometric View
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');

  // Currently selected module for detailed editing
  const [selectedCoords, setSelectedCoords] = useState<{
    colIndex: number;
    secIndex: number;
  } | null>(null);

  // Calculate real-time smeta breakdown
  const smeta = useMemo(() => calculateSmeta(config), [config]);

  // Handle Preset Selection
  const handleSelectPreset = (preset: FurniturePreset) => {
    setConfig(JSON.parse(JSON.stringify(preset.config)));
    setSelectedCoords(null);
  };

  // Add Column
  const handleAddColumn = () => {
    if (config.columns.length >= 6) return;
    const newColId = `col_${Date.now()}`;
    const newColumn: FurnitureColumn = {
      id: newColId,
      title: `${config.columns.length + 1}-bo'lim`,
      sections: [
        {
          id: `sec_${Date.now()}_1`,
          type: 'door_wood',
          heightRatio: 1,
          label: 'Tepa javon',
          shelvesCount: 1,
        },
        {
          id: `sec_${Date.now()}_2`,
          type: 'open_shelf',
          heightRatio: 2,
          label: 'Polkalar',
          shelvesCount: 3,
        },
        {
          id: `sec_${Date.now()}_3`,
          type: 'drawers',
          heightRatio: 1,
          label: 'Tortmalar',
        },
      ],
    };

    setConfig({
      ...config,
      columns: [...config.columns, newColumn],
    });
  };

  // Remove Column
  const handleRemoveColumn = (colIndex: number) => {
    if (config.columns.length <= 1) return;
    const newCols = config.columns.filter((_, idx) => idx !== colIndex);
    setConfig({
      ...config,
      columns: newCols,
    });
    setSelectedCoords(null);
  };

  // Module update inside selectedCoords
  const handleUpdateSelectedModule = (updates: Partial<SectionModule>) => {
    if (!selectedCoords) return;
    const { colIndex, secIndex } = selectedCoords;

    const newColumns = [...config.columns];
    const targetColumn = { ...newColumns[colIndex] };
    const targetSections = [...targetColumn.sections];

    targetSections[secIndex] = {
      ...targetSections[secIndex],
      ...updates,
    };

    targetColumn.sections = targetSections;
    newColumns[colIndex] = targetColumn;

    setConfig({
      ...config,
      columns: newColumns,
    });
  };

  // Delete module from a column
  const handleDeleteSelectedModule = () => {
    if (!selectedCoords) return;
    const { colIndex, secIndex } = selectedCoords;

    const targetColumn = config.columns[colIndex];
    if (targetColumn.sections.length <= 1) {
      return;
    }

    const newColumns = [...config.columns];
    const newSections = targetColumn.sections.filter((_, idx) => idx !== secIndex);
    newColumns[colIndex] = {
      ...targetColumn,
      sections: newSections,
    };

    setConfig({
      ...config,
      columns: newColumns,
    });
    setSelectedCoords(null);
  };

  // Add section above
  const handleAddSectionAbove = () => {
    if (!selectedCoords) return;
    const { colIndex, secIndex } = selectedCoords;

    const targetColumn = config.columns[colIndex];
    if (targetColumn.sections.length >= 6) return;

    const newModule: SectionModule = {
      id: `sec_${Date.now()}`,
      type: 'door_wood',
      heightRatio: 1,
      label: 'Yangi bo\'lim',
    };

    const newSections = [...targetColumn.sections];
    newSections.splice(secIndex, 0, newModule);

    const newColumns = [...config.columns];
    newColumns[colIndex] = {
      ...targetColumn,
      sections: newSections,
    };

    setConfig({
      ...config,
      columns: newColumns,
    });
    setSelectedCoords({ colIndex, secIndex });
  };

  // Add section below
  const handleAddSectionBelow = () => {
    if (!selectedCoords) return;
    const { colIndex, secIndex } = selectedCoords;

    const targetColumn = config.columns[colIndex];
    if (targetColumn.sections.length >= 6) return;

    const newModule: SectionModule = {
      id: `sec_${Date.now()}`,
      type: 'open_shelf',
      heightRatio: 1,
      label: 'Yangi polkalar',
    };

    const newSections = [...targetColumn.sections];
    newSections.splice(secIndex + 1, 0, newModule);

    const newColumns = [...config.columns];
    newColumns[colIndex] = {
      ...targetColumn,
      sections: newSections,
    };

    setConfig({
      ...config,
      columns: newColumns,
    });
    setSelectedCoords({ colIndex, secIndex: secIndex + 1 });
  };

  const activeSelectedModule =
    selectedCoords &&
    config.columns[selectedCoords.colIndex]?.sections[selectedCoords.secIndex];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-amber-500 selection:text-neutral-950 pb-20">
      {/* 1. Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 px-4 sm:px-8 py-3.5 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-neutral-950 font-black shadow-lg shadow-amber-500/20">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold tracking-tight text-neutral-100">
                  Mebel<span className="text-amber-400">AI</span>
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold uppercase tracking-wider">
                  Interyer & Konstruktor
                </span>
              </div>
              <p className="text-xs text-neutral-400 hidden sm:block">
                O'lchamlar bo'yicha mebel loyihalash, xonada joylashtirish va narxini hisoblash
              </p>
            </div>
          </div>

          {/* Main Navigation Tabs */}
          <nav className="flex items-center gap-1.5 bg-neutral-900/90 p-1.5 rounded-2xl border border-neutral-800 overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveMainTab('room_sim')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeMainTab === 'room_sim'
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Xonada Joylashtirish</span>
            </button>

            <button
              onClick={() => setActiveMainTab('catalog')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeMainTab === 'catalog'
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Namuna Mebellar ({FURNITURE_PRESETS.length})</span>
            </button>

            <button
              onClick={() => setActiveMainTab('colors')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeMainTab === 'colors'
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Rang Tanlash</span>
            </button>

            <button
              onClick={() => setActiveMainTab('constructor')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeMainTab === 'constructor'
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Konstruktor & 3D</span>
            </button>

            <button
              onClick={() => setActiveMainTab('smeta')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeMainTab === 'smeta'
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>Smeta va AI</span>
            </button>
          </nav>
        </div>
      </header>

      {/* 2. Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-8">
        {/* TAB 1: In-Home Room Placement Simulator */}
        {activeMainTab === 'room_sim' && (
          <section className="space-y-6">
            <RoomPlacementSimulator
              config={config}
              onOpenConstructor={() => setActiveMainTab('constructor')}
            />

            {/* Quick in-place color bar & presets snippet under simulator */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ColorStudio config={config} onChange={setConfig} />

              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-2xl flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-neutral-100 uppercase tracking-wider mb-1">
                    Hozirgi Mebel O'lchamlari va Smeta
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Devor bo'yi: <span className="text-amber-400 font-bold">{config.wallHeight} sm</span>, Eni:{' '}
                    <span className="text-amber-400 font-bold">{config.wallWidth} sm</span>, Chuqurlik:{' '}
                    <span className="text-amber-400 font-bold">{config.depth} sm</span> ({config.columns.length} ta ustun)
                  </p>
                </div>

                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-neutral-400 block">Jami hisoblangan narxi:</span>
                    <span className="text-xl font-mono font-extrabold text-amber-400">
                      {smeta.grandTotal.toLocaleString()} so'm
                    </span>
                  </div>

                  <button
                    onClick={() => setActiveMainTab('smeta')}
                    className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 text-xs font-semibold rounded-xl border border-neutral-700 transition-colors"
                  >
                    Batafsil Smeta →
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => setActiveMainTab('catalog')}
                    className="flex-1 py-2 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl border border-neutral-700 transition-colors"
                  >
                    Boshqa mebel tanlash
                  </button>
                  <button
                    onClick={() => setActiveMainTab('constructor')}
                    className="flex-1 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-xl transition-colors shadow"
                  >
                    Chizmada tahrirlash
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB 2: Furniture Showcase & Samples Catalog */}
        {activeMainTab === 'catalog' && (
          <section>
            <FurnitureCatalog
              currentConfig={config}
              onSelectPreset={(preset) => {
                handleSelectPreset(preset);
              }}
              onOpenRoomSimulator={() => {
                setActiveMainTab('room_sim');
              }}
            />
          </section>
        )}

        {/* TAB 3: Dedicated Color & Finish Studio */}
        {activeMainTab === 'colors' && (
          <section className="space-y-6">
            <ColorStudio config={config} onChange={setConfig} />

            {/* Live 3D / 2D preview with updated colors */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h3 className="text-sm font-bold text-neutral-100 uppercase tracking-wider">
                  Tanlangan Ranglarning 3D Ko'rinishi
                </h3>
                <button
                  onClick={() => setActiveMainTab('room_sim')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-amber-500 text-neutral-950 rounded-xl"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Xonaga joylashtirib ko'rish</span>
                </button>
              </div>
              <Perspective3DViewer config={config} />
            </div>
          </section>
        )}

        {/* TAB 4: Interactive Modular Constructor & Dimensions */}
        {activeMainTab === 'constructor' && (
          <div className="space-y-8">
            {/* Wall Dimensions & Materials Picker */}
            <section>
              <DimensionInputs
                config={config}
                onChange={setConfig}
                onAddColumn={handleAddColumn}
                onRemoveColumn={handleRemoveColumn}
              />
            </section>

            {/* Interactive Canvas & 3D Visualizer */}
            <section className="space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('2d')}
                    className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                      viewMode === '2d'
                        ? 'bg-amber-500 text-neutral-950 shadow-md'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                    }`}
                  >
                    <Layout className="w-4 h-4" />
                    <span>2D Interaktiv Konstruktor (Chizma)</span>
                  </button>
                  <button
                    onClick={() => setViewMode('3d')}
                    className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                      viewMode === '3d'
                        ? 'bg-amber-500 text-neutral-950 shadow-md'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                    }`}
                  >
                    <Box className="w-4 h-4" />
                    <span>3D Real Izometriya & Perspektiva</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveMainTab('room_sim')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 text-neutral-200 hover:text-amber-400 rounded-xl transition-colors"
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>Xonada ko'rish</span>
                  </button>
                  <div className="text-xs text-neutral-400 font-mono hidden sm:block">
                    {config.wallWidth}x{config.wallHeight}x{config.depth} sm • {config.columns.length} ustun
                  </div>
                </div>
              </div>

              {/* Active Canvas */}
              {viewMode === '2d' ? (
                <InteractiveFurnitureCanvas
                  config={config}
                  onSelectSection={(colIdx, secIdx) =>
                    setSelectedCoords({ colIndex: colIdx, secIndex: secIdx })
                  }
                  selectedCoordinates={selectedCoords}
                />
              ) : (
                <Perspective3DViewer config={config} />
              )}
            </section>
          </div>
        )}

        {/* TAB 5: Complete Smeta & AI Cost Advisor */}
        {activeMainTab === 'smeta' && (
          <div className="space-y-8">
            <section>
              <SmetaBreakdown
                smeta={smeta}
                wallWidth={config.wallWidth}
                wallHeight={config.wallHeight}
                depth={config.depth}
              />
            </section>

            <section>
              <AiAdvisor
                config={config}
                smeta={smeta}
                onApplyNewConfig={(newCfg) => {
                  setConfig(newCfg);
                  setSelectedCoords(null);
                }}
              />
            </section>
          </div>
        )}
      </main>

      {/* 3. Section Customization Modal/Dock when a cell is clicked */}
      {selectedCoords && activeSelectedModule && (
        <SectionModuleEditor
          module={activeSelectedModule}
          columnIndex={selectedCoords.colIndex}
          sectionIndex={selectedCoords.secIndex}
          totalSectionsInCol={config.columns[selectedCoords.colIndex].sections.length}
          onUpdate={handleUpdateSelectedModule}
          onDelete={handleDeleteSelectedModule}
          onAddSectionAbove={handleAddSectionAbove}
          onAddSectionBelow={handleAddSectionBelow}
          onClose={() => setSelectedCoords(null)}
        />
      )}
    </div>
  );
}
