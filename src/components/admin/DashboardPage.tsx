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
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  X,
  ArrowRight,
  Pin,
  Calendar,
  FileText,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { AdminTab } from '../../types';
import { useAdminData } from '../../context/AdminDataContext';
import { ScrollDrivenTable } from './ScrollDrivenTable';
import { DashboardAnnouncementCard } from '../common/DashboardAnnouncementCard';

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
  const { pinnedAnnouncement, announcements, pendingApprovals, approveUser, rejectUser } = useAdminData();
  const [enrollmentTimeframe, setEnrollmentTimeframe] = useState('This year');
  const [enrollmentMenuOpen, setEnrollmentMenuOpen] = useState(false);
  const [competencyTimeframe, setCompetencyTimeframe] = useState('Today');
  const [competencyMenuOpen, setCompetencyMenuOpen] = useState(false);
  const [courseFilter, setCourseFilter] = useState('This month');
  const [courseMenuOpen, setCourseMenuOpen] = useState(false);
  const [activeTooltipIndex, setActiveTooltipIndex] = useState<number | null>(3); // Default to Aug as in snippet

  // Multiple announcements carousel with looping functionality
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const activeAnnouncements = announcements.length > 0 ? announcements : (pinnedAnnouncement ? [pinnedAnnouncement] : []);
  const heroAnn = activeAnnouncements.length > 0
    ? activeAnnouncements[announcementIndex % activeAnnouncements.length]
    : pinnedAnnouncement || announcements[0];

  const handleNextAnnouncement = () => {
    if (activeAnnouncements.length <= 1) return;
    setAnnouncementIndex((prev) => (prev + 1) % activeAnnouncements.length);
  };

  const handlePrevAnnouncement = () => {
    if (activeAnnouncements.length <= 1) return;
    setAnnouncementIndex((prev) => (prev - 1 + activeAnnouncements.length) % activeAnnouncements.length);
  };

  // Automated one-to-one loop interval
  useEffect(() => {
    if (activeAnnouncements.length <= 1) return;
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % activeAnnouncements.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [activeAnnouncements.length]);

  // Dynamic divisions state for participation bubbles
  const [divisions, setDivisions] = useState<DivisionItem[]>(INITIAL_DIVISIONS);
  const [hoveredDivisionId, setHoveredDivisionId] = useState<string | null>(null);

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



  return (
    <div className="w-full max-w-full min-w-0 space-y-4 sm:space-y-6">
      {/* ======================================================== */}
      {/* 1. TOP SECTION: Announcement Card (Left) + Management (Right) */}
      {/* Layout strictly conforms to Screenshot_2026-10-19_204608_6bbe42ed.png */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
        {/* Left: Large Announcement Card (7 cols) with Multiple Announcements Carousel & Looping */}
        <DashboardAnnouncementCard
          onViewAnnouncement={() => onNavigateTab('announcements')}
          showToast={showToast}
          className="lg:col-span-7"
        />

        {/* Right: Role Management Updates Card (Top) + 3 Management Cards (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-3.5 sm:gap-4">
          {/* Top Card: Role Management Updates for Faster Approval */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-[#3b41e3] flex items-center justify-center font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                    Role Management Updates
                  </h3>
                  <span className="text-[11px] text-slate-400 font-normal">
                    Pending elevation & clearance requests
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  {pendingApprovals.length} Pending
                </span>
                <button
                  type="button"
                  onClick={() => onNavigateTab('role-management')}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors cursor-pointer"
                  title="Open Role Management"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Approval Drawer/List item */}
            {pendingApprovals.length > 0 ? (
              <div className="space-y-2 pt-1">
                {pendingApprovals.slice(0, 1).map((req) => (
                  <div
                    key={req.id}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-slate-800">{req.name}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({req.division})</span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-blue-100/70 text-blue-700 rounded">
                          Req: {req.roleRequested}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                        {req.email} · {req.submitted}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          rejectUser(req.id, 'Deferred by Administrator');
                          showToast(`Declined elevation for ${req.name}.`);
                        }}
                        className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer border border-slate-200"
                      >
                        Reject
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          approveUser(req.id);
                          showToast(`Approved ${req.name} as ${req.roleRequested}. Portal access granted.`);
                        }}
                        className="px-3 py-1 text-[11px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Approve</span>
                      </button>
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-slate-400">
                    {pendingApprovals.length > 1
                      ? `+${pendingApprovals.length - 1} more officers awaiting review`
                      : 'Priority request ready for approval'}
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigateTab('role-management')}
                    className="font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View all in Role Management</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between text-xs text-emerald-800">
                <span className="font-medium">All role privileges are verified and up to date.</span>
                <button
                  type="button"
                  onClick={() => onNavigateTab('role-management')}
                  className="font-semibold underline text-emerald-900 cursor-pointer"
                >
                  Manage Roles
                </button>
              </div>
            )}
          </div>

          {/* Top 2 Cards: Course Management & Trainer Management */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            {/* 1. Course Management */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] text-slate-500 font-normal">Course management</span>
                <button
                  type="button"
                  onClick={() => onNavigateTab('courses')}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
                  title="View courses"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="my-1.5 sm:my-2">
                <div className="text-[24px] sm:text-[30px] font-semibold text-slate-900 tracking-tight leading-none">
                  36 <span className="text-sm font-normal text-slate-400">/ 48</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs mt-2">
                  <span className="text-emerald-600 font-medium">↗ 75%</span>
                  <span className="text-slate-400">active courses</span>
                </div>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex mt-2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full w-[75%]" />
                <div className="bg-slate-200 h-full w-[25%]" />
              </div>
            </div>

            {/* 2. Trainer Management */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] text-slate-500 font-normal">Trainer management</span>
                <button
                  type="button"
                  onClick={() => onNavigateTab('trainers')}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
                  title="View trainers"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="my-1.5 sm:my-2">
                <div className="text-[24px] sm:text-[30px] font-semibold text-slate-900 tracking-tight leading-none">
                  54 <span className="text-sm font-normal text-slate-400">/ 62</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs mt-2">
                  <span className="text-emerald-600 font-medium">↗ 87%</span>
                  <span className="text-slate-400">active trainers</span>
                </div>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex mt-2">
                <div className="bg-blue-600 h-full w-[87%]" />
                <div className="bg-slate-200 h-full w-[13%]" />
              </div>
            </div>
          </div>

          {/* Bottom Card: Trainee Management (spans across both columns) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] text-slate-500 font-normal">Trainee management</span>
              <button
                type="button"
                onClick={() => onNavigateTab('trainees')}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
                title="View trainees"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="my-1.5 sm:my-2">
              <div className="text-[24px] sm:text-[30px] font-semibold text-slate-900 tracking-tight leading-none">
                1,096 <span className="text-sm font-normal text-slate-400">/ 1,284</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-600 font-medium">↗ 85%</span>
                  <span className="text-slate-400">active trainees</span>
                </div>
                <span className="text-slate-400">188 inactive</span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex mt-2">
              <div className="bg-blue-600 h-full w-[85%]" />
              <div className="bg-slate-200 h-full w-[15%]" />
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. Four KTG Metric Cards (Responsive across all viewports: mobile, tablet, and desktop) */}
      {/* Project-specific IMD Meteorological Capacity Building Metrics */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5 w-full">
        {/* Card 1: Active Trainee Meteorologists */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between min-h-[160px] sm:min-h-[175px] w-full hover:border-slate-300 transition-all">
          <div className="flex items-start justify-between">
            <span className="text-[13px] sm:text-[14px] text-slate-500 font-normal">Active Trainee Officers</span>
            <div className="w-9 h-9 sm:w-[40px] sm:h-[40px] rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 sm:w-[26px] sm:h-[26px]" />
            </div>
          </div>
          <div className="my-1.5 sm:my-2">
            <div className="text-2xl sm:text-[32px] lg:text-[36px] font-semibold text-slate-900 tracking-tight leading-none">
              1,096
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-emerald-600 font-medium">↗ 12%</span>
            <span className="text-slate-400 font-normal">across 36 Regional Centers</span>
          </div>
        </div>

        {/* Card 2: Certified Competency Rate */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between min-h-[160px] sm:min-h-[175px] w-full hover:border-slate-300 transition-all">
          <div className="flex items-start justify-between">
            <span className="text-[13px] sm:text-[14px] text-slate-500 font-normal">Certified Competency Rate</span>
            <div className="w-9 h-9 sm:w-[40px] sm:h-[40px] rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 sm:w-[26px] sm:h-[26px]" />
            </div>
          </div>
          <div className="my-1.5 sm:my-2">
            <div className="text-2xl sm:text-[32px] lg:text-[36px] font-semibold text-slate-900 tracking-tight leading-none">
              84.6%
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-emerald-600 font-medium">↗ 6.2%</span>
            <span className="text-slate-400 font-normal">vs MoES national benchmark</span>
          </div>
        </div>

        {/* Card 3: Evaluations & Assessments Cleared */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between min-h-[160px] sm:min-h-[175px] w-full hover:border-slate-300 transition-all">
          <div className="flex items-start justify-between">
            <span className="text-[13px] sm:text-[14px] text-slate-500 font-normal">Evaluations Cleared</span>
            <div className="w-9 h-9 sm:w-[40px] sm:h-[40px] rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 sm:w-[26px] sm:h-[26px]" />
            </div>
          </div>
          <div className="my-1.5 sm:my-2">
            <div className="text-2xl sm:text-[32px] lg:text-[36px] font-semibold text-slate-900 tracking-tight leading-none">
              348
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-emerald-600 font-medium">↗ 18%</span>
            <span className="text-slate-400 font-normal">Doppler & NWP tests passed</span>
          </div>
        </div>

        {/* Card 4: Operational Radar Network Readiness */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between min-h-[160px] sm:min-h-[175px] w-full hover:border-slate-300 transition-all">
          <div className="flex items-start justify-between">
            <span className="text-[13px] sm:text-[14px] text-slate-500 font-normal">Operational Radar Readiness</span>
            <div className="w-9 h-9 sm:w-[40px] sm:h-[40px] rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 sm:w-[26px] sm:h-[26px]" />
            </div>
          </div>
          <div className="my-1.5 sm:my-2">
            <div className="text-2xl sm:text-[32px] lg:text-[36px] font-semibold text-slate-900 tracking-tight leading-none">
              98.4%
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-emerald-600 font-medium">↗ 2.1%</span>
            <span className="text-slate-400 font-normal">32 Coastal Doppler Stations</span>
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
            {/* Functional Timeframe Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setEnrollmentMenuOpen(!enrollmentMenuOpen)}
                className="inline-flex items-center gap-2 bg-[#f1f2fb] hover:bg-[#e7e9f7] rounded-[12px] px-3 py-2 text-[12px] font-medium text-[#14162b] transition-colors cursor-pointer select-none"
              >
                <span>{enrollmentTimeframe}</span>
                <ChevronDown className={`w-3 h-3 text-[#6b6f8a] transition-transform ${enrollmentMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {enrollmentMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 text-xs animate-in fade-in zoom-in-95 duration-100">
                  {['This year', 'Last 6 months', 'All time'].map((tf) => (
                    <button
                      key={tf}
                      type="button"
                      onClick={() => {
                        setEnrollmentTimeframe(tf);
                        setEnrollmentMenuOpen(false);
                        showToast(`Filtered enrollment data for ${tf}.`);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 transition-colors cursor-pointer ${
                        enrollmentTimeframe === tf ? 'font-bold text-blue-600 bg-blue-50/50' : 'text-slate-700'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              )}
            </div>
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
            {/* Functional Competency Timeframe Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCompetencyMenuOpen(!competencyMenuOpen)}
                className="inline-flex items-center gap-2 bg-[#f1f2fb] hover:bg-[#e7e9f7] rounded-[12px] px-3 py-2 text-[12px] font-medium text-[#14162b] transition-colors cursor-pointer select-none"
              >
                <span>{competencyTimeframe}</span>
                <ChevronDown className={`w-3 h-3 text-[#6b6f8a] transition-transform ${competencyMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {competencyMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-32 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 text-xs animate-in fade-in zoom-in-95 duration-100">
                  {['Today', 'This week', 'This month'].map((tf) => (
                    <button
                      key={tf}
                      type="button"
                      onClick={() => {
                        setCompetencyTimeframe(tf);
                        setCompetencyMenuOpen(false);
                        showToast(`Competency level filtered by ${tf}.`);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 transition-colors cursor-pointer ${
                        competencyTimeframe === tf ? 'font-bold text-blue-600 bg-blue-50/50' : 'text-slate-700'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              )}
            </div>
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
            <div className="relative">
              <button
                type="button"
                onClick={() => setCourseMenuOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 bg-[#f1f2fb] hover:bg-[#e7e9f7] rounded-[12px] px-3 py-2 text-[12px] font-medium text-[#14162b] transition-colors cursor-pointer select-none"
              >
                <span>{courseFilter}</span>
                <svg className="w-2.5 h-2.5" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M2 3.5l3 3 3-3" />
                </svg>
              </button>
              {courseMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setCourseMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1.5 w-36 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                    {['This month', 'Needs attention', 'All courses', 'Quarter to date'].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setCourseFilter(opt);
                          setCourseMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs font-medium transition-colors ${
                          courseFilter === opt ? 'bg-indigo-50 text-[#3b41e3]' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

            <ScrollDrivenTable className="mt-3.5" minWidth="min-w-[680px]">
            <table className="w-full border-collapse min-w-[680px]">
              <thead>
                <tr>
                  <th className="text-left font-medium text-[#6b6f8a] text-[12px] py-3 px-4 sm:px-5 whitespace-nowrap min-w-[220px] border-y border-[#eceef6]">Course</th>
                  <th className="text-left font-medium text-[#6b6f8a] text-[12px] py-3 px-4 sm:px-5 whitespace-nowrap min-w-[140px] border-y border-[#eceef6]">Trainer</th>
                  <th className="text-left font-medium text-[#6b6f8a] text-[12px] py-3 px-4 sm:px-5 whitespace-nowrap min-w-[90px] border-y border-[#eceef6]">Enrolled</th>
                  <th className="text-left font-medium text-[#6b6f8a] text-[12px] py-3 px-4 sm:px-5 whitespace-nowrap min-w-[130px] border-y border-[#eceef6]">Completion</th>
                  <th className="text-left font-medium text-[#6b6f8a] text-[12px] py-3 px-4 sm:px-5 whitespace-nowrap min-w-[100px] border-y border-[#eceef6]">Status</th>
                </tr>
              </thead>
              <tbody>
                {/* Cyclone Track Analysis */}
                <tr className="border-b border-[#eceef6] hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
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
                  <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap text-[#14162b] font-medium text-[12.5px]">Dr. Ravi Menon</td>
                  <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap text-[#14162b] font-medium text-[12.5px]">214</td>
                  <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-12 h-[5px] bg-[#e3e5f3] rounded-[3px] overflow-hidden">
                        <i className="block h-full bg-[#3b41e3] rounded-[3px]" style={{ width: '38%' }} />
                      </div>
                      <span className="text-[#6b6f8a] text-[11px]">38%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 rounded-[8px] py-1 px-2.5 text-[11px] font-semibold bg-[#fdebd0] text-[#c9791a] before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-current">
                      Behind
                    </span>
                  </td>
                </tr>

                {/* Numerical Weather Models */}
                <tr className="border-b border-[#eceef6] hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
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
                  <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap text-[#14162b] font-medium text-[12.5px]">Dr. Anita Rao</td>
                  <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap text-[#14162b] font-medium text-[12.5px]">356</td>
                  <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-12 h-[5px] bg-[#e3e5f3] rounded-[3px] overflow-hidden">
                        <i className="block h-full bg-[#3b41e3] rounded-[3px]" style={{ width: '47%' }} />
                      </div>
                      <span className="text-[#6b6f8a] text-[11px]">47%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 rounded-[8px] py-1 px-2.5 text-[11px] font-semibold bg-[#fdebd0] text-[#c9791a] before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-current">
                      Behind
                    </span>
                  </td>
                </tr>

                {/* Climate Data Handling */}
                <tr className="border-b border-[#eceef6] hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
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
                  <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap text-[#14162b] font-medium text-[12.5px]">Prof. Sunil Das</td>
                  <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap text-[#14162b] font-medium text-[12.5px]">298</td>
                  <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-12 h-[5px] bg-[#e3e5f3] rounded-[3px] overflow-hidden">
                        <i className="block h-full bg-[#3b41e3] rounded-[3px]" style={{ width: '76%' }} />
                      </div>
                      <span className="text-[#6b6f8a] text-[11px]">76%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 rounded-[8px] py-1 px-2.5 text-[11px] font-semibold bg-[#d6f5df] text-[#1e8a4c] before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-current">
                      On track
                    </span>
                  </td>
                </tr>

                {/* Radar Data Quality */}
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
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
                  <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap text-[#14162b] font-medium text-[12.5px]">Meera Iyer</td>
                  <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap text-[#14162b] font-medium text-[12.5px]">187</td>
                  <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-12 h-[5px] bg-[#e3e5f3] rounded-[3px] overflow-hidden">
                        <i className="block h-full bg-[#3b41e3] rounded-[3px]" style={{ width: '44%' }} />
                      </div>
                      <span className="text-[#6b6f8a] text-[11px]">44%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 rounded-[8px] py-1 px-2.5 text-[11px] font-semibold bg-[#fdebd0] text-[#c9791a] before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-current">
                      Behind
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </ScrollDrivenTable>
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
    </div>
  );
};
