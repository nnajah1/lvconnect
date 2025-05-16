import "./student_information.css";

export default function SectionHeader({ title, isSubsection = false }) {
  return (
    <div className="header-container">
      {isSubsection ? (
        <p className="header-subtitle">{title}</p>
      ) : (
        <h2 className="header-title">{title}</h2>
      )}
    </div>
  )
}
