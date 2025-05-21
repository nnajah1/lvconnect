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
    "Catholic",
    "Islam",
    "Protestant",
    "Iglesia ni Cristo",
    "Seventh Day Adventist",
    "Born Again Christian",
    "Buddhist",
    "Hindu",
    "Judaism",
    "Other",
  ]

  export const programOptions = [
  {
    "id": 1,
    "name": "Bachelor of Science in Computer Science"
  },
  {
    "id": 2,
    "name": "Bachelor of Arts in Psychology"
  }
]

export const partialFieldsStudent = [
  "religion", 
  "fb_link", 
  "mobile_number", 
  
];

export const partialFieldsAdmin = [
  ...partialFieldsStudent, 
  //image
  "program_id",
  "year_level",

];
