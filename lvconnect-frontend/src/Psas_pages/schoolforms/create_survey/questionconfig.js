
export const QUESTION_TYPES = [
    "Multiple choice",
    "Checkboxes",
    "Dropdown",
    "Short answer",
    "File upload",
  ];
  
  export const isChoiceBased = (type) =>
    ["Multiple choice", "Checkboxes", "Dropdown"].includes(type);
  
  export const createEmptyQuestion = () => ({
    id: Date.now(),
    question: "",
    type: QUESTION_TYPES[0],
    choices: [""] ,
    required: false,
    files: [],
  });
  