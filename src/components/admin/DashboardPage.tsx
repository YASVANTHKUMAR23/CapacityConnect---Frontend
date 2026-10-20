import React, { useState, useEffect } from 'react';
import {
  Users,
  Award,
  CheckCircle2,
  TrendingUp,
  MoreHorizontal,
  Maximize2,
  ArrowUpRight,
  ArrowDownRight,
  Megaphone,
  Plus,
  RotateCcw,
  Sparkles,
  ChevronUp,
  ChevronDown,
  X,
  Play,
  Pause,
  Trash2,
} from 'lucide-react';
import { AdminTab } from '../../types';
import { useAdminData } from '../../context/AdminDataContext';

interface DashboardPageProps {
  onNavigateTab: (tab: AdminTab) => void;
  showToast: (msg: string) => void;
}

interface MonthData {
  month: string;
  enrolled: number;
  completed: number;
}

export interface DivisionItem {
  id: string;
  name: string;
  count: number;
  change: string;
  isPositive: boolean;
  color: string;
}

const BAR_DATA: MonthData[] = [
  { month: 'May', enrolled: 320, completed: 210 },
  { month: 'Jun', enrolled: 410, completed: 280 },
  { month: 'Jul', enrolled: 380, completed: 300 },
  { month: 'Aug', enrolled: 520, completed: 390 },
  { month: 'Sep', enrolled: 600, completed: 440 },
  { month: 'Oct', enrolled: 680, completed: 510 },
];

const INITIAL_DIVISIONS: DivisionItem[] = [
  {
    id: 'div-1',
    name: 'Regional Satellites',
    count: 168,
    change: '+4%',
    isPositive: true,
    color: '#a3a8f6',
  },
  {
    id: 'div-2',
    name: 'Delhi HQ',
    count: 417,
    change: '+8%',
    isPositive: true,
    color: '#3b41e3',
  },
  {
    id: 'div-3',
    name: 'Pune',
    count: 281,
    change: '+5%',
    isPositive: true,
    color: '#5157ea',
  },
  {
    id: 'div-4',
    name: 'Chennai',
    count: 212,
    change: '-2%',
    isPositive: false,
    color: '#8e93f3',
  },
];

// Presets to test newly arriving divisions from regional meteorology centers
const SAMPLE_PRESETS: Omit<DivisionItem, 'id'>[] = [
  { name: 'Kolkata', count: 310, change: '+6%', isPositive: true, color: '#6366f1' },
  { name: 'Mumbai', count: 350, change: '+9%', isPositive: true, color: '#4338ca' },
  { name: 'Bengaluru', count: 195, change: '+3%', isPositive: true, color: '#7c3aed' },
  { name: 'Hyderabad', count: 240, change: '+7%', isPositive: true, color: '#818cf8' },
  { name: 'Guwahati', count: 145, change: '-1%', isPositive: false, color: '#9fa4f6' },
  { name: 'Ahmedabad', count: 275, change: '+8%', isPositive: true, color: '#4f46e5' },
  { name: 'Nagpur', count: 320, change: '+5%', isPositive: true, color: '#5b21b6' },
];

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateTab,
  showToast,
}) => {
  const { pinnedAnnouncement, announcements } = useAdminData();
  const [enrollmentTimeframe, setEnrollmentTimeframe] = useState('This year');
  const [courseFilter, setCourseFilter] = useState('This month');
  const [activeTooltipIndex, setActiveTooltipIndex] = useState<number | null>(3); // Default to Aug as in snippet

  // Dynamic divisions state for participation bubbles
  const [divisions, setDivisions] = useState<DivisionItem[]>(INITIAL_DIVISIONS);
  const [isTestWidgetOpen, setIsTestWidgetOpen] = useState(false);
  const [isAutoStreaming, setIsAutoStreaming] = useState(false);
  const [hoveredDivisionId, setHoveredDivisionId] = useState<string | null>(null);
  const [customName, setCustomName] = useState('');
  const [customCount, setCustomCount] = useState('');

  // Active announcement displayed in hero card (connected to AdminDataContext)
  const heroAnn = pinnedAnnouncement || announcements[0];

  // SVG Chart Dimensions
  const W = 560;
  const H = 250;
  const L = 34;
  const B = 28;
  const T = 10;
  const max = 800;
  const ph = H - B - T;
  const pw = W - L - 6;
  const gw = pw / BAR_DATA.length;
  const bw = 22;

  // Concentric Rings Configuration for Competency Building Gauge (270 deg sweep)
  const gaugeRings = [
    { r: 88, val: 72, color: '#3b41e3' },
    { r: 68, val: 58, color: '#f0525b' },
    { r: 48, val: 49, color: '#9fa4f6' },
  ];

  // Dynamic Placement Function for Bubble Circles
  // Strictly respects CSS rules from metadata for the initial 4 bubbles:
  // - CSS selector 1 (1st circle): padding-left: 0px; margin-left: 15px;
  // - CSS selector 3 (2nd circle): margin-left: 0px;
  // - CSS selector 4 (4th circle): margin-top: -1px; margin-left: -22px;
  const getBubblePlacement = (index: number, count: number, total: number) => {
    // 1. Initial 4 bubbles with exact coordinates & requested CSS properties applied
    if (index === 0) {
      return {
        width: '28%',
        aspectRatio: '1',
        left: '10%',
        top: '15%',
        paddingLeft: '0px',
        marginLeft: '15px',
        fontSize: '12px',
        zIndex: 5,
      };
    }
    if (index === 1) {
      return {
        width: '53.3%',
        aspectRatio: '1',
        left: '38%',
        top: '10%',
        marginLeft: '0px',
        fontSize: '15px',
        zIndex: 10,
      };
    }
    if (index === 2) {
      return {
        width: '38.7%',
        aspectRatio: '1',
        left: '12%',
        top: '42.5%',
        fontSize: '14px',
        zIndex: 8,
      };
    }
    if (index === 3) {
      return {
        width: '26.7%',
        aspectRatio: '1',
        left: '53.3%',
        top: '64.5%',
        marginTop: '-1px',
        marginLeft: '-22px',
        fontSize: '12px',
        zIndex: 6,
      };
    }

    // 2. Newly arrived divisions (index >= 4):
    // Dedicated optimal placement coordinates that fit naturally around the cluster
    const predefinedSlots = [
      { left: '73%', top: '22%', width: '27%', zIndex: 9 }, // Slot 4: Right flank
      { left: '33%', top: '74%', width: '28%', zIndex: 7 }, // Slot 5: Bottom center
      { left: '2%', top: '34%', width: '24%', zIndex: 6 },  // Slot 6: Left edge
      { left: '30%', top: '-2%', width: '23%', zIndex: 8 }, // Slot 7: Top center
      { left: '73%', top: '54%', width: '26%', zIndex: 7 }, // Slot 8: Bottom right
      { left: '2%', top: '64%', width: '25%', zIndex: 6 },  // Slot 9: Bottom left
      { left: '12%', top: '80%', width: '24%', zIndex: 5 }, // Slot 10: Deep bottom
      { left: '74%', top: '-1%', width: '22%', zIndex: 8 }, // Slot 11: Top right
    ];

    const slotIdx = index - 4;
    if (slotIdx < predefinedSlots.length) {
      const slot = predefinedSlots[slotIdx];
      const countScale = Math.max(0.85, Math.min(1.2, count / 260));
      const widthVal = Math.round(parseFloat(slot.width) * countScale);
      return {
        width: `${widthVal}%`,
        aspectRatio: '1',
        left: slot.left,
        top: slot.top,
        fontSize: widthVal > 25 ? '13px' : '11px',
        zIndex: slot.zIndex,
      };
    }

    const angleDeg = (slotIdx * 45) % 360;
    const angleRad = (angleDeg * Math.PI) / 180;
    const left = Math.min(76, Math.max(2, Math.round(42 + Math.cos(angleRad) * 35)));
    const top = Math.min(76, Math.max(2, Math.round(44 + Math.sin(angleRad) * 32)));

    return {
      width: '23%',
      aspectRatio: '1',
      left: `${left}%`,
      top: `${top}%`,
      fontSize: '11px',
      zIndex: 7,
    };
  };

  const handleAddPreset = (preset: Omit<DivisionItem, 'id'>) => {
    const newItem: DivisionItem = {
      ...preset,
      id: `div-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setDivisions((prev) => [...prev, newItem]);
    showToast(`New division arrived: ${preset.name} (${preset.count} active trainees).`);
  };

  const handleQuickNextArrival = () => {
    const existingNames = new Set(divisions.map((d) => d.name));
    const nextPreset = SAMPLE_PRESETS.find((p) => !existingNames.has(p.name));
    if (nextPreset) {
      handleAddPreset(nextPreset);
    } else {
      // Dynamic additional center
      const randomCount = Math.floor(160 + Math.random() * 260);
      const randomChange =
        Math.random() > 0.3
          ? `+${Math.floor(2 + Math.random() * 8)}%`
          : `-${Math.floor(1 + Math.random() * 4)}%`;
      const colors = ['#6366f1', '#4338ca', '#7c3aed', '#818cf8', '#5157ea', '#3b41e3', '#9333ea'];
      const newItem: DivisionItem = {
        id: `div-${Date.now()}`,
        name: `IMD Station ${divisions.length + 1}`,
        count: randomCount,
        change: randomChange,
        isPositive: !randomChange.startsWith('-'),
        color: colors[divisions.length % colors.length],
      };
      setDivisions((prev) => [...prev, newItem]);
      showToast(`New division arrived: ${newItem.name} (${newItem.count} trainees).`);
    }
  };

  const handleRemoveDivision = (id: string) => {
    setDivisions((prev) => prev.filter((d) => d.id !== id));
    showToast('Division removed.');
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    const parsedCount = parseInt(customCount, 10) || 220;
    const colors = ['#6366f1', '#4338ca', '#7c3aed', '#818cf8', '#5157ea', '#3b41e3'];
    const selectedColor = colors[divisions.length % colors.length];

    const newItem: DivisionItem = {
      id: `div-${Date.now()}`,
      name: customName.trim(),
      count: parsedCount,
      change: '+5%',
      isPositive: true,
      color: selectedColor,
    };

    setDivisions((prev) => [...prev, newItem]);
    setCustomName('');
    setCustomCount('');
    showToast(`Created & placed dynamic circle for ${newItem.name} (${newItem.count}).`);
  };

  const handleResetDivisions = () => {
    setIsAutoStreaming(false);
    setDivisions(INITIAL_DIVISIONS);
    showToast('Reset division circles back to default 4.');
  };

  // Auto-stream effect when toggled on
  useEffect(() => {
    if (!isAutoStreaming) return;
    const interval = setInterval(() => {
      handleQuickNextArrival();
    }, 3200);
    return () => clearInterval(interval);
  }, [isAutoStreaming, divisions.length]);

  return (
    <div className="space-y-6">
      {/* 1. Three Quick-Management Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Course management</h3>
            <div className="flex items-center gap-1 text-slate-400">
              <button
                type="button"
                onClick={() => onNavigateTab('courses')}
                className="hover:text-slate-600"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('courses')}
                className="hover:text-slate-600"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Active courses</span>
              <span className="text-xl font-bold text-slate-900">36 / 48</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 font-medium block">Inactive</span>
              <span className="text-sm font-semibold text-slate-600">12</span>
            </div>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full w-[75%]" />
            <div className="bg-slate-200 h-full w-[25%]" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Trainer management</h3>
            <div className="flex items-center gap-1 text-slate-400">
              <button
                type="button"
                onClick={() => onNavigateTab('trainers')}
                className="hover:text-slate-600"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('trainers')}
                className="hover:text-slate-600"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Active trainers</span>
              <span className="text-xl font-bold text-slate-900">54 / 62</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 font-medium block">Inactive</span>
              <span className="text-sm font-semibold text-slate-600">8</span>
            </div>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
            <div className="bg-blue-600 h-full w-[87%]" />
            <div className="bg-slate-200 h-full w-[13%]" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Trainee management</h3>
            <div className="flex items-center gap-1 text-slate-400">
              <button
                type="button"
                onClick={() => onNavigateTab('trainees')}
                className="hover:text-slate-600"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('trainees')}
                className="hover:text-slate-600"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Active trainees</span>
              <span className="text-xl font-bold text-slate-900">1,096 / 1,284</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 font-medium block">Inactive</span>
              <span className="text-sm font-semibold text-slate-600">188</span>
            </div>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
            <div className="bg-blue-600 h-full w-[85%]" />
            <div className="bg-slate-200 h-full w-[15%]" />
          </div>
        </div>
      </div>

      {/* 3. Four Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-500">Enrollments</span>
            <div className="w-[40px] h-[40px] rounded-full bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
              <Users className="w-[26px] h-[26px]" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-900 tabular-nums">3,420</div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="inline-flex items-center text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                <ArrowUpRight className="w-3 h-3" /> +12.4%
              </span>
              <span className="text-[11px] text-slate-400">from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-500">Certifications issued</span>
            <div className="w-[40px] h-[40px] rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Award className="w-[26px] h-[26px]" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-900 tabular-nums">912</div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="inline-flex items-center text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                <ArrowUpRight className="w-3 h-3" /> +8.1%
              </span>
              <span className="text-[11px] text-slate-400">from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-500">Assessments completed</span>
            <div className="w-[40px] h-[40px] rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-[26px] h-[26px]" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-900 tabular-nums">5,870</div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="inline-flex items-center text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                <ArrowUpRight className="w-3 h-3" /> +15.2%
              </span>
              <span className="text-[11px] text-slate-400">from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-500">Participation rate</span>
            <div className="w-[40px] h-[40px] rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-[26px] h-[26px]" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-900 tabular-nums">78%</div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="inline-flex items-center text-[11px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                <ArrowDownRight className="w-3 h-3" /> -2.3%
              </span>
              <span className="text-[11px] text-slate-400">from last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. THE 4 ALTERED SECTIONS (Accurately translated from the user's specification) */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.62fr)_minmax(0,1fr)] gap-3.5 items-start">
        {/* SECTION 1: Enrollments and completions */}
        <section className="bg-white rounded-[20px] p-[22px_22px_20px] border border-slate-200/80 shadow-2xs min-w-0">
          <div className="flex justify-between items-start gap-2.5">
            <div>
              <h2 className="text-[17px] font-bold text-[#14162b] tracking-[-0.01em]">
                Enrollments and completions
              </h2>
              <p className="mt-[3px] text-[#6b6f8a] text-[12px]">
                Track learner activity by <b className="font-medium text-[#3b41e3]">month</b>
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 bg-[#f1f2fb] hover:bg-[#e7e9f7] rounded-[12px] px-3 py-2 text-[12px] font-medium text-[#14162b] transition-colors cursor-pointer select-none"
            >
              <span>{enrollmentTimeframe}</span>
              <svg className="w-2.5 h-2.5" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path d="M2 3.5l3 3 3-3" />
              </svg>
            </button>
          </div>

          <div className="flex gap-4 my-4 mb-2 text-[#6b6f8a] text-[12px]">
            <span className="flex items-center">
              <i className="inline-block w-2 h-2 rounded-full mr-1.5 bg-[#dfe1ee]" />
              Enrollments
            </span>
            <span className="flex items-center">
              <i className="inline-block w-2 h-2 rounded-full mr-1.5 bg-[#3b41e3]" />
              Completions
            </span>
          </div>

          {/* SVG Chart with dynamic Hover Tooltip */}
          <div className="relative pt-2">
            {/* Active Tooltip */}
            {activeTooltipIndex !== null && (() => {
              const d = BAR_DATA[activeTooltipIndex];
              const cx = L + gw * activeTooltipIndex + gw / 2;
              const h1 = (ph * d.enrolled) / max;
              const topY = T + ph - h1;
              return (
                <div
                  className="absolute pointer-events-none bg-[#14162b] text-white rounded-[10px] px-3 py-2 text-[12px] font-semibold leading-[1.7] -translate-x-1/2 -translate-y-full z-20 whitespace-nowrap shadow-lg transition-all duration-150 after:content-[''] after:absolute after:left-1/2 after:-bottom-[5px] after:w-2.5 after:h-2.5 after:bg-[#14162b] after:-translate-x-1/2 after:rotate-45 after:rounded-[2px]"
                  style={{
                    left: `${(cx / W) * 100}%`,
                    top: `${(topY / H) * 100 - 3}%`,
                  }}
                >
                  <div className="flex items-center">
                    <i className="inline-block w-[7px] h-[7px] rounded-full mr-[7px] bg-white" />
                    {d.enrolled} Enrolled
                  </div>
                  <div className="flex items-center">
                    <i className="inline-block w-[7px] h-[7px] rounded-full mr-[7px] bg-[#5b61ee]" />
                    {d.completed} Completed
                  </div>
                </div>
              );
            })()}

            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block overflow-visible">
              {/* Y Axis ticks: 0, 200, 400, 600 */}
              {[0, 200, 400, 600].map((val) => {
                const y = T + ph - (ph * val) / max;
                return (
                  <g key={val}>
                    <line
                      x1={L}
                      y1={y}
                      x2={W}
                      y2={y}
                      stroke="#eceef6"
                      strokeWidth="1"
                    />
                    <text x={0} y={y + 4} fontSize={11} fill="#6b6f8a">
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Monthly Dual Capsule Bars */}
              {BAR_DATA.map((d, i) => {
                const cx = L + gw * i + gw / 2;
                const h1 = (ph * d.enrolled) / max;
                const h2 = (ph * d.completed) / max;
                const isHovered = activeTooltipIndex === i;

                return (
                  <g
                    key={d.month}
                    className="cursor-pointer outline-hidden"
                    onMouseEnter={() => setActiveTooltipIndex(i)}
                    onClick={() => setActiveTooltipIndex(i)}
                  >
                    {/* Transparent touch/click trigger area */}
                    <rect
                      x={cx - gw / 2}
                      y={T}
                      width={gw}
                      height={ph + B}
                      fill="transparent"
                    />

                    {/* Enrolled Bar (rounded capsule) */}
                    <rect
                      x={cx - bw - 2}
                      y={T + ph - h1}
                      width={bw}
                      height={h1}
                      rx={bw / 2}
                      fill={isHovered ? '#cfd2e3' : '#dfe1ee'}
                      className="transition-colors"
                    />

                    {/* Completed Bar (rounded capsule) */}
                    <rect
                      x={cx + 2}
                      y={T + ph - h2}
                      width={bw}
                      height={h2}
                      rx={bw / 2}
                      fill={isHovered ? '#2d33c9' : '#3b41e3'}
                      className="transition-colors"
                    />

                    {/* Month Label */}
                    <text
                      x={cx}
                      y={H - 6}
                      textAnchor="middle"
                      fontSize={11}
                      fontWeight={isHovered ? '600' : '400'}
                      fill={isHovered ? '#14162b' : '#6b6f8a'}
                    >
                      {d.month}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </section>

        {/* SECTION 2: Competency building */}
        <section className="bg-white rounded-[20px] p-[22px_22px_20px] border border-slate-200/80 shadow-2xs min-w-0">
          <div className="flex justify-between items-start gap-2.5">
            <div>
              <h2 className="text-[17px] font-bold text-[#14162b] tracking-[-0.01em]">
                Competency building
              </h2>
              <p className="mt-[3px] text-[#6b6f8a] text-[12px]">Current level by subject</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 bg-[#f1f2fb] hover:bg-[#e7e9f7] rounded-[12px] px-3 py-2 text-[12px] font-medium text-[#14162b] transition-colors cursor-pointer select-none"
            >
              <span>Today</span>
              <svg className="w-2.5 h-2.5" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path d="M2 3.5l3 3 3-3" />
              </svg>
            </button>
          </div>

          {/* Triple-Ring 270deg Gauge opening at the bottom */}
          <div className="w-[190px] my-3.5 mx-auto relative">
            <svg viewBox="0 0 200 200" className="block w-full" role="img" aria-label="Average capacity 58 percent">
              {gaugeRings.map((ring) => {
                const C = 2 * Math.PI * ring.r;
                const sweep = C * 0.75; // 270 degree arc
                const filledLen = (sweep * ring.val) / 100;
                return (
                  <g key={ring.r}>
                    {/* Track ring */}
                    <circle
                      cx="100"
                      cy="100"
                      r={ring.r}
                      fill="none"
                      stroke="#e3e5f3"
                      strokeWidth="15"
                      strokeLinecap="round"
                      strokeDasharray={`${sweep} ${C}`}
                      transform="rotate(135 100 100)"
                    />
                    {/* Filled value ring */}
                    <circle
                      cx="100"
                      cy="100"
                      r={ring.r}
                      fill="none"
                      stroke={ring.color}
                      strokeWidth="15"
                      strokeLinecap="round"
                      strokeDasharray={`${filledLen} ${C}`}
                      transform="rotate(135 100 100)"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Central Capacity Readout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pb-1.5 pointer-events-none">
              <strong className="text-[26px] font-semibold tracking-[-0.02em] text-[#14162b]">
                58%
              </strong>
              <span className="text-[9px] text-[#6b6f8a] -mt-0.5">Avg. capacity</span>
            </div>
          </div>

          {/* Top 3 Label after circular gauge */}
          <div className="flex items-center justify-between pt-2 pb-1 border-t border-[#eceef6]">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Top 3 Competencies</span>
            <span className="text-[10px] text-slate-400 font-medium">Ranked by completion</span>
          </div>

          {/* Subject Rows (Top 3) */}
          <div className="divide-y divide-[#eceef6]">
            {/* Forecasting */}
            <div className="flex items-center gap-3 py-[9px]">
              <div className="w-[30px] h-[30px] rounded-full bg-[#f1f2fb] flex items-center justify-center text-[#6b6f8a] shrink-0">
                <svg className="w-[15px] h-[15px]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="8" cy="8" r="6" />
                  <circle cx="8" cy="8" r="2.5" fill="currentColor" />
                </svg>
              </div>
              <div className="flex-1 font-semibold text-[12.5px] text-[#14162b]">Forecasting</div>
              <div className="font-semibold text-[12.5px] mr-1.5 text-[#14162b]">72%</div>
              <div className="text-[11px] font-semibold rounded-[8px] py-1 px-[7px] min-w-[48px] text-center bg-[#d6f5df] text-[#1e8a4c]">
                +1.8%
              </div>
            </div>

            {/* Radar analysis */}
            <div className="flex items-center gap-3 py-[9px]">
              <div className="w-[30px] h-[30px] rounded-full bg-[#f1f2fb] flex items-center justify-center text-[#6b6f8a] shrink-0">
                <svg className="w-[15px] h-[15px]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M3 13V3M3 13h10M6 10V8M9 10V5M12 10V7" />
                </svg>
              </div>
              <div className="flex-1 font-semibold text-[12.5px] text-[#14162b]">Radar analysis</div>
              <div className="font-semibold text-[12.5px] mr-1.5 text-[#14162b]">58%</div>
              <div className="text-[11px] font-semibold rounded-[8px] py-1 px-[7px] min-w-[48px] text-center bg-[#d6f5df] text-[#1e8a4c]">
                +2.3%
              </div>
            </div>

            {/* Cyclone tracking */}
            <div className="flex items-center gap-3 py-[9px]">
              <div className="w-[30px] h-[30px] rounded-full bg-[#f1f2fb] flex items-center justify-center text-[#6b6f8a] shrink-0">
                <svg className="w-[15px] h-[15px]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
              </div>
              <div className="flex-1 font-semibold text-[12.5px] text-[#14162b]">Cyclone tracking</div>
              <div className="font-semibold text-[12.5px] mr-1.5 text-[#14162b]">49%</div>
              <div className="text-[11px] font-semibold rounded-[8px] py-1 px-[7px] min-w-[48px] text-center bg-[#fddada] text-[#f0525b]">
                -1.0%
              </div>
            </div>
          </div>

          {/* View fully link redirecting to Competency Page */}
          <div className="pt-3 mt-1 border-t border-[#eceef6] text-center">
            <button
              type="button"
              onClick={() => onNavigateTab('competency')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3b41e3] hover:text-[#282ec4] transition-colors cursor-pointer group"
            >
              <span>View fully</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </section>

        {/* SECTION 3: Course monitoring */}
        <section className="bg-white rounded-[20px] p-[22px_22px_20px] border border-slate-200/80 shadow-2xs min-w-0">
          <div className="flex justify-between items-start gap-2.5">
            <div>
              <h2 className="text-[17px] font-bold text-[#14162b] tracking-[-0.01em]">
                Course monitoring
              </h2>
              <p className="mt-[3px] text-[#6b6f8a] text-[12px]">Active courses that need attention first</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 bg-[#f1f2fb] hover:bg-[#e7e9f7] rounded-[12px] px-3 py-2 text-[12px] font-medium text-[#14162b] transition-colors cursor-pointer select-none"
            >
              <span>{courseFilter}</span>
              <svg className="w-2.5 h-2.5" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path d="M2 3.5l3 3 3-3" />
              </svg>
            </button>
          </div>

          <div className="overflow-x-auto mt-3.5">
            <table className="w-full border-collapse min-w-[520px]">
              <thead>
                <tr>
                  <th className="text-left font-medium text-[#6b6f8a] text-[12px] py-3 border-y border-[#eceef6]">Course</th>
                  <th className="text-left font-medium text-[#6b6f8a] text-[12px] py-3 border-y border-[#eceef6]">Trainer</th>
                  <th className="text-left font-medium text-[#6b6f8a] text-[12px] py-3 border-y border-[#eceef6]">Enrolled</th>
                  <th className="text-left font-medium text-[#6b6f8a] text-[12px] py-3 border-y border-[#eceef6]">Completion</th>
                  <th className="text-left font-medium text-[#6b6f8a] text-[12px] py-3 border-y border-[#eceef6]">Status</th>
                </tr>
              </thead>
              <tbody>
                {/* Cyclone Track Analysis */}
                <tr className="border-b border-[#eceef6]">
                  <td className="py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-[30px] h-[30px] rounded-full grid place-items-center text-[10px] font-bold shrink-0 bg-[#fde8cf] text-[#b8680f]">
                        CT
                      </div>
                      <div>
                        <b className="block text-[12.5px] font-semibold text-[#14162b]">Cyclone Track Analysis</b>
                        <small className="text-[#6b6f8a] text-[11px]">Meteorology</small>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 text-[#14162b] font-medium text-[12.5px]">Dr. Ravi Menon</td>
                  <td className="py-3.5 text-[#14162b] font-medium text-[12.5px]">214</td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-[5px] bg-[#e3e5f3] rounded-[3px] overflow-hidden">
                        <i className="block h-full bg-[#3b41e3] rounded-[3px]" style={{ width: '38%' }} />
                      </div>
                      <span className="text-[#6b6f8a] text-[11px]">38%</span>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <span className="inline-flex items-center gap-1.5 rounded-[8px] py-1 px-2.5 text-[11px] font-semibold bg-[#fdebd0] text-[#c9791a] before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-current">
                      Behind
                    </span>
                  </td>
                </tr>

                {/* Numerical Weather Models */}
                <tr className="border-b border-[#eceef6]">
                  <td className="py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-[30px] h-[30px] rounded-full grid place-items-center text-[10px] font-bold shrink-0 bg-[#dfe1ff] text-[#3b41e3]">
                        NW
                      </div>
                      <div>
                        <b className="block text-[12.5px] font-semibold text-[#14162b]">Numerical Weather Models</b>
                        <small className="text-[#6b6f8a] text-[11px]">Forecasting</small>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 text-[#14162b] font-medium text-[12.5px]">Dr. Anita Rao</td>
                  <td className="py-3.5 text-[#14162b] font-medium text-[12.5px]">356</td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-[5px] bg-[#e3e5f3] rounded-[3px] overflow-hidden">
                        <i className="block h-full bg-[#3b41e3] rounded-[3px]" style={{ width: '47%' }} />
                      </div>
                      <span className="text-[#6b6f8a] text-[11px]">47%</span>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <span className="inline-flex items-center gap-1.5 rounded-[8px] py-1 px-2.5 text-[11px] font-semibold bg-[#fdebd0] text-[#c9791a] before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-current">
                      Behind
                    </span>
                  </td>
                </tr>

                {/* Climate Data Handling */}
                <tr className="border-b border-[#eceef6]">
                  <td className="py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-[30px] h-[30px] rounded-full grid place-items-center text-[10px] font-bold shrink-0 bg-[#d9e4ff] text-[#2f4fd0]">
                        CD
                      </div>
                      <div>
                        <b className="block text-[12.5px] font-semibold text-[#14162b]">Climate Data Handling</b>
                        <small className="text-[#6b6f8a] text-[11px]">Climatology</small>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 text-[#14162b] font-medium text-[12.5px]">Prof. Sunil Das</td>
                  <td className="py-3.5 text-[#14162b] font-medium text-[12.5px]">298</td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-[5px] bg-[#e3e5f3] rounded-[3px] overflow-hidden">
                        <i className="block h-full bg-[#3b41e3] rounded-[3px]" style={{ width: '76%' }} />
                      </div>
                      <span className="text-[#6b6f8a] text-[11px]">76%</span>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <span className="inline-flex items-center gap-1.5 rounded-[8px] py-1 px-2.5 text-[11px] font-semibold bg-[#d6f5df] text-[#1e8a4c] before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-current">
                      On track
                    </span>
                  </td>
                </tr>

                {/* Radar Data Quality */}
                <tr>
                  <td className="py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-[30px] h-[30px] rounded-full grid place-items-center text-[10px] font-bold shrink-0 bg-[#fddcdc] text-[#d03a3a]">
                        RD
                      </div>
                      <div>
                        <b className="block text-[12.5px] font-semibold text-[#14162b]">Radar Data Quality</b>
                        <small className="text-[#6b6f8a] text-[11px]">Instrumentation</small>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 text-[#14162b] font-medium text-[12.5px]">Meera Iyer</td>
                  <td className="py-3.5 text-[#14162b] font-medium text-[12.5px]">187</td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-[5px] bg-[#e3e5f3] rounded-[3px] overflow-hidden">
                        <i className="block h-full bg-[#3b41e3] rounded-[3px]" style={{ width: '44%' }} />
                      </div>
                      <span className="text-[#6b6f8a] text-[11px]">44%</span>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <span className="inline-flex items-center gap-1.5 rounded-[8px] py-1 px-2.5 text-[11px] font-semibold bg-[#fdebd0] text-[#c9791a] before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-current">
                      Behind
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 4: Participation by division (Dynamic Circles Generation & Placement) */}
        <section className="bg-white rounded-[20px] p-[22px_22px_20px] border border-slate-200/80 shadow-2xs min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[17px] font-bold text-[#14162b] tracking-[-0.01em]">
                Participation by division
              </h2>
              <p className="mt-[3px] text-[#6b6f8a] text-[12px]">Active trainees per region</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleQuickNextArrival}
                className="text-[11px] font-semibold bg-[#eef0fc] hover:bg-[#e0e3fa] text-[#3b41e3] px-2 py-1 rounded-full flex items-center gap-1 transition-colors cursor-pointer select-none"
                title="Simulate 1 new division arriving"
              >
                <Plus className="w-3 h-3" />
                <span>+ Arrive</span>
              </button>
              <span className="text-[11px] font-semibold bg-[#f1f2fb] text-[#3b41e3] px-2.5 py-1 rounded-full select-none">
                {divisions.length} Divisions
              </span>
            </div>
          </div>

          {/* Bubbles aspect ratio visualization: Dynamic generation & organic placement */}
          <div className="relative aspect-[150/118] my-3.5 mx-auto max-w-[300px]">
            {divisions.map((d, index) => {
              const placement = getBubblePlacement(index, d.count, divisions.length);
              const isHovered = hoveredDivisionId === d.id;
              return (
                <div
                  key={d.id}
                  onMouseEnter={() => setHoveredDivisionId(d.id)}
                  onMouseLeave={() => setHoveredDivisionId(null)}
                  className={`absolute rounded-full grid place-items-center text-white font-semibold border-2 border-white box-border shadow-md transition-all duration-300 cursor-pointer select-none ${
                    isHovered ? 'scale-110 z-30 ring-2 ring-blue-500' : 'hover:scale-105'
                  }`}
                  style={{
                    ...placement,
                    background: d.color,
                  }}
                  title={`${d.name}: ${d.count} trainees (${d.change})`}
                >
                  <span className="tabular-nums select-none">{d.count}</span>
                  {/* Floating tooltip on hover */}
                  {isHovered && (
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 pointer-events-none bg-[#14162b] text-white text-[10px] font-semibold py-0.5 px-2 rounded-md whitespace-nowrap shadow-xl z-40 animate-in fade-in zoom-in-95 duration-100">
                      {d.name}: {d.count} ({d.change})
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Top 4 Label after circle bars */}
          <div className="flex items-center justify-between pt-2 pb-1 border-t border-[#eceef6]">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Top 4 Divisions</span>
            <span className="text-[10px] text-slate-400 font-medium">Ranked by trainees</span>
          </div>

          {/* Region Rows (Top 4 in dashboard) */}
          <div className="divide-y divide-[#eceef6]">
            {divisions.slice(0, 4).map((d) => (
              <div key={d.id} className="flex items-center gap-3 py-[9px]">
                <div
                  className="w-[30px] h-[30px] rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${d.color}18`, color: d.color }}
                >
                  <svg
                    className="w-[15px] h-[15px]"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  >
                    <circle cx="6" cy="6" r="2.3" />
                    <path d="M1.8 13c.4-2.4 2.2-3.6 4.2-3.6s3.8 1.2 4.2 3.6M11 4.2a2 2 0 010 3.8M12 9.6c1.4.4 2.2 1.5 2.4 3.2" />
                  </svg>
                </div>
                <div className="flex-1 font-semibold text-[12.5px] text-[#14162b] truncate">
                  {d.name}
                </div>
                <div className="font-semibold text-[12.5px] mr-1.5 text-[#14162b] tabular-nums">
                  {d.count}
                </div>
                <div
                  className={`text-[11px] font-semibold rounded-[8px] py-1 px-[7px] min-w-[48px] text-center ${
                    d.isPositive ? 'bg-[#d6f5df] text-[#1e8a4c]' : 'bg-[#fddada] text-[#f0525b]'
                  }`}
                >
                  {d.change}
                </div>
              </div>
            ))}
          </div>

          {/* View fully link redirecting to Analytics Page */}
          <div className="pt-3 mt-1 border-t border-[#eceef6] text-center">
            <button
              type="button"
              onClick={() => onNavigateTab('analytics')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3b41e3] hover:text-[#282ec4] transition-colors cursor-pointer group"
            >
              <span>View fully</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </section>
      </div>

      {/* Floating Widget to test new divisions arriving dynamically per user request */}
      <div className="fixed bottom-6 left-6 lg:left-72 z-40 select-none">
        {isTestWidgetOpen ? (
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-4 w-[330px] text-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Division Circles Simulator</span>
              </div>
              <button
                type="button"
                onClick={() => setIsTestWidgetOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-slate-500 mb-2.5 leading-relaxed">
              Test dynamic creation and organic placement of division circles as new regional data arrives:
            </p>

            {/* Quick Auto Stream Simulator */}
            <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 rounded-xl p-2 mb-3">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isAutoStreaming ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
                  }`}
                />
                <span className="font-semibold text-slate-700 text-[11px]">
                  {isAutoStreaming ? 'Auto-streaming arrivals' : 'Stream simulator'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsAutoStreaming(!isAutoStreaming)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors cursor-pointer ${
                  isAutoStreaming
                    ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isAutoStreaming ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{isAutoStreaming ? 'Stop' : 'Start auto'}</span>
              </button>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5 mb-3">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                <span>Simulate New Arrivals</span>
                <span className="text-slate-400 font-normal">Click to arrive</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 max-h-[110px] overflow-y-auto pr-0.5">
                {SAMPLE_PRESETS.map((preset) => {
                  const alreadyAdded = divisions.some((d) => d.name === preset.name);
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      disabled={alreadyAdded}
                      onClick={() => handleAddPreset(preset)}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-left font-medium transition-colors ${
                        alreadyAdded
                          ? 'border-emerald-200 bg-emerald-50/60 text-emerald-800 opacity-70 cursor-default'
                          : 'border-slate-200/80 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 text-slate-700 hover:text-blue-700 cursor-pointer'
                      }`}
                    >
                      <span className="truncate">{preset.name}</span>
                      <span className="font-bold text-[10px]">
                        {alreadyAdded ? '✓' : `+${preset.count}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Addition Form */}
            <form onSubmit={handleAddCustom} className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Division name"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                />
                <input
                  type="number"
                  placeholder="Count"
                  value={customCount}
                  onChange={(e) => setCustomCount(e.target.value)}
                  className="w-20 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create & Place Circle</span>
              </button>
            </form>

            {/* Reset & Active Summary */}
            <div className="pt-2.5 mt-2.5 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">
                {divisions.length} circles placed
              </span>
              <button
                type="button"
                onClick={handleResetDivisions}
                className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to default 4</span>
              </button>
            </div>
          </div>
        ) : (
          /* Floating Pill with Instant Quick Arrive */
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleQuickNextArrival}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-full shadow-xl text-xs font-semibold cursor-pointer transition-all hover:scale-105 active:scale-95"
              title="Instantly create and place next arriving division circle"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Quick Arrive</span>
            </button>
            <button
              type="button"
              onClick={() => setIsTestWidgetOpen(true)}
              className="flex items-center gap-2 bg-[#14162b] hover:bg-slate-900 text-white px-3.5 py-2 rounded-full shadow-xl border border-slate-700/60 backdrop-blur-md text-xs font-medium cursor-pointer transition-all hover:scale-105 active:scale-95"
              title="Open dynamic division circles test simulator"
            >
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="font-semibold">Test Circles ({divisions.length})</span>
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
