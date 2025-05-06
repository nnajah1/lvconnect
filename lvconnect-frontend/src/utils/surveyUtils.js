
export const QUESTION_TYPES = [
  'Short answer',
  'Multiple choice', 
  'Checkboxes', 
  'Dropdown',  
  'Upload Photo'];
  
export const isChoiceBased = (type) => [
  'Multiple choice', 
  'Checkboxes', 
  'Dropdown'].includes(type);

  export const emptyQuestion  = () => ({
    id: crypto.randomUUID(),
    question: "",
    type: QUESTION_TYPES[0],
    choices: [""] ,
    is_required: false,
    files: [],
  });
  