
import { ChevronLeft } from "lucide-react"
import "@/styles/student_information.css"
import { Button } from "../ui/button"

export default function ActionButtons({
  isEditing,
  handleSave,
  handleArchive,
  handleCancel,
  handleEditToggle,
  handleBack,
  mode,
  editType,
  userRole
}) {
  return (
    <div className="add_actions_container">
      {/* <button className="add_back_btn" onClick={handleBack}>
        <ChevronLeft className="add_back_icon" />
      </button> */}

      {mode === "edit" && (
        <div className="add_btn_group">
          {isEditing ? (
            <>
              {userRole === "registrar" && (
                <>
                
                  <button onClick={handleCancel} className="add_action_btn cancel">Cancel</button>
                  {editType === "full" && (
                    <>
                      <button onClick={handleSave} className="add_action_btn save">Save</button>
                      {/* <button onClick={handleArchive} className="add_action_btn archive">Archive</button> */}
                    </>
                  )}

                  {editType === "partial" && (
                    <button onClick={handleSave} className="add_action_btn save">Submit</button>
                  )}
                </>
              )}
              {userRole === "student" && (
                <button onClick={handleSave} className="add_action_btn save">Submit</button>
              )}

            </>
          ) : (
            <Button
              // onClick={handleEditToggle} 
              disabled
              className="">Enrolled</Button>
          )}
        </div>
      )}
    </div>
  )
}
