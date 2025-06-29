 import {
  HiOutlineUsers,
  HiOutlineClipboardList,
  HiOutlineExclamationCircle,
  HiOutlineChartPie,
  HiOutlineQuestionMarkCircle,
} from 'react-icons/hi';
import { HiOutlineClipboardDocument } from 'react-icons/hi2';


export const statConfig = {
  current_enrolled_students: {
    label: 'Enrolled Students',
    icon: HiOutlineUsers,
    color: 'bg-blue-500',
  },
  visible_surveys: {
    label: 'Visible Surveys',
    icon: HiOutlineClipboardList,
    color: 'bg-yellow-500',
  },
  // mandatory_surveys: {
  //   label: 'Mandatory Surveys',
  //   icon: HiOutlineExclamationCircle,
  //   color: 'bg-red-500',
  // },
  total_answers_submitted: {
    label: 'Total Submissions',
    icon: HiOutlineChartPie,
    color: 'bg-green-500',
  },
  visible_forms: {
    label: 'Visible Forms',
    icon: HiOutlineChartPie,
    color: 'bg-green-500',
  },
   pending_form_submissions: {
    label: 'Pending Form Submission',
    icon: HiOutlineChartPie,
    color: 'bg-blue-500',
  },
   students_in_flooded_areas: {
    label: 'Students in Flooded Areas',
    icon: HiOutlineChartPie,
    color: 'bg-yellow-500',
  },
};

export const statSchoolAdmin = {
  current_enrolled_students: {
    label: 'Total Enrolled Students',
    icon: HiOutlineUsers,
    color: 'bg-blue-500',
  },

  pending_school_updates: {
    label: 'Pending School Updates',
    icon: HiOutlineChartPie,
    color: 'bg-yellow-500',
  },

  total_scholarship_investment: {
    label: 'Total Institutional Investment in Scholarship',
    icon: HiOutlineChartPie,
    color: 'bg-green-500',
  },
};


export const statRegistrarAdmin = {
  current_enrolled_student: {
    label: 'Total Enrolled Students',
    icon: HiOutlineUsers,
    color: 'bg-blue-500',
  },

  pending_student_count: {
    label: 'Total Pending Enrollment',
    icon: HiOutlineClipboardDocument,
    color: 'bg-green-500',
  },

  students_without_info: {
    label: 'New Student Accounts',
    icon: HiOutlineQuestionMarkCircle,
    color: 'bg-orange-500',
  },


};


export const colors = [
  '#1E3A8A', // Indigo-900 – Deep professional blue
  '#0E7490', // Cyan-700 – Muted teal
  '#16A34A', // Green-600 – Balanced and calm
  '#CA8A04', // Amber-600 – Golden warmth
  '#9333EA', // Purple-600 – Elegant and vibrant
  '#DC2626', // Red-600 – Strong but not harsh
  '#3F3F46', // Zinc-700 – Neutral dark gray
  '#0284C7', // Sky-600 – Bright yet readable
  '#7C3AED', // Violet-600 – Balanced bold
  '#64748B', // Slate-500 – Cool gray for contrast
];

