

import FormField from "./form_field"
import '@/styles/student_information.css'
import placeholderImg from "@/assets/placeholder.svg"

export default function ProfileSection({ profileData, profileImage, onChange, canEditField, programOptions, userRole }) {

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };
  
  return (
    <>
      {userRole === "student" ? (
        <div className="profile_row">
          <FormField
            label="Program"
            value={profileData.program_id || ""} 
            isEditing={canEditField("program_id")}
            onChange={handleChange}
            name="program_id"
            options={programOptions}
          />
          <FormField
            label="Year Level"
            value={profileData.year_level || ""}
            maxWidth="md:max-w-[200px]"
            isEditing={canEditField("year_level")}
            onChange={handleChange}
            name="year_level"
            options={[{ value: 1, label: "1st Year" },
            { value: 2, label: "2nd Year" }, { value: 3, label: "3rd Year" }, { value: 4, label: "4th Year" }]}
          />
        </div>) : (
        <div className="profile_section">
          <div className="profile_left">
            <p className="profile_label">Profile Picture</p>
            <div className="profile_image_wrapper">
              <div className="profile_image_box">
                <img
                  src={profileImage || placeholderImg}
                  alt="Profile"
                  className="profile_image"
                />

                {/* <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileChange}
            /> */}
              </div>
              {/* {isEditing && (
            <button onClick={onChangeImage} className="profile_change_btn">
              Change
            </button>
          )} */}
            </div>
          </div>

          <div className="profile_right">
            <div className="profile_row">
              <FormField
                label="Program"
                value={profileData.program_id || ""}
                isEditing={canEditField("program_id")}
                onChange={handleChange}
                name="program_id"
                options={programOptions}
              />
              <FormField
                label="Year Level"
                value={profileData.year_level || ""}
                maxWidth="md:max-w-[200px]"
                isEditing={canEditField("year_level")}
                onChange={handleChange}
                name="year_level"
                options={[{ value: 1, label: "1st Year" },
                { value: 2, label: "2nd Year" }, { value: 3, label: "3rd Year" }, { value: 4, label: "4th Year" }]}
              />
            </div>

            <div className="profile_row profile_row_secondary">
              <FormField
                label="Student Number"
                value={profileData.student_id_number}
                maxWidth="md:max-w-[200px]"
                isEditing={canEditField("student_id_number")}
                onChange={handleChange}
                name="student_id_number"
              />
              <FormField
                label="Email Address"
                value={profileData.user?.email}
                isEditing={canEditField("email")}
                onChange={handleChange}
                name="email"
              />
            </div>
          </div>
        </div>
      )}
    </>

  )
}
