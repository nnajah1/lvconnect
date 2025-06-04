export const incomeOptions = [
  "Below ₱10,000",
  "₱10,000 - ₱20,000",
  "₱20,001 - ₱30,000",
  "₱30,001 - ₱40,000",
  "₱40,001 - ₱50,000",
  "₱50,001 - ₱60,000",
  "₱60,001 - ₱70,000",
  "₱70,001 - ₱80,000",
  "₱80,001 - ₱90,000",
  "₱90,001 - ₱100,000",
  "Above ₱100,000",
]

export const religionOptions = [
  "MCGI",
  "Catholic",
  "Muslim",
  "Protestant",
  "Christian",
  "Seventh Day Adventist",
  "Buddhist",
  "Hindu",
  "Judaism",
  "N/A"
]

export const programOptions = [
  {
    "id": 1,
    "name": "Bachelor of Science in Information Systems",
    "value": "BSIS"
  },
  {
    "id": 2,
    "name": "Bachelor of Science in Accountancy",
    "value": "BSA"
  },
  {
    "id": 3,
    "name": "Bachelor of Arts in Broadcasting",
    "value": "BAB"
  },
  {
    "id": 4,
    "name": "Bachelor of Science in Accounting Information System",
    "value": "BSAIS"
  },
  {
    "id": 5,
    "name": "Bachelor of Science in Social Work",
    "value": "BSSW"
  },
  {
    "id": 6,
    "name": "Associate in Computer Technology",
    "value": "ACT"
  }
]


export const fields = [
  "religion",
  "fb_link",
  "mobile_number",
  "has_sibling_in_lvcc",
  "birth_order",
  "num_children_in_family",
  "floor/unit/building_no",
  "house_no/street",
  "barangay",
  "city_municipality",
  "province",
  "zip_code",
  "last_school_attended",
  "school_type",
  "previous_school_address",
  "mother_religion",
  "mother_occupation",
  "mother_monthly_income",
  "mother_mobile_number",
  "father_religion",
  "father_occupation",
  "father_monthly_income",
  "father_mobile_number",
  "guardian_first_name",
  "guardian_middle_name",
  "guardian_last_name",
  "guardian_religion",
  "guardian_occupation",
  "guardian_monthly_income",
  "guardian_mobile_number",
  "guardian_relationship",
  "privacy_policy",
  "civil_status",
  "program_id",
  "year_level",
];

export function mapToApiPayload(data, user_id, editType) {
  const baseLoad = {
    user_id,
    profileImage: data.user.avatar,
    program_id: data.program_id,
    year_level: data.year_level,
    privacy_policy: true,
    "floor/unit/building_no": data["floor/unit/building_no"],
    "house_no/street": data["house_no/street"],
    barangay: data.barangay,
    city_municipality: data.city_municipality,
    province: data.province,
    zip_code: data.zip_code,
    mobile_number: data.mobile_number,
    student_id_number: data.student_id_number,
    fb_link: data.fb_link,
    last_school_attended: data.last_school_attended,
    previous_school_address: data.previous_school_address,
    school_type: data.school_type,
    mobile_number: data.mobile_number,
    religion: data.religion,
    fb_link: data.fb_link,
    civil_status: data.civil_status,
    government_subsidy: data.government_subsidy,
    num_children_in_family: data.student_family_info.num_children_in_family,
    birth_order: data.student_family_info.birth_order,
    has_sibling_in_lvcc: data.student_family_info.has_sibling_in_lvcc,
    guardian_first_name: data.student_family_info.guardian_first_name,
    guardian_middle_name: data.student_family_info.guardian_middle_name,
    guardian_last_name: data.student_family_info.guardian_last_name,
    guardian_religion: data.student_family_info.guardian_religion,
    guardian_occupation: data.student_family_info.guardian_occupation,
    guardian_monthly_income: data.student_family_info.guardian_monthly_income,
    guardian_mobile_number: data.student_family_info.guardian_mobile_number,
    guardian_relationship: data.student_family_info.guardian_relationship,
    mother_religion: data.student_family_info.mother_religion,
    mother_occupation: data.student_family_info.mother_occupation,
    mother_monthly_income: data.student_family_info.mother_monthly_income,
    mother_mobile_number: data.student_family_info.mother_mobile_number,
    father_religion: data.student_family_info.father_religion,
    father_occupation: data.student_family_info.father_occupation,
    father_monthly_income: data.student_family_info.father_monthly_income,
    father_mobile_number: data.student_family_info.father_mobile_number,

  };
  if (editType === "partial") {
    return baseLoad;
  }

  if (editType === "full") {
    return {
      ...baseLoad,
      email: data.user.email,
      first_name: data.first_name,
      middle_name: data.middle_name,
      last_name: data.last_name,
      gender: data.gender,
      birth_date: data.birth_date,
      birth_place: data.birth_place,
      student_type: data.student_type,
      scholarship_status: data.scholarship_status,
      mother_first_name: data.student_family_info.mother_first_name,
      mother_middle_name: data.student_family_info.mother_middle_name,
      mother_last_name: data.student_family_info.father_last_name,
      father_first_name: data.student_family_info.father_first_name,
      father_middle_name: data.student_family_info.father_middle_name,
      father_last_name: data.student_family_info.father_last_name,
    };
  }
}

