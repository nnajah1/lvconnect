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
]

export const programOptions = [
  {
    "id": 1,
    "name": "BSIS"
  },
  {
    "id": 2,
    "name": "BSA"
  },
  {
    "id": 3,
    "name": "BAB"
  },
  {
    "id": 4,
    "name": "BSAIS"
  },
  {
    "id": 5,
    "name": "BSSW"
  },
  {
    "id": 6,
    "name": "ACT"
  }
]



export const partialFieldsStudent = [
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
  "guardian_religion",
  "guardian_occupation",
  "guardian_monthly_income",
  "guardian_mobile_number",
  "guardian_relationship",
  "privacy_policy"
];

export const partialFieldsAdmin = [
  ...partialFieldsStudent,
  //image
  "program_id",
  "year_level",

];
