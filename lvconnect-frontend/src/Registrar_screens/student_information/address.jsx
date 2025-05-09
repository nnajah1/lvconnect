import FormField from "./formfield";
import SectionHeader from "./header_section";
import "../registrar_styling/student_information.css"

export default function AddressSection({ addressInfo, isEditing, onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange("address", name, value);
  };

  return (
    <div className="address-container">
      <SectionHeader title="Permanent Address" isSubsection={true} />

      <div className="address-grid">
        <FormField
          label="Province"
          value={addressInfo.province}
          isEditing={isEditing}
          onChange={handleChange}
          name="province"
        />
        <FormField
          label="City/Municipality"
          value={addressInfo.cityMunicipality}
          isEditing={isEditing}
          onChange={handleChange}
          name="cityMunicipality"
        />
        <FormField
          label="Barangay"
          value={addressInfo.barangay}
          isEditing={isEditing}
          onChange={handleChange}
          name="barangay"
        />
        <div className="address-empty-column" />
      </div>

      <div className="address-grid">
        <div className="address-address">
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
        </div>
        <FormField
          label="Zip Code"
          value={addressInfo.zipCode}
          isEditing={isEditing}
          onChange={handleChange}
          name="zipCode"
        />
        <div className="address-empty-column" />
      </div>
    </div>
  );
}
