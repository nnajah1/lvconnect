 import {
  HiOutlineUsers,
  HiOutlineClipboardList,
  HiOutlineExclamationCircle,
  HiOutlineChartPie,
} from 'react-icons/hi';


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
  mandatory_surveys: {
    label: 'Mandatory Surveys',
    icon: HiOutlineExclamationCircle,
    color: 'bg-red-500',
  },
  total_answers_submitted: {
    label: 'Total Submissions',
    icon: HiOutlineChartPie,
    color: 'bg-green-500',
  },
};