import React, { useState, useEffect } from 'react';
import { useTraineeData } from '../../context/TraineeDataContext';
import { TraineeTab } from '../../types';
import {
  ArrowLeft,
  Bookmark,
  Bell,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Check,
  CheckCircle2,
  Lock,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Settings,
  Subtitles,
  FileText,
  FileSpreadsheet,
  Presentation,
  ExternalLink,
  Download,
  Video,
  FileArchive,
  Save,
  MessageSquare,
  Send,
  X,
  Sparkles,
  BookOpen,
  Eye,
  Radio,
  Tv,
} from 'lucide-react';

interface TraineeCoursePlayerPageProps {
  onSelectTab: (tab: TraineeTab) => void;
  showToast: (msg: string) => void;
}

interface LessonItem {
  id: string;
  title: string;
  duration: number; // in minutes
  type: 'video' | 'text';
  youtubeId?: string;
  videoTime?: string;
  readingBadge?: string;
  description: string;
  takeaways: string[];
  hasSatelliteBox?: boolean;
  satelliteName?: string;
  satelliteDesc?: string;
  satelliteImage?: string;
  hasSstMap?: boolean;
  contentSections?: {
    heading: string;
    text: string;
    bullets?: string[];
    image?: string;
    caption?: string;
  }[];
  materials: {
    type: 'PDF' | 'PPT' | 'XLS' | 'link' | 'video' | 'ZIP';
    name: string;
    sizeOrDuration: string;
  }[];
}

interface ModuleItem {
  code: string;
  title: string;
  completedCount: number;
  lessons: LessonItem[];
}

interface CourseCurriculum {
  id: string;
  title: string;
  modules: ModuleItem[];
}

// Complete rich course curriculum database for meteorological courses
const CURRICULUM_DATA: Record<string, CourseCurriculum> = {
  'course-1': {
    id: 'course-1',
    title: 'Cyclone Track Analysis & Dvorak Technique',
    modules: [
      {
        code: 'M1',
        title: 'Introduction to Cyclones',
        completedCount: 3,
        lessons: [
          {
            id: 'l1-1',
            title: 'Cyclone formation and structure',
            duration: 12,
            type: 'video',
            youtubeId: 'S2q_85BOGxY',
            videoTime: '12:00 / 12:00',
            description:
              'Fundamentals of cyclogenesis in the North Indian Ocean basin, thermodynamic atmospheric triggers, low-level vorticity convergence, and core temperature anomalies.',
            takeaways: [
              'Role of Sea Surface Temperatures (> 26.5°C) in providing latent heat energy',
              'Coriolis force requirements (minimum 5° latitude away from equator)',
              'Low vertical wind shear (< 10 m/s between 850 hPa and 200 hPa)',
              'Warm-core tropospheric anomaly identification on microwave sensors',
            ],
            materials: [
              { type: 'PDF', name: 'Cyclogenesis Principles – Guide.pdf', sizeOrDuration: '2.8 MB' },
              { type: 'PPT', name: 'Basin Overview (Bay of Bengal & Arabian Sea).pptx', sizeOrDuration: '4.2 MB' },
            ],
          },
          {
            id: 'l1-2',
            title: 'Tropical cyclone life cycle',
            duration: 18,
            type: 'video',
            youtubeId: 'oM4T2Fh5P60',
            videoTime: '18:00 / 18:00',
            description:
              'Stages of cyclonic development from Low Pressure Area (LPA), Well Marked Low (WML), Depression (D), Deep Depression (DD), Cyclonic Storm (CS), to Super Cyclonic Storm (SuCS).',
            takeaways: [
              'IMD 3-minute sustained wind threshold classification scale',
              'Central pressure deficit criteria vs. maximum sustained surface winds',
              'Recurvature physics governed by mid-tropospheric subtropical ridges',
              'Landfall dissipation mechanisms and frictional decay constants',
            ],
            materials: [
              { type: 'PDF', name: 'IMD Wind Scale Classification Standards.pdf', sizeOrDuration: '1.9 MB' },
              { type: 'XLS', name: 'Cyclone Stage Pressure vs Wind Matrix.xlsx', sizeOrDuration: '940 KB' },
            ],
          },
          {
            id: 'l1-3',
            title: 'Global cyclone basins & Indian Ocean dynamics',
            duration: 15,
            type: 'text',
            readingBadge: '15 min read',
            description:
              'Comparative dynamics of North Indian Ocean cyclogenesis during pre-monsoon (April-May) and post-monsoon (October-December) transition seasons.',
            takeaways: [
              'Bimodal annual distribution of North Indian Ocean cyclones',
              'Madden-Julian Oscillation (MJO) phase influence on storm genesis',
              'Indian Ocean Dipole (IOD) positive phase correlation with Arabian Sea events',
              'Bay of Bengal shallow bathymetry and catastrophic storm surge risks',
            ],
            hasSatelliteBox: true,
            satelliteName: 'INSAT-3D/3DR Multispectral Imaging',
            satelliteDesc:
              'High-frequency thermal infrared channels (TIR-1, TIR-2) provide continuous hourly tracking of convection bands over the Bay of Bengal.',
            satelliteImage:
              'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
            materials: [
              { type: 'PDF', name: 'North Indian Ocean Climatology (1990-2025).pdf', sizeOrDuration: '5.1 MB' },
              { type: 'link', name: 'Additional reading: RSMC New Delhi Annual Reports', sizeOrDuration: 'External resource' },
            ],
          },
        ],
      },
      {
        code: 'M2',
        title: 'Meteorological Observations',
        completedCount: 2,
        lessons: [
          {
            id: 'l2-1',
            title: 'Observing tropical systems',
            duration: 10,
            type: 'text',
            readingBadge: '10 min read',
            description:
              'Tropical systems are identified and monitored using a combination of satellite imagery, surface observations, and numerical guidance. Early identification helps in timely analysis and forecasting.',
            takeaways: [
              'Use multiple data sources to detect and monitor tropical systems',
              'Look for persistent organized convection and cyclonic rotation',
              'Early identification improves forecast lead time and preparedness',
            ],
            materials: [
              { type: 'PDF', name: 'Observational Checklist.pdf', sizeOrDuration: '1.4 MB' },
            ],
          },
          {
            id: 'l2-2',
            title: 'Satellite and surface data',
            duration: 18,
            type: 'text',
            readingBadge: '18 min read',
            description:
              'Satellite and surface observations provide complementary information for identifying, monitoring and analyzing tropical cyclones. Satellite data offers a broad, near-real-time view of cloud structure and evolution, while surface observations capture the actual weather conditions at specific locations, such as wind, pressure and rainfall.',
            contentSections: [
              {
                heading: '1. Satellite observations',
                text: 'Meteorological satellites, especially geostationary and polar-orbiting satellites, are essential for continuous monitoring of tropical systems. They help in:',
                bullets: [
                  'Detecting areas of organized convection.',
                  'Monitoring cloud pattern, banding and central dense overcast (CDO).',
                  'Estimating the location of the cyclone center.',
                  'Assessing intensity changes over time.',
                ],
                image:
                  'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=600&auto=format&fit=crop&q=80',
                caption: 'INSAT-3DR Enhanced Infrared Cloud Spiral View',
              },
            ],
            takeaways: [
              'Satellite data provides continuous, wide-area monitoring of cyclone structure',
              'Surface data gives ground truth on wind, pressure and rainfall',
              'Using both improves the accuracy of cyclone analysis and intensity estimation',
            ],
            hasSatelliteBox: true,
            satelliteName: 'INSAT-3D/3DR',
            satelliteDesc:
              "India's primary meteorological satellite for real-time monitoring of tropical cyclones, providing visible, infrared and water vapour imagery.",
            satelliteImage:
              'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=600&auto=format&fit=crop&q=80',
            materials: [
              { type: 'PDF', name: 'Satellite Data – Notes.pdf', sizeOrDuration: '3.4 MB' },
              { type: 'PPT', name: 'INSAT-3D Overview.pptx', sizeOrDuration: '5.8 MB' },
              { type: 'XLS', name: 'Observation Log (Sample).xlsx', sizeOrDuration: '1.2 MB' },
              { type: 'video', name: 'INSAT-3D Animation', sizeOrDuration: 'Video · 06 min' },
              { type: 'ZIP', name: 'Sample Surface Data (ZIP)', sizeOrDuration: 'ZIP · 15.6 MB' },
            ],
          },
          {
            id: 'l2-3',
            title: 'Scatterometer & soundings',
            duration: 16,
            type: 'text',
            readingBadge: '16 min read',
            description:
              'Ocean surface wind vectors retrieved via ASCAT and SCATSAT scatterometer passes, coupled with coastal GPS radiosonde atmospheric soundings.',
            takeaways: [
              'Scatterometer wind vector ambiguity removal techniques',
              'Identifying Radius of Maximum Wind (RMW) from scatterometer swaths',
              'Thermodynamic CAPE and CIN calculations from coastal sounding ascents',
            ],
            materials: [
              { type: 'PDF', name: 'Scatterometer Wind Vector Analysis.pdf', sizeOrDuration: '2.1 MB' },
            ],
          },
          {
            id: 'l2-4',
            title: 'Environmental analysis',
            duration: 20,
            type: 'text',
            readingBadge: '20 min read',
            description:
              'The surrounding environment plays a crucial role in the development, intensification and movement of tropical cyclones. Key environmental factors include sea surface temperature (SST), vertical wind shear, upper-level divergence and mid-level humidity.',
            contentSections: [
              {
                heading: '1. Sea surface temperature (SST)',
                text: 'Warm ocean waters (≥ 26.5°C) provide the necessary heat and moisture to sustain cyclone development. Higher SSTs generally favour stronger and more persistent systems.',
                image:
                  'https://images.unsplash.com/photo-1507499739999-097706ad8914?w=800&auto=format&fit=crop&q=80',
                caption: 'Tropical Cyclone Ocean Thermal Energy Matrix (TCOTE)',
              },
            ],
            takeaways: [
              'SST thermal reservoirs sustain continuous latent heat release',
              'Environmental vertical wind shear determines storm vertical tilt',
              'Dry air intrusion from continental India rapidly chokes convective eyewalls',
            ],
            hasSstMap: true,
            materials: [
              { type: 'PDF', name: 'Environmental Factors in Tropical Cyclones.pdf', sizeOrDuration: '4.1 MB' },
            ],
          },
        ],
      },
      {
        code: 'M3',
        title: 'Track Forecasting',
        completedCount: 1,
        lessons: [
          {
            id: 'l3-1',
            title: 'Track forecasting – Overview',
            duration: 12,
            type: 'video',
            youtubeId: 'bV3Uv-9jD4U',
            videoTime: '12:00 / 12:00',
            description:
              'Understand the principles of cyclone track forecasting, forecast guidance, operational workflow, and environmental steering currents.',
            takeaways: [
              'Steering flow concept (deep layer mean between 850 hPa and 200 hPa)',
              'Interaction between cyclones and subtropical anticyclone ridges',
              'Beta drift and planetary vorticity gradient deviations',
            ],
            materials: [
              { type: 'PDF', name: 'Track Forecasting Workflow.pdf', sizeOrDuration: '3.1 MB' },
              { type: 'PPT', name: 'Steering Currents & Ridge Interactions.pptx', sizeOrDuration: '4.9 MB' },
            ],
          },
          {
            id: 'l3-2',
            title: 'Numerical models for track prediction',
            duration: 24,
            type: 'video',
            youtubeId: 'Z9q_1x-F77Q',
            videoTime: '08:24 / 24:15',
            description:
              'In this lesson, we explore how numerical weather prediction (NWP) models are used to estimate the future track of a tropical cyclone. We will cover model types, input data, ensemble approaches and key factors affecting track accuracy.',
            takeaways: [
              'Role of NWP models in cyclone track forecasting',
              'Common models (GFS, ECMWF, HWRF, UM)',
              'Ensemble forecasting and uncertainty range',
              'Factors that influence track prediction accuracy',
            ],
            materials: [
              { type: 'PDF', name: 'Track Forecasting – Notes.pdf', sizeOrDuration: '3.4 MB' },
              { type: 'PPT', name: 'NWP Models Overview.pptx', sizeOrDuration: '5.8 MB' },
              { type: 'XLS', name: 'Model Comparison (GFS vs ECMWF).xlsx', sizeOrDuration: '1.2 MB' },
              { type: 'link', name: 'Additional reading: WMO Guide', sizeOrDuration: 'External resource' },
              { type: 'video', name: 'Model Run Demonstration', sizeOrDuration: 'Video · 10 min' },
              { type: 'ZIP', name: 'Dataset (Sample)', sizeOrDuration: 'ZIP · 15.6 MB' },
            ],
          },
          {
            id: 'l3-3',
            title: 'Ensemble forecasting & uncertainty',
            duration: 18,
            type: 'video',
            youtubeId: '4-X8GZtKk0g',
            videoTime: '00:00 / 18:30',
            description:
              'Learn how ensemble prediction systems (EPS) communicate forecast spread, cone of uncertainty, and probability envelopes for disaster managers.',
            takeaways: [
              'Perturbed initial conditions and physics perturbation schemes',
              'Calculation of track spread vs. ensemble mean position',
              'Drawing the official IMD cone of uncertainty (70% probability envelope)',
            ],
            materials: [
              { type: 'PDF', name: 'Ensemble Spread & Cone Guidelines.pdf', sizeOrDuration: '2.5 MB' },
            ],
          },
          {
            id: 'l3-4',
            title: 'Case study – Recent cyclone',
            duration: 20,
            type: 'text',
            readingBadge: '20 min read',
            description:
              'Step-by-step reconstruction of Extremely Severe Cyclonic Storm Biparjoy and Cyclone Michaung, evaluating multi-model forecast consensus against actual observed tracks.',
            takeaways: [
              'Comparing forecast tracks with observed radar/satellite positions',
              'Identifying root causes of forecast track error at 48h and 72h lead times',
              'Summarizing operational lessons for regional forecasting centers',
            ],
            materials: [
              { type: 'PDF', name: 'Cyclone Biparjoy Forecast Verification Report.pdf', sizeOrDuration: '6.4 MB' },
            ],
          },
        ],
      },
      {
        code: 'M4',
        title: 'Dvorak Technique',
        completedCount: 0,
        lessons: [
          {
            id: 'l4-1',
            title: 'Dvorak technique – Background',
            duration: 16,
            type: 'text',
            readingBadge: '16 min read',
            description:
              'The Dvorak technique is a satellite-based method used to estimate the intensity of tropical cyclones from their cloud patterns. It remains a widely used and reliable approach, especially over oceanic regions where in-situ observations are limited.',
            takeaways: [
              'Principles of Dvorak subjective pattern recognition',
              'Definition of Tropical Number (T-number) and Current Intensity (CI-number)',
              'Rules for rapid intensification and constraint rules in Dvorak analysis',
            ],
            hasSatelliteBox: true,
            satelliteName: 'Himawari-9',
            satelliteDesc:
              'A geostationary meteorological satellite providing high-resolution, multi-channel imagery for continuous cyclone monitoring in the Asia-Pacific region.',
            satelliteImage:
              'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=600&auto=format&fit=crop&q=80',
            materials: [
              { type: 'PDF', name: 'WMO Dvorak Workbook 2026.pdf', sizeOrDuration: '8.2 MB' },
            ],
          },
          {
            id: 'l4-2',
            title: 'Cloud pattern classification',
            duration: 22,
            type: 'video',
            youtubeId: 'bV3Uv-9jD4U',
            videoTime: '00:00 / 22:00',
            description:
              'Categorizing cloud systems into Curved Band Pattern, Shear Pattern, Central Dense Overcast (CDO) Pattern, and Eye Pattern.',
            takeaways: [
              'Logarithmic spiral overlay application on infrared curved bands',
              'Shear pattern distance measurement from cyclone center to convective cloud edge',
              'Eye pattern embedded distance (BD curve gray shades)',
            ],
            materials: [
              { type: 'PDF', name: 'Dvorak BD Enhancement Gray Shade Scale.pdf', sizeOrDuration: '2.4 MB' },
            ],
          },
          {
            id: 'l4-3',
            title: 'T-number and CI-number estimation',
            duration: 25,
            type: 'text',
            readingBadge: '25 min read',
            description:
              'Step-by-step calculation of Data T-number (DT), Pattern T-number (PT), Model Expected T-number (MET), and assignment of final CI-number with pressure conversion.',
            takeaways: [
              'Weighting between DT, PT and MET under ambiguous patterns',
              'Knaff-Zehr-Courtney (KZC) pressure-wind empirical formulations',
              'Applying 24-hour intensity change constraints (max 1.5 T-numbers)',
            ],
            materials: [
              { type: 'PDF', name: 'T-Number to Central Pressure Table.pdf', sizeOrDuration: '1.1 MB' },
            ],
          },
          {
            id: 'l4-4',
            title: 'Intensity analysis case study',
            duration: 20,
            type: 'video',
            youtubeId: 'S2q_85BOGxY',
            videoTime: '00:00 / 20:00',
            description:
              'Real-world operational analysis session evaluating an unclassified vortex in the Arabian Sea with hourly INSAT-3DR TIR enhancement.',
            takeaways: [
              'Handling diurnal convective pulsing without artificially altering CI numbers',
              'Correlating microwave eye warm core with infrared Dvorak estimates',
            ],
            materials: [
              { type: 'PDF', name: 'Interactive Dvorak Practice Sheet.pdf', sizeOrDuration: '3.6 MB' },
            ],
          },
        ],
      },
      {
        code: 'M5',
        title: 'Data Analysis & Interpretation',
        completedCount: 0,
        lessons: [
          {
            id: 'l5-1',
            title: 'Data sources and validation',
            duration: 14,
            type: 'text',
            readingBadge: '14 min read',
            description:
              'Quality control and cross-validation between Coastal Doppler Weather Radars (DWR), Automatic Weather Stations (AWS), ship reports, and atmospheric buoys.',
            takeaways: [
              'Validating radar radial velocities against synoptic anemometer gusts',
              'Correcting barometer sea-level conversions on drifting buoys',
            ],
            materials: [
              { type: 'PDF', name: 'In-Situ Calibration Handbook.pdf', sizeOrDuration: '2.9 MB' },
            ],
          },
          {
            id: 'l5-2',
            title: 'Track error analysis',
            duration: 18,
            type: 'video',
            youtubeId: 'Z9q_1x-F77Q',
            videoTime: '00:00 / 18:00',
            description:
              'Statistical breakdown of along-track (speed bias) and cross-track (direction bias) errors at 12h, 24h, 48h, 72h lead times over the last decade.',
            takeaways: [
              'Systematic southward bias during recurvature in global models',
              'Impact of high-frequency satellite data assimilation on 24h errors',
            ],
            materials: [
              { type: 'XLS', name: 'Historical Error Statistics Matrix.xlsx', sizeOrDuration: '1.8 MB' },
            ],
          },
          {
            id: 'l5-3',
            title: 'Forecast verification',
            duration: 16,
            type: 'text',
            readingBadge: '16 min read',
            description:
              'Official WMO-recommended verification metrics: Brier score, Critical Success Index (CSI), False Alarm Ratio (FAR), and Relative Operating Characteristic (ROC).',
            takeaways: [
              'Calculating track displacement error from best track archives',
              'Skill score assessment against CLIPER (Climatology and Persistence) baseline',
            ],
            materials: [
              { type: 'PDF', name: 'Forecast Verification Protocols.pdf', sizeOrDuration: '2.2 MB' },
            ],
          },
        ],
      },
      {
        code: 'M6',
        title: 'Assessment & Final Quiz',
        completedCount: 0,
        lessons: [
          {
            id: 'l6-1',
            title: 'Module assessment',
            duration: 30,
            type: 'text',
            readingBadge: '30 min evaluation',
            description:
              'Comprehensive intermediate assessment evaluating satellite pattern classification, steering current analysis, and warning issuance scenarios.',
            takeaways: [
              'Demonstrate proficiency in assigning Dvorak T-numbers',
              'Interpret multi-model ensemble plume diagrams accurately',
              'Draft an operational cyclone warning bulletin for local port authorities',
            ],
            materials: [
              { type: 'PDF', name: 'Assessment Instructions & Grading Rubric.pdf', sizeOrDuration: '800 KB' },
            ],
          },
          {
            id: 'l6-2',
            title: 'Final course examination',
            duration: 45,
            type: 'text',
            readingBadge: '45 min exam',
            description:
              'Final summative evaluation for Gazetted Officer Competency Certification in Tropical Cyclone Operations, authorized by IMD Training Directorate.',
            takeaways: [
              'Complete all 30 scenario-based operational forecasting questions',
              'Achieve minimum 75% score for automatic certificate issuance',
            ],
            materials: [
              { type: 'PDF', name: 'Examination Candidate Guidelines.pdf', sizeOrDuration: '650 KB' },
            ],
          },
        ],
      },
    ],
  },
  'course-2': {
    id: 'course-2',
    title: 'Climate Data Handling & NetCDF Workflows',
    modules: [
      {
        code: 'M1',
        title: 'Introduction to NetCDF & Scientific Formats',
        completedCount: 4,
        lessons: [
          {
            id: 'c2-l1',
            title: 'Climate data models & dimensions',
            duration: 15,
            type: 'video',
            youtubeId: 'bV3Uv-9jD4U',
            videoTime: '15:00 / 15:00',
            description:
              'Understanding self-describing multidimensional climate data formats (NetCDF4, HDF5, GRIB2) with CF metadata conventions.',
            takeaways: [
              'Coordinate variables: latitude, longitude, pressure level, time',
              'Chunking and compression strategies for multi-decadal reanalysis sets',
            ],
            materials: [{ type: 'PDF', name: 'NetCDF CF Conventions Guide.pdf', sizeOrDuration: '3.2 MB' }],
          },
        ],
      },
    ],
  },
};

export const TraineeCoursePlayerPage: React.FC<TraineeCoursePlayerPageProps> = ({
  onSelectTab,
  showToast,
}) => {
  const {
    courses,
    selectedCourseId,
    setSelectedCourseId,
    savedCourseIds,
    toggleSaveCourse,
    updateCourseProgress,
    notifications,
  } = useTraineeData();

  // Find active course metadata or default to course-1
  const currentCourse =
    courses.find((c) => c.id === selectedCourseId) || courses[0];

  const curriculum =
    CURRICULUM_DATA[selectedCourseId] || CURRICULUM_DATA['course-1'];

  // Active module & lesson indices
  const [activeModuleIdx, setActiveModuleIdx] = useState<number>(2); // Default M3 (Track Forecasting) matching mockup
  const [activeLessonIdx, setActiveLessonIdx] = useState<number>(1); // Default L3.2 (Numerical models) matching mockup

  // Player controls state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<string>('1x');
  const [useYouTubeIframe, setUseYouTubeIframe] = useState<boolean>(false);

  // Resource panel state: 'materials' | 'notes' | 'discussion'
  const [resourceTab, setResourceTab] = useState<'materials' | 'notes' | 'discussion'>('materials');
  const [isResourceCollapsed, setIsResourceCollapsed] = useState<boolean>(false);

  // Notes state for this course/lesson
  const [userNotes, setUserNotes] = useState<string>(
    'NWP model guidance: When comparing GFS and ECMWF for Arabian Sea tracks, always inspect 500 hPa subtropical ridge position. GFS tends to have a slight eastward bias during post-monsoon recurvature.'
  );

  // Discussion comments
  const [comments, setComments] = useState<{ id: string; author: string; role: string; time: string; text: string }[]>([
    {
      id: 'c1',
      author: 'Dr. Ravi Menon',
      role: 'Senior Scientist & Instructor, IMD',
      time: '2 hours ago',
      text: 'Always compare multiple ensemble model runs (ECMWF EPS + GFS GEFS) rather than relying exclusively on a single deterministic forecast track.',
    },
    {
      id: 'c2',
      author: 'Vikram Joshi',
      role: 'Forecasting Officer, RMC Chennai',
      time: 'Yesterday',
      text: 'Notice how the HWRF model resolves the inner eyewall vortex wind structure with significantly better fidelity compared to coarse global grids.',
    },
  ]);
  const [newCommentText, setNewCommentText] = useState('');

  const currentModule = curriculum.modules[activeModuleIdx] || curriculum.modules[0];
  const currentLesson = currentModule.lessons[activeLessonIdx] || currentModule.lessons[0];

  // Calculate overall course progress percentage
  const totalLessons = curriculum.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const currentProgress = currentCourse.progress ?? 38;

  const isSaved = savedCourseIds.includes(currentCourse.id);

  // Handle lesson navigation
  const handleSelectLesson = (mIdx: number, lIdx: number) => {
    setActiveModuleIdx(mIdx);
    setActiveLessonIdx(lIdx);
    setIsPlaying(false);
  };

  const handleNextLesson = () => {
    if (activeLessonIdx < currentModule.lessons.length - 1) {
      setActiveLessonIdx(activeLessonIdx + 1);
      setIsPlaying(false);
    } else if (activeModuleIdx < curriculum.modules.length - 1) {
      setActiveModuleIdx(activeModuleIdx + 1);
      setActiveLessonIdx(0);
      setIsPlaying(false);
    } else {
      // Course completed
      updateCourseProgress(currentCourse.id, 100, 'Completed');
      showToast('🎉 Congratulations! You have completed all course lessons.');
      onSelectTab('my-courses');
    }
  };

  const handlePrevLesson = () => {
    if (activeLessonIdx > 0) {
      setActiveLessonIdx(activeLessonIdx - 1);
      setIsPlaying(false);
    } else if (activeModuleIdx > 0) {
      const prevMod = curriculum.modules[activeModuleIdx - 1];
      setActiveModuleIdx(activeModuleIdx - 1);
      setActiveLessonIdx(prevMod.lessons.length - 1);
      setIsPlaying(false);
    }
  };

  const isFirstLesson = activeModuleIdx === 0 && activeLessonIdx === 0;
  const isLastLesson =
    activeModuleIdx === curriculum.modules.length - 1 &&
    activeLessonIdx === currentModule.lessons.length - 1;

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const newEntry = {
      id: Date.now().toString(),
      author: 'Asha Verma',
      role: 'Trainee, IMD New Delhi',
      time: 'Just now',
      text: newCommentText.trim(),
    };
    setComments((prev) => [newEntry, ...prev]);
    setNewCommentText('');
    showToast('Your question was posted to the course discussion.');
  };

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto min-w-0">
      {/* ======================================================== */}
      {/* 1. TOP HEADER & BREADCRUMB BAR (Matches image_ee9f16cc.png) */}
      {/* ======================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#e6e9f2]">
        <div>
          {/* Breadcrumb matching mockup */}
          <div className="flex items-center gap-1.5 text-xs text-[#5b6478] mb-1">
            <button
              type="button"
              onClick={() => onSelectTab('my-courses')}
              className="hover:text-[#1f5eff] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#1f5eff]" />
              <span>My courses</span>
            </button>
            <span>›</span>
            <span className="truncate max-w-xs sm:max-w-md font-medium text-slate-700">
              {currentCourse.title}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-[#1c2333] tracking-tight">
            {currentCourse.title}
          </h1>
          <p className="text-xs text-[#5b6478] mt-0.5 font-medium">
            {currentModule.code} · {currentModule.title}
          </p>
        </div>

        {/* Right user & progress cluster matching mockup */}
        <div className="flex items-center gap-3.5 sm:gap-4 shrink-0 flex-wrap">
          {/* Bookmark Button */}
          <button
            type="button"
            onClick={() => {
              toggleSaveCourse(currentCourse.id);
              showToast(isSaved ? 'Course removed from bookmarks.' : 'Course saved to bookmarks.');
            }}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isSaved
                ? 'bg-blue-50 border-blue-200 text-[#1f5eff]'
                : 'bg-white border-[#e6e9f2] text-slate-400 hover:text-slate-700'
            }`}
            title="Bookmark Course"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#1f5eff]' : ''}`} />
          </button>

          {/* Notification bell with red badge */}
          <button
            type="button"
            onClick={() => onSelectTab('notifications')}
            className="p-2 rounded-xl bg-white border border-[#e6e9f2] text-slate-500 hover:text-slate-800 relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full grid place-items-center">
              3
            </span>
          </button>

          {/* User Avatar pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1f5eff] font-bold text-xs grid place-items-center">
              AV
            </div>
            <div className="hidden sm:block text-left text-xs leading-tight">
              <span className="font-bold text-[#1c2333] block">Asha Verma</span>
              <span className="text-[10px] text-[#5b6478]">Trainee - New Delhi</span>
            </div>
          </div>

          {/* Course Overall Progress Indicator */}
          <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
            <span className="text-xs font-bold text-[#1c2333]">
              {currentProgress}% Complete
            </span>
            <div className="w-24 sm:w-28 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-2 bg-[#1f5eff] rounded-full transition-all duration-300"
                style={{ width: `${currentProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. THREE-COLUMN PLAYER GRID (Matches image_ee9f16cc.png)   */}
      {/* ======================================================== */}
      <div
        className={`grid gap-4 items-start ${
          isResourceCollapsed
            ? 'grid-cols-1 lg:grid-cols-[290px_1fr]'
            : 'grid-cols-1 lg:grid-cols-[280px_1fr_310px]'
        }`}
      >
        {/* ======================================================== */}
        {/* COL 1: COURSE CONTENT SIDEBAR (Left) */}
        {/* ======================================================== */}
        <aside className="bg-white rounded-2xl border border-[#e6e9f2] shadow-2xs p-3.5 sm:p-4 space-y-3">
          <div>
            <h2 className="text-sm font-bold text-[#1c2333]">Course content</h2>
            <p className="text-[11px] text-[#5b6478] mt-0.5">
              {curriculum.modules.length} Modules · {totalLessons} Lessons
            </p>
          </div>

          {/* Accordion list */}
          <div className="space-y-2">
            {curriculum.modules.map((mod, mIdx) => {
              const isModActive = mIdx === activeModuleIdx;
              const isModCompleted = mod.completedCount === mod.lessons.length;

              return (
                <div
                  key={mod.code}
                  className="rounded-xl border border-slate-200/80 overflow-hidden"
                >
                  {/* Module header button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (mIdx !== activeModuleIdx) {
                        handleSelectLesson(mIdx, 0);
                      }
                    }}
                    className={`w-full px-3 py-2.5 flex items-center justify-between text-left text-xs font-bold transition-colors cursor-pointer ${
                      isModActive
                        ? 'bg-[#1f5eff] text-white'
                        : 'bg-white hover:bg-slate-50 text-[#1c2333]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`px-1.5 py-0.5 rounded-md text-[10.5px] font-bold ${
                          isModActive
                            ? 'bg-white text-[#1f5eff]'
                            : 'bg-blue-50 text-[#1f5eff]'
                        }`}
                      >
                        {mod.code}
                      </span>
                      <span className="truncate">{mod.title}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <span
                        className={`text-[11px] font-semibold ${
                          isModActive ? 'text-white/90' : 'text-[#5b6478]'
                        }`}
                      >
                        {isModCompleted ? (
                          <span className="flex items-center gap-0.5 text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md text-[10px]">
                            <Check className="w-3 h-3" />
                            {mod.completedCount}/{mod.lessons.length}
                          </span>
                        ) : (
                          `${mod.completedCount}/${mod.lessons.length}`
                        )}
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isModActive ? 'rotate-180 text-white' : 'text-slate-400'
                        }`}
                      />
                    </div>
                  </button>

                  {/* Lessons list inside this module */}
                  {isModActive && (
                    <div className="bg-slate-50/70 p-1.5 space-y-1 border-t border-slate-100">
                      {mod.lessons.map((lesson, lIdx) => {
                        const isLessonActive = lIdx === activeLessonIdx;
                        const isLessonDone = lIdx < mod.completedCount;
                        const isLessonLocked = lIdx > mod.completedCount && !isLessonActive;

                        return (
                          <button
                            key={lesson.id}
                            type="button"
                            onClick={() => handleSelectLesson(mIdx, lIdx)}
                            className={`w-full px-2.5 py-2 rounded-lg flex items-center justify-between text-left text-xs transition-colors cursor-pointer ${
                              isLessonActive
                                ? 'bg-blue-100/80 text-[#1f5eff] font-bold shadow-2xs'
                                : 'text-slate-700 hover:bg-white hover:text-slate-900'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0 pr-2">
                              {/* State circle icon matching mockup */}
                              <span
                                className={`w-4 h-4 rounded-full grid place-items-center text-[10px] shrink-0 font-bold ${
                                  isLessonDone
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : isLessonActive
                                    ? 'bg-[#1f5eff] text-white'
                                    : isLessonLocked
                                    ? 'bg-slate-200 text-slate-500'
                                    : 'bg-blue-50 text-blue-600'
                                }`}
                              >
                                {isLessonDone ? (
                                  <Check className="w-2.5 h-2.5" />
                                ) : isLessonActive ? (
                                  <Play className="w-2 h-2 fill-white" />
                                ) : isLessonLocked ? (
                                  <Lock className="w-2.5 h-2.5" />
                                ) : (
                                  '•'
                                )}
                              </span>

                              <span className="truncate">
                                {mIdx + 1}.{lIdx + 1} {lesson.title}
                              </span>
                            </div>

                            <span className="text-[10px] font-medium text-slate-400 shrink-0">
                              {lesson.duration} min
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* ======================================================== */}
        {/* COL 2: MAIN LESSON STAGE (Center) */}
        {/* ======================================================== */}
        <section className="bg-white rounded-2xl border border-[#e6e9f2] shadow-2xs p-4 sm:p-6 space-y-4 min-w-0">
          {/* A. If Video Lesson: Video Player Screen matching image_ee9f16cc.png */}
          {currentLesson.type === 'video' ? (
            <div className="space-y-3">
              {/* Switch between interactive simulation and live YouTube player */}
              <div className="flex items-center justify-between text-xs pb-1">
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  IMD Learning Media · Track forecasting
                </span>

                <button
                  type="button"
                  onClick={() => setUseYouTubeIframe(!useYouTubeIframe)}
                  className="text-slate-500 hover:text-slate-800 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Tv className="w-3.5 h-3.5 text-blue-600" />
                  <span>{useYouTubeIframe ? 'Switch to Simulation HUD' : 'Watch on YouTube Player'}</span>
                </button>
              </div>

              {/* Video Player Display */}
              {useYouTubeIframe && currentLesson.youtubeId ? (
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg border border-slate-800">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube-nocookie.com/embed/${currentLesson.youtubeId}?autoplay=1&rel=0`}
                    title={currentLesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                /* Simulated Player HUD matching image_ee9f16cc.png */
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#0c1322] shadow-md border border-slate-800 flex items-center justify-center group select-none">
                  {/* Cyclone Spiral Radial Satellite Image Backdrop */}
                  <img
                    src="https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=1200&auto=format&fit=crop&q=80"
                    alt="Satellite Cyclone Spiral"
                    className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-radial-at-center from-black/20 via-black/40 to-black/80" />

                  {/* Play Button In Center matching mockup */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsPlaying(!isPlaying);
                      showToast(isPlaying ? 'Video paused' : 'Video playing');
                    }}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/30 backdrop-blur-md hover:bg-white/40 border border-white/60 text-white flex items-center justify-center shadow-2xl transition-all cursor-pointer z-10 active:scale-95"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 fill-white" />
                    ) : (
                      <Play className="w-8 h-8 fill-white ml-1" />
                    )}
                  </button>

                  {/* Top HUD Tag */}
                  <div className="absolute top-3 left-4 z-10 text-[10px] font-mono text-white/90 bg-black/60 px-2.5 py-1 rounded-md border border-white/10 backdrop-blur-xs">
                    IMD-RSMC-HQ · LIVE FEED
                  </div>

                  {/* Bottom Controls Bar matching mockup */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent z-10 text-white text-xs">
                    {/* Blue Seekbar */}
                    <div className="w-full bg-white/30 h-1.5 rounded-full mb-3 cursor-pointer overflow-hidden">
                      <div className="bg-[#1f5eff] h-full w-[35%] rounded-full shadow-xs" />
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Play time tracker: ▶ 08:24 / 24:15 */}
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="hover:text-blue-400 cursor-pointer"
                        >
                          {isPlaying ? (
                            <Pause className="w-4 h-4 fill-white" />
                          ) : (
                            <Play className="w-4 h-4 fill-white" />
                          )}
                        </button>
                        <span className="font-mono text-xs text-white/90">
                          {currentLesson.videoTime || '08:24 / 24:15'}
                        </span>
                      </div>

                      {/* Right icons: 1x, CC, Gear, Fullscreen */}
                      <div className="flex items-center gap-3 text-white/80">
                        <button
                          type="button"
                          onClick={() => {
                            const speeds = ['1x', '1.25x', '1.5x', '0.75x'];
                            const next = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
                            setPlaybackSpeed(next);
                            showToast(`Playback speed set to ${next}`);
                          }}
                          className="hover:text-white font-bold cursor-pointer"
                        >
                          {playbackSpeed}
                        </button>
                        <button
                          type="button"
                          onClick={() => showToast('Subtitles (CC) enabled')}
                          className="hover:text-white cursor-pointer"
                          title="Subtitles"
                        >
                          <Subtitles className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => showToast('Video quality: 1080p HD')}
                          className="hover:text-white cursor-pointer"
                          title="Settings"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setUseYouTubeIframe(true)}
                          className="hover:text-white cursor-pointer"
                          title="Fullscreen / YouTube view"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* B. If Text Lesson: Rich formatted view matching image_c48c9581.png */
            <div className="space-y-4">
              {/* Header Badges matching image_c48c9581.png */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="px-2.5 py-1 rounded-md bg-blue-50 text-[#1f5eff] font-bold text-[11px] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Text Lesson
                </span>
                <span className="text-[#5b6478] text-[11px] flex items-center gap-1">
                  <span>·</span>
                  <span>{currentLesson.readingBadge || '18 min read'}</span>
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px] flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  Reading
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#1c2333] tracking-tight">
                  {currentLesson.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#5b6478] leading-relaxed mt-2">
                  {currentLesson.description}
                </p>
              </div>

              {/* Dynamic Content Sections */}
              {currentLesson.contentSections?.map((sec, idx) => (
                <div
                  key={idx}
                  className="space-y-2.5 pt-2 border-t border-slate-100 text-xs text-slate-700"
                >
                  <h3 className="text-sm font-bold text-[#1c2333]">{sec.heading}</h3>
                  <p className="leading-relaxed">{sec.text}</p>
                  {sec.bullets && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                      <ul className="space-y-1.5 list-disc pl-5 text-slate-600">
                        {sec.bullets.map((b, bIdx) => (
                          <li key={bIdx}>{b}</li>
                        ))}
                      </ul>
                      {sec.image && (
                        <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-2xs">
                          <img
                            src={sec.image}
                            alt={sec.caption || 'Meteorology visual'}
                            className="w-full h-32 object-cover"
                          />
                          {sec.caption && (
                            <div className="p-1.5 bg-slate-950 text-[10px] text-slate-300 text-center font-mono">
                              {sec.caption}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* SST Map Callout if lesson has SST */}
              {currentLesson.hasSstMap && (
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2 text-xs">
                  <h4 className="font-bold text-slate-900">
                    Sea Surface Temperature (SST) & Heat Content
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    Ocean Heat Content (OHC &gt; 50 kJ/cm²) coupled with positive SST anomalies over 28°C provides explosive energy for cyclogenesis in the central Bay of Bengal.
                  </p>
                  <div className="rounded-xl overflow-hidden border border-slate-300 max-h-48 bg-slate-950">
                    <img
                      src="https://images.unsplash.com/photo-1507499739999-097706ad8914?w=800&auto=format&fit=crop&q=80"
                      alt="SST Heat Anomaly Map"
                      className="w-full h-44 object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Lesson Title & Description (for video lessons) */}
          {currentLesson.type === 'video' && (
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1c2333] tracking-tight">
                {currentLesson.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#5b6478] leading-relaxed mt-1">
                {currentLesson.description}
              </p>
            </div>
          )}

          {/* Key Takeaways Card matching image_ee9f16cc.png */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#eef4ff] border border-[#dfebff] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#1f5eff]">
                <Sparkles className="w-4 h-4 text-[#1f5eff]" />
                <span>Key takeaways</span>
              </div>
              <ul className="space-y-1 text-xs text-slate-700 list-disc pl-5">
                {currentLesson.takeaways.map((point, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Graphic Illustration on the right matching mockup (concentric cyclone path curve) */}
            <div className="w-32 h-24 rounded-xl bg-gradient-to-br from-[#dce9ff] to-[#c7dcff] grid place-items-center shrink-0 border border-blue-200 shadow-inner">
              <svg className="w-24 h-16 text-[#1f5eff]" viewBox="0 0 100 60" fill="none">
                <path
                  d="M10 50 C 30 45, 40 20, 70 25 S 90 10, 95 12"
                  stroke="#1f5eff"
                  strokeWidth="2.5"
                  strokeDasharray="4 2"
                />
                <circle cx="70" cy="25" r="4" fill="#1f5eff" />
                <circle cx="70" cy="25" r="8" stroke="#1f5eff" strokeWidth="1" opacity="0.6" />
                <circle cx="70" cy="25" r="13" stroke="#1f5eff" strokeWidth="1" opacity="0.3" />
                <circle cx="95" cy="12" r="3" fill="#15803d" />
              </svg>
            </div>
          </div>

          {/* Special Satellite Box if lesson has one matching image_c48c9581.png */}
          {currentLesson.hasSatelliteBox && (
            <div className="p-4 rounded-xl bg-[#f0f4fd] border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 grid place-items-center shrink-0 mt-0.5">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">
                    Key satellite: {currentLesson.satelliteName}
                  </h4>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">
                    {currentLesson.satelliteDesc}
                  </p>
                </div>
              </div>

              {currentLesson.satelliteImage && (
                <div className="w-28 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-950">
                  <img
                    src={currentLesson.satelliteImage}
                    alt={currentLesson.satelliteName || 'Satellite'}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          )}

          {/* Footer Navigation Bar matching image_ee9f16cc.png */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              disabled={isFirstLesson}
              onClick={handlePrevLesson}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer flex items-center gap-1 ${
                isFirstLesson
                  ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous lesson</span>
            </button>

            <span className="text-xs text-[#5b6478] font-medium hidden sm:inline">
              Lesson {activeLessonIdx + 1} of {currentModule.lessons.length} · {currentLesson.duration} min
            </span>

            <button
              type="button"
              onClick={handleNextLesson}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#1f5eff] hover:bg-blue-600 text-white transition-all cursor-pointer flex items-center gap-1 shadow-xs"
            >
              <span>{isLastLesson ? 'Finish course ✓' : 'Next lesson'}</span>
              {!isLastLesson && <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </section>

        {/* ======================================================== */}
        {/* COL 3: COLLAPSIBLE RESOURCE PANEL (Right) matching mockup */}
        {/* ======================================================== */}
        {!isResourceCollapsed ? (
          <aside className="bg-white rounded-2xl border border-[#e6e9f2] shadow-2xs overflow-hidden flex flex-col min-w-0">
            {/* Top Tabs: Materials | Notes | Discussion | Close ✕ */}
            <div className="flex items-center border-b border-[#e6e9f2] bg-white">
              <button
                type="button"
                onClick={() => setResourceTab('materials')}
                className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer text-center ${
                  resourceTab === 'materials'
                    ? 'border-[#1f5eff] text-[#1f5eff]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Materials
              </button>

              <button
                type="button"
                onClick={() => setResourceTab('notes')}
                className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer text-center ${
                  resourceTab === 'notes'
                    ? 'border-[#1f5eff] text-[#1f5eff]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Notes
              </button>

              <button
                type="button"
                onClick={() => setResourceTab('discussion')}
                className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer text-center ${
                  resourceTab === 'discussion'
                    ? 'border-[#1f5eff] text-[#1f5eff]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Discussion
              </button>

              {/* Close / Collapse Button ✕ matching mockup */}
              <button
                type="button"
                onClick={() => setIsResourceCollapsed(true)}
                className="px-3 py-3 text-slate-400 hover:text-slate-700 cursor-pointer"
                title="Collapse resource panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Panel Content based on Tab */}
            <div className="p-4 space-y-4 text-xs">
              {/* TAB 1: MATERIALS */}
              {resourceTab === 'materials' && (
                <div className="space-y-4">
                  {/* Lesson materials */}
                  <div>
                    <h3 className="font-bold text-[#1c2333] text-xs">Lesson materials</h3>
                    <p className="text-[11px] text-[#5b6478] mt-0.5 mb-2.5">
                      Download and view resources for this lesson.
                    </p>

                    <div className="space-y-2">
                      {currentLesson.materials.map((mat, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/60 flex items-center justify-between gap-2.5 group transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* File type badge matching mockup */}
                            <span
                              className={`w-7 h-7 rounded-lg text-[9px] font-bold grid place-items-center shrink-0 ${
                                mat.type === 'PDF'
                                  ? 'bg-rose-100 text-rose-700'
                                  : mat.type === 'PPT'
                                  ? 'bg-amber-100 text-amber-700'
                                  : mat.type === 'XLS'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : mat.type === 'video'
                                  ? 'bg-blue-100 text-blue-700'
                                  : mat.type === 'ZIP'
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-indigo-100 text-indigo-700'
                              }`}
                            >
                              {mat.type === 'link' ? '↗' : mat.type === 'video' ? '▶' : mat.type}
                            </span>
                            <div className="min-w-0">
                              <span className="font-bold text-[#1c2333] block truncate text-[11px] group-hover:text-blue-600">
                                {mat.name}
                              </span>
                              <span className="text-[10px] text-[#5b6478]">
                                {mat.sizeOrDuration}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => showToast(`Downloaded ${mat.name}`)}
                            className="text-[#1f5eff] hover:text-blue-800 p-1.5 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer shrink-0"
                            title="Download resource"
                          >
                            {mat.type === 'link' ? (
                              <ExternalLink className="w-3.5 h-3.5" />
                            ) : (
                              <Download className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Other resources section */}
                  <div className="pt-2 border-t border-slate-100">
                    <h3 className="font-bold text-[#1c2333] text-xs">Other resources</h3>
                    <div className="mt-2 space-y-2">
                      <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold grid place-items-center shrink-0">
                            ▶
                          </span>
                          <div>
                            <span className="font-bold text-[#1c2333] block text-[11px]">
                              Model Run Demonstration
                            </span>
                            <span className="text-[10px] text-[#5b6478]">Video · 10 min</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => showToast('Playing Model Run Demonstration')}
                          className="text-[#1f5eff] hover:text-blue-800 p-1.5 rounded-lg hover:bg-blue-50 cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 text-xs font-bold grid place-items-center shrink-0">
                            ZIP
                          </span>
                          <div>
                            <span className="font-bold text-[#1c2333] block text-[11px]">
                              Dataset (Sample)
                            </span>
                            <span className="text-[10px] text-[#5b6478]">ZIP · 15.6 MB</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => showToast('Downloading Sample Dataset (15.6 MB)')}
                          className="text-[#1f5eff] hover:text-blue-800 p-1.5 rounded-lg hover:bg-blue-50 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: NOTES */}
              {resourceTab === 'notes' && (
                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-[#1c2333] text-xs">My lesson notes</h3>
                    <p className="text-[11px] text-[#5b6478] mt-0.5">
                      Private notes saved to your learning space.
                    </p>
                  </div>

                  <textarea
                    rows={8}
                    value={userNotes}
                    onChange={(e) => setUserNotes(e.target.value)}
                    placeholder="Write your observation notes for this lesson..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-[#1f5eff]/30"
                  />

                  <button
                    type="button"
                    onClick={() => showToast('Notes saved successfully.')}
                    className="w-full py-2 bg-[#1f5eff] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save notes</span>
                  </button>
                </div>
              )}

              {/* TAB 3: DISCUSSION */}
              {resourceTab === 'discussion' && (
                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-[#1c2333] text-xs">Lesson discussion</h3>
                    <p className="text-[11px] text-[#5b6478] mt-0.5">
                      Ask questions and share insights with your learning group.
                    </p>
                  </div>

                  <form onSubmit={handlePostComment} className="space-y-2">
                    <textarea
                      rows={3}
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Ask Dr. Menon or peers a question..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#1f5eff]/30"
                    />
                    <button
                      type="submit"
                      className="w-full py-1.5 bg-[#1f5eff] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                    >
                      <Send className="w-3 h-3" />
                      <span>Post comment</span>
                    </button>
                  </form>

                  {/* Comment stream */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-100 max-h-60 overflow-y-auto">
                    {comments.map((c) => (
                      <div key={c.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{c.author}</span>
                          <span className="text-[10px] text-slate-400">{c.time}</span>
                        </div>
                        <span className="text-[10px] text-blue-700 font-medium block">
                          {c.role}
                        </span>
                        <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">
                          {c.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        ) : (
          /* Vertical Restore Dock on Right Edge matching image_c48c9581.png */
          <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 bg-white rounded-2xl border border-[#e6e9f2] shadow-xl p-2 flex flex-col items-center gap-2 animate-in fade-in">
            <button
              type="button"
              onClick={() => {
                setResourceTab('materials');
                setIsResourceCollapsed(false);
              }}
              className="p-2 rounded-xl text-[#1f5eff] hover:bg-blue-50 transition-colors cursor-pointer"
              title="Open Materials"
            >
              <FileText className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setResourceTab('notes');
                setIsResourceCollapsed(false);
              }}
              className="p-2 rounded-xl text-[#1f5eff] hover:bg-blue-50 transition-colors cursor-pointer"
              title="Open Notes"
            >
              <Save className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setResourceTab('discussion');
                setIsResourceCollapsed(false);
              }}
              className="p-2 rounded-xl text-[#1f5eff] hover:bg-blue-50 transition-colors cursor-pointer"
              title="Open Discussion"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
