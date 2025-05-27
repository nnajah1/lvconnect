import Navbar from "../users_dashboards/dasboards_components/navbar";

const StudentNavbar = () => {
  // Dummy data
  const userName = "TEAM 4";
  const userAvatar = ""; 

  return <Navbar userName={userName} userRole="Student" userAvatar={userAvatar} />;
};

export default StudentNavbar;
