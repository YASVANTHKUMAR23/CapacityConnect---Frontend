import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Layers,
  BookOpen,
  Upload,
  X,
  Plus,
  Trash2,
  Globe,
  BarChart2,
  HelpCircle,
  FileText,
  Video,
  Presentation,
  Lock,
  Play,
  GripVertical,
  ChevronDown,
  ChevronRight,
  Download,
  MoreVertical,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Image as ImageIcon,
  Code,
  Zap,
  Sparkles,
  Eye,
  Send,
  AlertCircle,
  Share2,
} from 'lucide-react';
import { TrainerCourse } from '../../types';

interface TrainerCreateCourseWizardProps {
  onCancel: () => void;
  onCourseCreated: (course: TrainerCourse) => void;
  showToast: (msg: string) => void;
  initialCourse?: TrainerCourse | null;
  onCourseUpdated?: (course: TrainerCourse) => void;
}

interface ResourceItem {
  id: string;
  name: string;
  type: 'pdf' | 'ppt' | 'xls';
  size: string;
}

interface LessonItem {
  id: string;
  num: string;
  title: string;
  type: 'text' | 'video' | 'quiz' | 'presentation';
  duration: string;
  completed?: boolean;
  locked?: boolean;
  contentHeading?: string;
  contentBody?: string;
  keyTakeaways?: string[];
  resources: ResourceItem[];
}

interface ModuleItem {
  id: string;
  code: string;
  title: string;
  lessonsCount: number;
  completed?: boolean;
  isExpanded?: boolean;
  lessons: LessonItem[];
}

export const TrainerCreateCourseWizard: React.FC<TrainerCreateCourseWizardProps> = ({
  onCancel,
  onCourseCreated,
  showToast,
  initialCourse,
  onCourseUpdated,
}) => {
  // Stepper: 1: Basic Details, 2: Course Structure, 3: Review & Publish
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // STEP 1 STATE: Basic Details
  const [courseTitle, setCourseTitle] = useState(
    initialCourse?.title || 'Cyclone Track Analysis & Dvorak Technique'
  );
  const [courseCategory, setCourseCategory] = useState(
    initialCourse?.category || 'Meteorology'
  );
  const [courseLevel, setCourseLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(
    (initialCourse?.level as any) || 'Intermediate'
  );
  const [courseLanguage, setCourseLanguage] = useState('English');
  const [shortDescription, setShortDescription] = useState(
    initialCourse?.description ||
      'A hands-on training course on cyclone tracking, intensity estimation and the Dvorak technique using satellite and observational data.'
  );
  const [learningObjectives, setLearningObjectives] = useState<string[]>([
    'Understand the structure and evolution of tropical cyclones.',
    'Apply the Dvorak technique for intensity estimation.',
    'Analyze satellite and model data for track forecasting.',
  ]);
  const [newObjective, setNewObjective] = useState('');
  const [isAddingObjective, setIsAddingObjective] = useState(false);

  // Thumbnail & Details
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(
    '/assets/aistudio/Screenshot_2026-10-19_204608_6bbe42ed.png'
  );
  const [durationHours, setDurationHours] = useState(initialCourse?.duration || '24 Hours');
  const [modulesCount, setModulesCount] = useState(initialCourse?.modulesCount || 6);
  const [estimatedLessons, setEstimatedLessons] = useState(
    initialCourse ? initialCourse.modulesCount * 4 : 24
  );
  const [tags, setTags] = useState<string[]>(['Cyclone', 'Dvorak', 'Satellite', 'Forecasting']);
  const [newTagInput, setNewTagInput] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);

  // STEP 2 STATE: Course Structure & Content
  const [modules, setModules] = useState<ModuleItem[]>([
    {
      id: 'mod-1',
      code: 'M1',
      title: 'Introduction to Cyclones',
      lessonsCount: 4,
      completed: true,
      isExpanded: false,
      lessons: [
        {
          id: 'l-1-1',
          num: '1.1',
          title: 'Thermodynamics of Tropical Cyclones',
          type: 'text',
          duration: '35 mins',
          completed: true,
          contentHeading: 'Thermodynamics of Tropical Cyclones',
          contentBody: 'Examines energy flux from warm sea surfaces and boundary layer convergence fueling cyclogenesis.',
          keyTakeaways: ['SST > 26.5°C is essential', 'Latent heat release fuels the vortex'],
          resources: [{ id: 'r-1', name: 'Thermo_Basics.pdf', type: 'pdf', size: '2.1 MB' }],
        },
      ],
    },
    {
      id: 'mod-2',
      code: 'M2',
      title: 'Meteorological Observations',
      lessonsCount: 4,
      completed: true,
      isExpanded: false,
      lessons: [
        {
          id: 'l-2-1',
          num: '2.1',
          title: 'Surface and Buoy Observations in North Indian Ocean',
          type: 'text',
          duration: '45 mins',
          completed: true,
          contentHeading: 'Surface & Marine Observational Arrays',
          contentBody: 'Real-time observation integration with RAMA buoys, coastal AWS and ship reports.',
          keyTakeaways: ['High temporal cadence surface pressure falls indicate vortex proximity.'],
          resources: [{ id: 'r-2', name: 'Observational_SOP.pdf', type: 'pdf', size: '1.8 MB' }],
        },
      ],
    },
    {
      id: 'mod-3',
      code: 'M3',
      title: 'Track Forecasting',
      lessonsCount: 4,
      completed: false,
      isExpanded: true,
      lessons: [
        {
          id: 'l-3-1',
          num: '3.1',
          title: 'Track forecasting - Overview',
          type: 'text',
          duration: '30 mins',
          completed: true,
          contentHeading: 'Synoptic Steering & Environmental Flows',
          contentBody: 'Subtropical ridges and mid-tropospheric steering currents controlling storm transit vectors.',
          keyTakeaways: ['500 hPa geopotential height contours govern deep-layer steering.'],
          resources: [{ id: 'r-3-1', name: 'Steering_Flow_Guide.pdf', type: 'pdf', size: '2.4 MB' }],
        },
        {
          id: 'l-3-2',
          num: '3.2',
          title: 'Numerical models for track prediction',
          type: 'text',
          duration: '45 mins',
          completed: false,
          contentHeading: 'Numerical models for track prediction',
          contentBody:
            'Numerical Weather Prediction (NWP) models are used to estimate the future track of a tropical cyclone by solving the governing equations of atmospheric motion. These models assimilate observational data and generate forecast guidance at different lead times.',
          keyTakeaways: [
            'NWP models predict cyclone track, intensity and structure.',
            'Common models: GFS, ECMWF, HWRF and IMD-GFS.',
            'Ensemble forecasting helps to quantify uncertainty.',
          ],
          resources: [
            { id: 'r-3-2-a', name: 'NWP_Models_Overview.pdf', type: 'pdf', size: '3.4 MB' },
            { id: 'r-3-2-b', name: 'Model_Comparison.pptx', type: 'ppt', size: '5.8 MB' },
            { id: 'r-3-2-c', name: 'Track_Forecast_Data.xlsx', type: 'xls', size: '1.2 MB' },
          ],
        },
        {
          id: 'l-3-3',
          num: '3.3',
          title: 'Ensemble forecasting & uncertainty',
          type: 'video',
          duration: '40 mins',
          locked: true,
          contentHeading: 'Ensemble Prediction Systems (EPS)',
          contentBody: 'Probabilistic track cones and strike probability maps derived from GEFS and ECMWF-EPS.',
          keyTakeaways: ['Ensemble spread indicates forecast confidence horizon.'],
          resources: [],
        },
        {
          id: 'l-3-4',
          num: '3.4',
          title: 'Case study - Recent cyclone',
          type: 'presentation',
          duration: '50 mins',
          locked: true,
          contentHeading: 'Post-Event Verification of Very Severe Cyclonic Storm',
          contentBody: 'Operational case breakdown comparing track error envelopes and landfall point verification.',
          keyTakeaways: ['Multi-model consensus beats single deterministic runs.'],
          resources: [],
        },
      ],
    },
    {
      id: 'mod-4',
      code: 'M4',
      title: 'Dvorak Technique',
      lessonsCount: 4,
      completed: false,
      isExpanded: false,
      lessons: [
        {
          id: 'l-4-1',
          num: '4.1',
          title: 'Enhanced Infrared (EIR) & T-Number Assignment',
          type: 'text',
          duration: '45 mins',
          contentHeading: 'Dvorak EIR Curve Analysis',
          contentBody: 'Classification of CDO, curved band, and eye patterns using standardized temperature scales.',
          keyTakeaways: ['T-number correlates with central pressure and sustained surface winds.'],
          resources: [{ id: 'r-4-1', name: 'Dvorak_Manual_WMO.pdf', type: 'pdf', size: '4.2 MB' }],
        },
      ],
    },
    {
      id: 'mod-5',
      code: 'M5',
      title: 'Data Analysis & Interpretation',
      lessonsCount: 3,
      completed: false,
      isExpanded: false,
      lessons: [
        {
          id: 'l-5-1',
          num: '5.1',
          title: 'Doppler Radar Radial Velocity & Reflectivity Products',
          type: 'text',
          duration: '40 mins',
          contentHeading: 'Radar Eyewall Structure Interpretation',
          contentBody: 'Deciphering mesocyclone signatures, velocity doublets, and spiral band rainfall rates.',
          keyTakeaways: ['DWR provides critical velocity signatures during 24h pre-landfall.'],
          resources: [],
        },
      ],
    },
    {
      id: 'mod-6',
      code: 'M6',
      title: 'Assessment & Final Quiz',
      lessonsCount: 2,
      completed: false,
      isExpanded: false,
      lessons: [
        {
          id: 'l-6-1',
          num: '6.1',
          title: 'Operational Track Forecast Simulation Test',
          type: 'quiz',
          duration: '60 mins',
          contentHeading: 'Operational Evaluation Assessment',
          contentBody: 'Comprehensive simulation test requiring trainees to issue track bulletins from raw data.',
          keyTakeaways: ['Minimum 70% passing score required for competency certification.'],
          resources: [],
        },
      ],
    },
  ]);

  const [activeModuleId, setActiveModuleId] = useState<string>('mod-3');
  const [activeLessonId, setActiveLessonId] = useState<string>('l-3-2');

  // Active Lesson Editor State
  const activeModule = modules.find((m) => m.id === activeModuleId) || modules[0];
  const activeLesson =
    activeModule?.lessons.find((l) => l.id === activeLessonId) || activeModule?.lessons[0];

  const [lessonTitle, setLessonTitle] = useState(
    activeLesson?.title || 'Numerical models for track prediction'
  );
  const [lessonType, setLessonType] = useState<'text' | 'video' | 'quiz' | 'presentation'>(
    activeLesson?.type || 'text'
  );
  const [lessonHeading, setLessonHeading] = useState(
    activeLesson?.contentHeading || 'Numerical models for track prediction'
  );
  const [lessonBody, setLessonBody] = useState(
    activeLesson?.contentBody ||
      'Numerical Weather Prediction (NWP) models are used to estimate the future track of a tropical cyclone by solving the governing equations of atmospheric motion. These models assimilate observational data and generate forecast guidance at different lead times.'
  );
  const [lessonTakeaways, setLessonTakeaways] = useState<string[]>(
    activeLesson?.keyTakeaways || [
      'NWP models predict cyclone track, intensity and structure.',
      'Common models: GFS, ECMWF, HWRF and IMD-GFS.',
      'Ensemble forecasting helps to quantify uncertainty.',
    ]
  );
  const [lessonResources, setLessonResources] = useState<ResourceItem[]>(
    activeLesson?.resources || [
      { id: 'r-3-2-a', name: 'NWP_Models_Overview.pdf', type: 'pdf', size: '3.4 MB' },
      { id: 'r-3-2-b', name: 'Model_Comparison.pptx', type: 'ppt', size: '5.8 MB' },
      { id: 'r-3-2-c', name: 'Track_Forecast_Data.xlsx', type: 'xls', size: '1.2 MB' },
    ]
  );

  // New Resource modal/prompt
  const [isAddingResource, setIsAddingResource] = useState(false);
  const [newResourceName, setNewResourceName] = useState('');
  const [newResourceType, setNewResourceType] = useState<'pdf' | 'ppt' | 'xls'>('pdf');

  // New Module prompt
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');

  // Switch active lesson
  const handleSelectLesson = (moduleId: string, lesson: LessonItem) => {
    setActiveModuleId(moduleId);
    setActiveLessonId(lesson.id);
    setLessonTitle(lesson.title);
    setLessonType(lesson.type);
    setLessonHeading(lesson.contentHeading || lesson.title);
    setLessonBody(
      lesson.contentBody ||
        'Comprehensive operational curriculum lesson notes and meteorological principles.'
    );
    setLessonTakeaways(
      lesson.keyTakeaways || [
        'Understand synoptic context and radar/satellite integration.',
        'Follow IMD standard operational procedure.',
      ]
    );
    setLessonResources(lesson.resources || []);
  };

  // Toggle Module expansion
  const handleToggleModule = (modId: string) => {
    setModules((prev) =>
      prev.map((m) => (m.id === modId ? { ...m, isExpanded: !m.isExpanded } : m))
    );
  };

  // Add objective
  const handleAddObjective = () => {
    if (newObjective.trim()) {
      setLearningObjectives((prev) => [...prev, newObjective.trim()]);
      setNewObjective('');
      setIsAddingObjective(false);
    }
  };

  // Add tag
  const handleAddTag = () => {
    if (newTagInput.trim()) {
      setTags((prev) => [...prev, newTagInput.trim()]);
      setNewTagInput('');
      setIsAddingTag(false);
    }
  };

  // Remove tag
  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  // Add Module
  const handleCreateModule = () => {
    if (!newModuleTitle.trim()) return;
    const newMod: ModuleItem = {
      id: `mod-${Date.now()}`,
      code: `M${modules.length + 1}`,
      title: newModuleTitle.trim(),
      lessonsCount: 1,
      isExpanded: true,
      lessons: [
        {
          id: `l-${Date.now()}-1`,
          num: `${modules.length + 1}.1`,
          title: `${newModuleTitle.trim()} - Fundamentals`,
          type: 'text',
          duration: '30 mins',
          resources: [],
        },
      ],
    };
    setModules((prev) => [...prev, newMod]);
    setModulesCount((prev) => prev + 1);
    setEstimatedLessons((prev) => prev + 1);
    setNewModuleTitle('');
    setIsAddingModule(false);
    showToast(`Module "${newMod.title}" added to course.`);
  };

  // Add Resource
  const handleAddResourceItem = () => {
    if (!newResourceName.trim()) return;
    const newRes: ResourceItem = {
      id: `res-${Date.now()}`,
      name: newResourceName.endsWith(`.${newResourceType}`)
        ? newResourceName
        : `${newResourceName}.${newResourceType}`,
      type: newResourceType,
      size: `${(Math.random() * 4 + 1).toFixed(1)} MB`,
    };
    setLessonResources((prev) => [...prev, newRes]);
    setNewResourceName('');
    setIsAddingResource(false);
    showToast(`Attached ${newRes.name} to lesson.`);
  };

  // Save Final Course
  const handlePublishCourse = (status: 'Active' | 'Draft') => {
    const finalCourseObj: TrainerCourse = {
      id: initialCourse?.id || `tc-${Date.now()}`,
      code: initialCourse?.code || `MET-${Math.floor(100 + Math.random() * 900)}`,
      title: courseTitle,
      category: courseCategory,
      enrolled: initialCourse?.enrolled || 0,
      completed: initialCourse?.completed || 0,
      completionRate: initialCourse?.completionRate || (status === 'Active' ? 100 : 45),
      rating: initialCourse?.rating || 5.0,
      status: status,
      lastUpdated: 'Just now',
      description: shortDescription,
      level: courseLevel,
      duration: durationHours,
      modulesCount: modules.length,
      modules: modules.map((m) => ({
        id: m.id,
        title: `${m.code}: ${m.title}`,
        description: `Comprehensive operational curriculum module covering ${m.title}.`,
        duration: '4 hrs',
        status: status === 'Active' ? 'Published' : 'Draft',
        lessons: m.lessons.map((l) => ({
          id: l.id,
          title: l.title,
          type: l.type === 'presentation' ? 'presentation' : l.type === 'quiz' ? 'quiz' : l.type === 'video' ? 'video' : 'document',
          duration: l.duration,
        })),
      })),
    };

    if (initialCourse && onCourseUpdated) {
      onCourseUpdated(finalCourseObj);
    } else {
      onCourseCreated(finalCourseObj);
    }

    showToast(
      status === 'Active'
        ? `Course "${courseTitle}" published successfully to the portal!`
        : `Course "${courseTitle}" saved as Draft.`
    );
  };

  return (
    <div className="w-full max-w-full xl:max-w-[1580px] 2xl:max-w-[1720px] mx-auto space-y-6 font-sans antialiased text-slate-900 animate-in fade-in duration-200">
      {/* Top Bar: Back & Breadcrumb + Page Title + Stepper */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div className="flex items-start sm:items-center gap-3">
          {/* Back button */}
          <button
            type="button"
            onClick={() => {
              if (currentStep === 1) onCancel();
              else if (currentStep === 2) setCurrentStep(1);
              else setCurrentStep(2);
            }}
            className="w-9 h-9 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:bg-slate-50 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all cursor-pointer shrink-0 mt-0.5 sm:mt-0"
            title="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            {/* Breadcrumb matching image */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium select-none mb-0.5">
              <span className="hover:text-slate-600 cursor-pointer" onClick={onCancel}>
                Courses
              </span>
              <span>›</span>
              {currentStep === 1 ? (
                <span className="text-slate-700 font-semibold">Create New Course</span>
              ) : currentStep === 2 ? (
                <>
                  <span
                    className="hover:text-slate-600 cursor-pointer truncate max-w-[200px]"
                    onClick={() => setCurrentStep(1)}
                  >
                    {courseTitle}
                  </span>
                  <span>›</span>
                  <span className="text-slate-700 font-semibold">Course Structure</span>
                </>
              ) : (
                <>
                  <span
                    className="hover:text-slate-600 cursor-pointer truncate max-w-[200px]"
                    onClick={() => setCurrentStep(1)}
                  >
                    {courseTitle}
                  </span>
                  <span>›</span>
                  <span className="text-slate-700 font-semibold">Review & Publish</span>
                </>
              )}
            </div>

            {/* Title & subtitle */}
            <h1 className="text-xl sm:text-2xl lg:text-[26px] font-bold text-slate-900 tracking-tight leading-tight">
              {currentStep === 1 && 'Create New Course'}
              {currentStep === 2 && 'Add Course Content'}
              {currentStep === 3 && 'Review & Publish Course'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-normal">
              {currentStep === 1 &&
                'Design and publish a training course for IMD capacity building.'}
              {currentStep === 2 && 'Build modules, add lessons and learning materials.'}
              {currentStep === 3 &&
                'Verify curriculum structure, target audience, and publish live to portal.'}
            </p>
          </div>
        </div>

        {/* Stepper matching screenshot */}
        <div className="flex items-center gap-2 sm:gap-3 bg-white px-3 sm:px-4 py-2 rounded-2xl border border-slate-200/90 shadow-2xs self-start md:self-auto overflow-x-auto max-w-full">
          {/* Step 1 Pill */}
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className="flex items-center gap-2 cursor-pointer text-xs select-none"
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                currentStep === 1
                  ? 'bg-blue-600 text-white shadow-xs'
                  : currentStep > 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {currentStep > 1 ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : '1'}
            </span>
            <span
              className={`font-semibold whitespace-nowrap ${
                currentStep === 1 ? 'text-blue-600' : 'text-slate-700'
              }`}
            >
              Basic Details
            </span>
          </button>

          <span className="text-slate-200">›</span>

          {/* Step 2 Pill */}
          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            className="flex items-center gap-2 cursor-pointer text-xs select-none"
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                currentStep === 2
                  ? 'bg-blue-600 text-white shadow-xs'
                  : currentStep > 2
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {currentStep > 2 ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : '2'}
            </span>
            <span
              className={`font-semibold whitespace-nowrap ${
                currentStep === 2
                  ? 'text-blue-600'
                  : currentStep > 2
                  ? 'text-slate-700'
                  : 'text-slate-400'
              }`}
            >
              Course Structure
            </span>
          </button>

          <span className="text-slate-200">›</span>

          {/* Step 3 Pill */}
          <button
            type="button"
            onClick={() => setCurrentStep(3)}
            className="flex items-center gap-2 cursor-pointer text-xs select-none"
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                currentStep === 3
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              3
            </span>
            <span
              className={`font-semibold whitespace-nowrap ${
                currentStep === 3 ? 'text-blue-600' : 'text-slate-400'
              }`}
            >
              Review & Publish
            </span>
          </button>
        </div>
      </div>

      {/* STEP 1: BASIC DETAILS (SCREEN 1 in image_19f552a6.png) */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Course Information (lg:col-span-7) */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs space-y-5">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Course Information
              </h2>

              {/* Course Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Course Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="e.g. Cyclone Track Analysis & Dvorak Technique"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all shadow-xs font-medium"
                />
              </div>

              {/* Category, Level, Language in a 3-column row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={courseCategory}
                      onChange={(e) => setCourseCategory(e.target.value)}
                      className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all shadow-xs appearance-none cursor-pointer font-medium"
                    >
                      <option value="Meteorology">Meteorology</option>
                      <option value="Tropical Meteorology">Tropical Meteorology</option>
                      <option value="Observational Met">Observational Met</option>
                      <option value="Synoptic Meteorology">Synoptic Meteorology</option>
                      <option value="Remote Sensing">Remote Sensing</option>
                      <option value="Aviation Met">Aviation Met</option>
                    </select>
                    <Globe className="w-4 h-4 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Level */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Level <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={courseLevel}
                      onChange={(e) => setCourseLevel(e.target.value as any)}
                      className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all shadow-xs appearance-none cursor-pointer font-medium"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                    <BarChart2 className="w-4 h-4 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Language <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={courseLanguage}
                      onChange={(e) => setCourseLanguage(e.target.value)}
                      className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all shadow-xs appearance-none cursor-pointer font-medium"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Bilingual (EN & HI)">Bilingual (EN & HI)</option>
                    </select>
                    <Globe className="w-4 h-4 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Short Description <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    maxLength={250}
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="Provide a concise curriculum summary..."
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all shadow-xs resize-none"
                  />
                  <span className="absolute right-3 bottom-2.5 text-[11px] text-slate-400 font-medium select-none">
                    {shortDescription.length} / 250
                  </span>
                </div>
              </div>

              {/* Learning Objectives with checkmarks matching image */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Learning Objectives <span className="text-rose-500">*</span>
                </label>
                <div className="border border-slate-200/90 rounded-xl bg-white shadow-2xs divide-y divide-slate-100 overflow-hidden mb-3">
                  {learningObjectives.map((obj, idx) => (
                    <div
                      key={idx}
                      className="p-3 sm:px-4 flex items-center justify-between gap-3 text-xs sm:text-sm text-slate-800 group hover:bg-slate-50/60 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </span>
                        <span className="font-medium text-slate-800">{obj}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setLearningObjectives((prev) => prev.filter((_, i) => i !== idx))
                        }
                        className="text-slate-300 hover:text-rose-600 p-1 rounded-md transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Remove objective"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {isAddingObjective ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      autoFocus
                      value={newObjective}
                      onChange={(e) => setNewObjective(e.target.value)}
                      placeholder="Add learning objective..."
                      onKeyDown={(e) => e.key === 'Enter' && handleAddObjective()}
                      className="flex-1 px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-blue-600 shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddObjective}
                      className="px-3.5 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 cursor-pointer shadow-xs"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingObjective(false)}
                      className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsAddingObjective(true)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Objective</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Course Thumbnail & Details (lg:col-span-5) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Course Thumbnail Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Course Thumbnail <span className="text-rose-500">*</span>
                </h2>

                {/* Thumbnail Preview Banner */}
                <div className="relative w-full aspect-16/9 rounded-xl overflow-hidden bg-slate-900 border border-slate-200/90 shadow-2xs group">
                  <img
                    src={thumbnailUrl}
                    alt="Course Thumbnail"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Upload & Remove buttons */}
                <div className="flex items-center gap-3">
                  <label className="flex-1 py-2.5 px-4 bg-white border border-slate-200/90 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs">
                    <Upload className="w-4 h-4 text-blue-600" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const url = URL.createObjectURL(e.target.files[0]);
                          setThumbnailUrl(url);
                          showToast('Thumbnail artwork updated.');
                        }
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setThumbnailUrl('/assets/aistudio/Screenshot_2026-10-19_204608_6bbe42ed.png');
                      showToast('Thumbnail reset to default.');
                    }}
                    className="py-2.5 px-4 bg-white border border-slate-200/90 hover:bg-rose-50 hover:text-rose-600 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Recommended: 16:9 ratio (1280 × 720), JPG or PNG (max 5 MB)
                </p>
              </div>

              {/* Course Details Card (Duration, Modules, Lessons, Tags) */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Course Details
                </h2>

                {/* Metrics 3-Col row */}
                <div className="grid grid-cols-3 gap-3">
                  {/* Duration */}
                  <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10.5px] font-medium text-slate-400 block leading-tight">
                        Duration *
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-800">
                        {durationHours}
                      </span>
                    </div>
                  </div>

                  {/* Modules */}
                  <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10.5px] font-medium text-slate-400 block leading-tight">
                        Modules *
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-800">
                        {modulesCount}
                      </span>
                    </div>
                  </div>

                  {/* Estimated Lessons */}
                  <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10.5px] font-medium text-slate-400 block leading-tight">
                        Estimated Lessons
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-800">
                        {estimatedLessons}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tags section matching image */}
                <div>
                  <span className="text-xs font-semibold text-slate-700 block mb-2">
                    • Tags
                  </span>
                  <div className="flex flex-wrap gap-2 items-center">
                    {tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-blue-400 hover:text-blue-700 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}

                    {isAddingTag ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          autoFocus
                          value={newTagInput}
                          onChange={(e) => setNewTagInput(e.target.value)}
                          placeholder="Tag name"
                          onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                          className="px-2.5 py-1 bg-white border border-slate-300 rounded-full text-xs text-slate-800 w-24 focus:outline-hidden focus:border-blue-600"
                        />
                        <button
                          type="button"
                          onClick={handleAddTag}
                          className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs font-medium"
                        >
                          Add
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsAddingTag(true)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-blue-600 bg-white border border-blue-200 hover:bg-blue-50 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Tag</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/80">
            <button
              type="button"
              onClick={() => handlePublishCourse('Draft')}
              className="px-5 py-2.5 bg-white border border-slate-200/90 hover:bg-slate-50 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => {
                if (!courseTitle.trim()) {
                  showToast('Please provide a course title.');
                  return;
                }
                setCurrentStep(2);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <span>Next: Course Structure</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: COURSE STRUCTURE (SCREEN 2 in image_19f552a6.png) */}
      {currentStep === 2 && (
        <div className="space-y-6">
          {/* 3-Column Wide Desktop Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 4 Cols: Course Structure List */}
            <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                    Course Structure
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {modules.length} Modules · {modules.reduce((acc, m) => acc + m.lessonsCount, 0)}{' '}
                    Lessons
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingModule(true)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Module</span>
                </button>
              </div>

              {/* Add Module Prompt */}
              {isAddingModule && (
                <div className="p-3 bg-blue-50/50 border border-blue-200/80 rounded-xl space-y-2">
                  <span className="text-xs font-semibold text-blue-900 block">
                    Create New Curriculum Module
                  </span>
                  <input
                    type="text"
                    autoFocus
                    value={newModuleTitle}
                    onChange={(e) => setNewModuleTitle(e.target.value)}
                    placeholder="e.g. Radar Analysis & Interpretation"
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateModule()}
                    className="w-full px-3 py-1.5 bg-white border border-blue-300 rounded-lg text-xs text-slate-900 focus:outline-hidden"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingModule(false)}
                      className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-800 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleCreateModule}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 cursor-pointer"
                    >
                      Create
                    </button>
                  </div>
                </div>
              )}

              {/* Module List matching screenshot */}
              <div className="space-y-2">
                {modules.map((mod) => {
                  const isModActive = mod.id === activeModuleId;
                  const isExpanded = mod.isExpanded;

                  return (
                    <div
                      key={mod.id}
                      className="rounded-xl border border-slate-200/90 overflow-hidden shadow-2xs"
                    >
                      {/* Module Header Bar */}
                      <div
                        onClick={() => {
                          setActiveModuleId(mod.id);
                          handleToggleModule(mod.id);
                        }}
                        className={`p-3 flex items-center justify-between gap-2.5 cursor-pointer transition-colors select-none ${
                          isModActive
                            ? 'bg-blue-600 text-white'
                            : 'bg-white hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <GripVertical
                            className={`w-3.5 h-3.5 ${
                              isModActive ? 'text-blue-200' : 'text-slate-400'
                            }`}
                          />
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              isModActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {mod.code}
                          </span>
                          <span className="font-semibold text-xs truncate">{mod.title}</span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`text-[11px] font-medium ${
                              isModActive ? 'text-blue-100' : 'text-slate-400'
                            }`}
                          >
                            {mod.lessonsCount} Lessons
                          </span>
                          {mod.completed ? (
                            <span
                              className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                                isModActive ? 'bg-white text-blue-600' : 'bg-emerald-100 text-emerald-600'
                              }`}
                            >
                              ✓
                            </span>
                          ) : (
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                isExpanded ? 'rotate-180' : ''
                              } ${isModActive ? 'text-white' : 'text-slate-400'}`}
                            />
                          )}
                        </div>
                      </div>

                      {/* Nested Lessons (Expanded) */}
                      {isExpanded && (
                        <div className="bg-slate-50/80 p-2 space-y-1.5 border-t border-slate-100">
                          {mod.lessons.map((les) => {
                            const isLesActive = les.id === activeLessonId;
                            return (
                              <div
                                key={les.id}
                                onClick={() => handleSelectLesson(mod.id, les)}
                                className={`p-2.5 rounded-lg flex items-center justify-between text-xs cursor-pointer transition-all ${
                                  isLesActive
                                    ? 'bg-blue-50 border border-blue-200 text-blue-700 font-semibold shadow-2xs'
                                    : 'bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  {les.locked ? (
                                    <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  ) : isLesActive ? (
                                    <Play className="w-3.5 h-3.5 text-blue-600 fill-blue-600 shrink-0" />
                                  ) : (
                                    <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  )}
                                  <span className="truncate">
                                    {les.num} {les.title}
                                  </span>
                                </div>
                                {les.completed && (
                                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[2.5]" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Middle 5 Cols: Lesson Details & Content Editor */}
            <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                  Lesson Details
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Add content for the selected lesson.
                </p>
              </div>

              {/* Lesson Title & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-8">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lesson Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 font-medium focus:outline-hidden focus:border-blue-600 shadow-2xs"
                  />
                </div>
                <div className="sm:col-span-4">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lesson Type <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={lessonType}
                      onChange={(e) => setLessonType(e.target.value as any)}
                      className="w-full pl-8 pr-7 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 font-medium focus:outline-hidden focus:border-blue-600 shadow-2xs appearance-none cursor-pointer"
                    >
                      <option value="text">Text Lesson</option>
                      <option value="video">Video Lesson</option>
                      <option value="presentation">Presentation</option>
                      <option value="quiz">Interactive Quiz</option>
                    </select>
                    <FileText className="w-3.5 h-3.5 text-blue-600 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Rich Content Editor matching screenshot */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Content Editor
                </label>

                {/* Toolbar */}
                <div className="p-1.5 bg-slate-50 border border-slate-200 rounded-t-xl flex items-center gap-1 flex-wrap text-slate-600 text-xs select-none">
                  <span className="font-semibold text-slate-700 px-2 py-1 bg-white border border-slate-200/80 rounded text-[11px] flex items-center gap-1 cursor-pointer">
                    Normal <ChevronDown className="w-3 h-3 text-slate-400" />
                  </span>
                  <div className="w-px h-4 bg-slate-200 mx-1" />
                  <button
                    type="button"
                    className="p-1.5 hover:bg-white rounded hover:text-slate-900 font-bold"
                    title="Bold"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    className="p-1.5 hover:bg-white rounded hover:text-slate-900 italic"
                    title="Italic"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    className="p-1.5 hover:bg-white rounded hover:text-slate-900 underline"
                    title="Underline"
                  >
                    <Underline className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-px h-4 bg-slate-200 mx-1" />
                  <button
                    type="button"
                    className="p-1.5 hover:bg-white rounded hover:text-slate-900"
                    title="Bullet List"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    className="p-1.5 hover:bg-white rounded hover:text-slate-900"
                    title="Numbered List"
                  >
                    <ListOrdered className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-px h-4 bg-slate-200 mx-1" />
                  <button
                    type="button"
                    className="p-1.5 hover:bg-white rounded hover:text-slate-900"
                    title="Link"
                  >
                    <Link className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    className="p-1.5 hover:bg-white rounded hover:text-slate-900"
                    title="Image"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    className="p-1.5 hover:bg-white rounded hover:text-slate-900"
                    title="Code"
                  >
                    <Code className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Editable Content Canvas */}
                <div className="border border-t-0 border-slate-200 rounded-b-xl p-4 bg-white space-y-3 min-h-[260px]">
                  <input
                    type="text"
                    value={lessonHeading}
                    onChange={(e) => setLessonHeading(e.target.value)}
                    className="w-full font-bold text-base text-slate-900 outline-hidden border-b border-transparent hover:border-slate-200 focus:border-blue-600 transition-colors"
                  />
                  <textarea
                    rows={4}
                    value={lessonBody}
                    onChange={(e) => setLessonBody(e.target.value)}
                    className="w-full text-xs text-slate-600 leading-relaxed outline-hidden resize-none border border-transparent hover:border-slate-200 focus:border-blue-600 rounded p-1 transition-colors"
                  />

                  {/* Highlight Callout Box: Key Takeaways */}
                  <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl space-y-2">
                    <div className="flex items-center gap-1.5 text-blue-900 font-bold text-xs">
                      <Zap className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
                      <span>Key Takeaways</span>
                    </div>
                    <ul className="space-y-1 text-[11.5px] text-slate-700 list-disc list-inside">
                      {lessonTakeaways.map((item, idx) => (
                        <li key={idx} className="leading-snug">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 3 Cols: Lesson Resources */}
            <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                  Lesson Resources
                </h2>
                <span className="text-xs text-slate-400">
                  {lessonResources.length} files
                </span>
              </div>

              {/* Resource Files List matching screenshot */}
              <div className="space-y-2.5">
                {lessonResources.map((res) => (
                  <div
                    key={res.id}
                    className="p-3 bg-white border border-slate-200/90 hover:border-slate-300 rounded-xl flex items-center justify-between shadow-2xs group transition-all"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-7 h-7 rounded-lg text-[10px] font-bold flex items-center justify-center shrink-0 uppercase ${
                          res.type === 'pdf'
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : res.type === 'ppt'
                            ? 'bg-amber-50 text-amber-600 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        }`}
                      >
                        {res.type}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">
                          {res.name}
                        </p>
                        <p className="text-[10px] text-slate-400">{res.size}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => showToast(`Downloading ${res.name}...`)}
                        className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors cursor-pointer"
                        title="Download file"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setLessonResources((prev) => prev.filter((r) => r.id !== res.id))
                        }
                        className="p-1 text-slate-300 hover:text-rose-600 rounded transition-colors cursor-pointer"
                        title="Delete resource"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Resource */}
              {isAddingResource ? (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                  <span className="text-xs font-semibold text-slate-800 block">Attach Resource</span>
                  <input
                    type="text"
                    value={newResourceName}
                    onChange={(e) => setNewResourceName(e.target.value)}
                    placeholder="Document or dataset name"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-hidden"
                  />
                  <div className="flex items-center gap-2">
                    <select
                      value={newResourceType}
                      onChange={(e) => setNewResourceType(e.target.value as any)}
                      className="px-2 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800"
                    >
                      <option value="pdf">PDF Document</option>
                      <option value="ppt">PowerPoint (PPT)</option>
                      <option value="xls">Spreadsheet (XLS)</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleAddResourceItem}
                      className="ml-auto px-2.5 py-1 bg-blue-600 text-white rounded text-xs font-semibold"
                    >
                      Attach
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingResource(true)}
                  className="w-full py-2.5 border border-dashed border-slate-300 hover:border-blue-400 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-600 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Resource</span>
                </button>
              )}
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200/80">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 bg-white border border-slate-200/90 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Details</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handlePublishCourse('Draft')}
                className="px-4 py-2 bg-white border border-slate-200/90 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => showToast('Displaying lesson preview player...')}
                className="px-4 py-2 bg-white border border-slate-200/90 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>Preview</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(3);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <span>Next: Review & Publish</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: REVIEW & PUBLISH */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 8 Cols: Comprehensive Course Summary */}
            <div className="lg:col-span-8 space-y-6">
              {/* Course Overview Banner Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                  <div className="w-full sm:w-48 aspect-16/9 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-100 shadow-2xs">
                    <img
                      src={thumbnailUrl}
                      alt={courseTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                        {courseCategory}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {courseLevel}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {courseLanguage}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 leading-snug">
                      {courseTitle}
                    </h2>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {shortDescription}
                    </p>
                  </div>
                </div>

                {/* Metrics bar */}
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Estimated Hours</span>
                    <strong className="text-slate-800 text-sm font-semibold">{durationHours}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Curriculum Depth</span>
                    <strong className="text-slate-800 text-sm font-semibold">{modules.length} Modules</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Lessons Count</span>
                    <strong className="text-slate-800 text-sm font-semibold">
                      {modules.reduce((acc, m) => acc + m.lessonsCount, 0)} Total Lessons
                    </strong>
                  </div>
                </div>
              </div>

              {/* Modules Breakdown Summary */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Curriculum Structure Summary
                </h3>
                <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-xl overflow-hidden">
                  {modules.map((m, idx) => (
                    <div key={m.id} className="p-3.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-[10px]">
                          {m.code}
                        </span>
                        <div>
                          <p className="font-semibold text-slate-800">{m.title}</p>
                          <p className="text-[11px] text-slate-400">{m.lessons.map(l => l.title).slice(0, 2).join(' · ')}</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-slate-50 text-slate-600 font-medium rounded-full text-[11px]">
                        {m.lessonsCount} lessons
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Publishing Settings & Deploy */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Publishing & Cadre Access
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="font-semibold text-slate-800 block">Target Cadre</span>
                    <span className="text-slate-500">
                      Operational Forecasters, Regional Met Centres (RMC), Cyclone Warning Division
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="font-semibold text-slate-800 block">Certification</span>
                    <span className="text-slate-500">
                      Auto-issues IMD Competency Certificate upon 100% completion & passing final quiz.
                    </span>
                  </div>

                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-xs font-medium">
                      All syllabus requirements & MoES guidelines verified.
                    </span>
                  </div>
                </div>

                <div className="pt-2 space-y-2.5">
                  <button
                    type="button"
                    onClick={() => handlePublishCourse('Active')}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Publish Course to Portal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePublishCourse('Draft')}
                    className="w-full py-2.5 bg-white border border-slate-200/90 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
                  >
                    Save as Draft Only
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200/80">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 bg-white border border-slate-200/90 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Course Structure</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
