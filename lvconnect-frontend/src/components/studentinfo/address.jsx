

import FormField from "./form_field"
import SectionHeader from "./header_section"
import '@/styles/student_information.css'

export default function AddressSection({ addressInfo, onChange, canEditField }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <div className="address-container">
      <SectionHeader title="Permanent Address" isSubsection={true} />

      <div className="address-grid">
        <FormField
          label="Province"
          value={addressInfo.province}
          isEditing={canEditField("province")}
          onChange={handleChange}
          name="province"
        />
        <FormField
          label="City/Municipality"
          value={addressInfo.city_municipality}
          isEditing={canEditField("city_municipality")}
          onChange={handleChange}
          name="city_municipality"
        />
        <FormField
          label="Barangay"
          value={addressInfo.barangay}
          isEditing={canEditField("barangay")}
          onChange={handleChange}
          name="barangay"
        />
        <div className="address-empty-col" />
      </div>

      <div className="address-grid">
        {/* <div className="address-full-field">
          <label className="address-label">Address</label>
          {isEditing ? (
            <input
              type="text"
              name="address"
              value={addressInfo.address}
              onChange={handleChange}
              className="address-input"
            />
          ) : (
            <div className="address-display">
              <span className="address-text">{addressInfo.address}</span>
            </div>
          )}
        </div> */}
        <FormField
          label="Building No."
          value={addressInfo["floor/unit/building_no"]}
          isEditing={canEditField("floor/unit/building_no")}
          onChange={handleChange}
          name="floor/unit/building_no"
        />

        <FormField
          label="House No./street"
          value={addressInfo["house_no/street"]}
          isEditing={canEditField("house_no/street")}
          onChange={handleChange}
          name="house_no/street"
        />
        <FormField
          type="text"
          maxLength={4}
          inputMode="numeric"
          label="Zip Code"
          value={addressInfo.zip_code}
          isEditing={canEditField("zip_code")}
          onChange={handleChange}
          name="zip_code"
        />
        <div className="address-empty-col" />
      </div>
    </div>
  )
}
