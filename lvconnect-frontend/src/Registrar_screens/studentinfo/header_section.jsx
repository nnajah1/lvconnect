import "./student_information.css"

export default function SectionHeader({ title, isSubsection = false }) {
  return (
    <div className="header_container">
      {isSubsection ? (
        <p className="header_subtitle">{title}</p>
      ) : (
        <h2 className="header_title">{title}</h2>
      )}
    </div>
  )
}
