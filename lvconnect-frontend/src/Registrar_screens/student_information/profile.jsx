
import FormField from "./formfield"
import "../registrar_styling/student_information.css"

export default function ProfileSection({ profileData, profileImage, onChangeImage, isEditing, onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    onChange("profile", name, value)
  }

  return (
    <div className="profile-container">
      <div className="profile-left">
        <p className="profile-label">Profile Picture</p>
        <div className="profile-image-wrapper">
          <div className="profile-image-container">
            <img
              src={profileImage || ""}
              alt="Profile"
              className="profile-image"
            />
          </div>
          <button onClick={onChangeImage} className="profile-change-button">
            Change
          </button>
        </div>
      </div>

      <div className="profile-right">
        <div className="profile-grid">
          <FormField
            label="Program"
            value={profileData.program}
            isEditing={isEditing}
            onChange={handleChange}
            name="program"
          />
          <FormField
            label="Year"
            value={profileData.year}
            maxWidth="md:max-w-[200px]"
            isEditing={isEditing}
            onChange={handleChange}
            name="year"
          />
        </div>

        <div className="profile-subgrid">
          <FormField
            label="Student Number"
            value={profileData.studentNumber}
            maxWidth="md:max-w-[200px]"
            isEditing={isEditing}
            onChange={handleChange}
            name="studentNumber"
          />
          <FormField
            label="Email address"
            value={profileData.email}
            isEditing={isEditing}
            onChange={handleChange}
            name="email"
          />
        </div>
      </div>
    </div>
  )
}
