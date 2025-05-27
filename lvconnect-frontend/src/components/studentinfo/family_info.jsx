

import "@/styles/student_information.css"
import FormField from "./form_field";
export default function FamilyInfoSection({ familyInfo, isEditing, onChange, canEditField }) {
const handleChange = (e) => {
  const { name, type, value, checked } = e.target;
  const fullFieldName = `student_family_info.${name}`;

  let parsedValue = value;
  if (type === "checkbox") {
    parsedValue = checked;
  } else if (type === "radio") {
    parsedValue = value === "true" ? true : value === "false" ? false : value;
  }

  onChange(fullFieldName, parsedValue);
};


  return (
    <div className="family-container">
      <div className="family-content">
        {/* Number of Children */}
        <FormField
          label="Number of Children in Family"
          name="num_children_in_family"
          value={familyInfo.num_children_in_family}
          onChange={handleChange}
          isEditing={canEditField("num_children_in_family")}
          type="num"
          maxLength={2}
          inputMode="numeric"
          placeholder="e.g. 1"
        />

        <FormField
          label="Birth Order"
          name="birth_order"
          value={familyInfo.birth_order}
          onChange={handleChange}
          isEditing={canEditField("birth_order")}
          type="num"
          maxLength={2}
          inputMode="numeric"
          placeholder="e.g. 1"
        />

        {/* Siblings in LVCC */}
          <FormField
            label="Has Sibling in LVCC"
            name="has_sibling_in_lvcc"
            value={familyInfo.has_sibling_in_lvcc}
            isEditing={canEditField("has_sibling_in_lvcc")}
            onChange={handleChange}
            type="radio"
            options={[
              { label: "Yes", value: true },
              { label: "No", value: false },
            ]}
          />
            {/* <FormField
  label="Agrees to Privacy Policy"
  name="privacy_policy"
  value={familyInfo.privacy_policy}
  isEditing={canEditField("privacy_policy")}
  onChange={handleChange}
  type="checkbox"
/> */}
      </div>
    </div>
  )
}
