import React from 'react';
import lvcc_libray_logo from '../assets/lvcc_library_logo.jpg'
import lvcc_logo from '../assets/lvcc_logo.jpg'




// const SchoolServices = () => {
//   return (
//     <div className="school-service-container">
//       <div className="school-service-header">School Services</div>
//       <div className="school-service-grid">
//         <a
//           href="https://lms.laverdad.edu.ph/login/"
//           target="_blank"
//           rel="noopener noreferrer"
//           className="school-service-card"
//         >
//           <FcGraduationCap className="school-service-icon" />
//           <span className="school-service-title">
//             LVCC<br />Learning Management System
//           </span>
//         </a>

//         <a
//           href="https://www.lvcclibrary.digital/"
//           target="_blank"
//           rel="noopener noreferrer"
//           className="school-service-card"
//         >
//           <GiOpenBook className="school-service-icon custom-color-icon" />
//           <span className="school-service-title">
//             LVCC<br />Digital Library
//           </span>
//         </a>

//         <a
//           href="/coming-soon"
//           target="_blank"
//           rel="noopener noreferrer"
//           className="school-service-card"
//         >
//           <GiNotebook className="school-service-icon custom-color-icon" />
//           <span className="school-service-title">
//             LVCC<br />Faculty Performance Evaluation
//           </span>
//         </a>

//         <div></div>
//       </div>
//     </div>
//   );
// };

// export default SchoolServices;





const InstitutionalSystems = () => {
  return (
    <div className="box-border flex flex-col items-start p-2.5 gap-2.5 w-full max-w-full border border-solid border-[#CED4DA] rounded-lg mx-auto">
      <div className="flex flex-col items-start p-0 w-full">
        <h5 className="font-lato font-semibold text-lg leading-5 text-[#1F3463] mb-3">
          Institutional Systems
        </h5>

        <div className="font-inter font-medium text-sm flex items-center text-[#686868]">
          Access other institutional systems through quick links
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch p-2.5 gap-2.5 w-full">
  {/* First Card */}
  <a
    href="https://www.lvcclibrary.digital/"
    className="box-border flex flex-col justify-between items-center py-3 px-2.5 gap-2.5 w-full sm:w-[230px] border border-solid border-[#CED4DA] rounded-[4px] mb-2.5 sm:mb-0 transition-all hover:shadow-md"
  >
    <div className="flex flex-col items-center p-[1px] gap-2.5 w-auto h-auto">
      <img src={lvcc_libray_logo} className="w-[80px] h-auto object-contain" />
    </div>
    <div className="box-border flex flex-col justify-center items-center py-1 px-3 gap-2.5 w-full max-w-[210px] border-[0.5px] border-solid border-[#CED4DA] rounded-[2px]">
      <div className="font-inter font-sm text-[11px] flex items-center text-center text-black">
        LVCC Digital Library
      </div>
    </div>
  </a>

  {/* Second Card */}
  <a
    href="https://lms.laverdad.edu.ph/login/"
    className="box-border flex flex-col justify-between items-center py-3 px-2.5 gap-2.5 w-full sm:w-[230px] border border-solid border-[#CED4DA] rounded-[4px] mb-2.5 sm:mb-0 transition-all hover:shadow-md"
  >
    <div className="flex flex-col items-center p-[1px] gap-2.5 w-auto h-auto">
      <img src={lvcc_logo} className="w-[80px] h-auto object-contain" />
    </div>
    <div className="box-border flex flex-col justify-center items-center py-1 px-3 gap-2.5 w-full max-w-[210px] border-[0.5px] border-solid border-[#CED4DA] rounded-[2px]">
      <div className="font-inter font-sm text-[11px] leading-[14px] flex items-center text-center text-black">
        LVCC Learning Management System
      </div>
    </div>
  </a>

  {/* Third Card */}
  <a
    href="https://tpes.vercel.app/login"
    className="box-border flex flex-col justify-between items-center py-3 px-2.5 gap-2.5 w-full sm:w-[230px] border border-solid border-[#CED4DA] rounded-[4px] transition-all hover:shadow-md"
  >
    <div className="flex flex-col items-center p-[1px] gap-2.5 w-auto h-auto">
      <img src={lvcc_logo} className="w-[80px] h-auto object-contain" />
    </div>
    <div className="box-border flex flex-col justify-center items-center py-1 px-3 gap-2.5 w-full max-w-[210px] border-[0.5px] border-solid border-[#CED4DA] rounded-[2px]">
      <div className="font-inter font-sm text-[11px] leading-[14px] flex items-center text-center text-black">
        LVCC TPES
      </div>
    </div>
  </a>
</div>

    </div>
  )
}

export default InstitutionalSystems
