import { useAuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

// Define permissions for each role
const rolePermissions = {
  student: [{ path: "/", label: "View Approved Posts" }],
  comms: [
    { path: "posts/create", label: "Create Post" },
    { path: "posts/edit", label: "Edit My Posts" },
    { path: "posts/publish", label: "Publish Approved Posts" },
  ],
  scadmin: [{ path: "posts/review", label: "Review Submitted Posts" }],
};

const AdminDashboard = () => {
  const { user } = useAuthContext();
  const links = rolePermissions[user.role] || [];


  return (
    <div>

      {links.map(({ path, label }) => (
        <Link key={path} to={path}>
          {label}
        </Link>
      ))}
    </div>
  );
};

export default AdminDashboard;
