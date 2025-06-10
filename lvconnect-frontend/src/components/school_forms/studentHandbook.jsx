import React from 'react';

const StudentHandbook = () => {
  const sections = [
    { title: 'Welcome Message', id: 'welcome' },
    { title: 'Vision & Mission', id: 'vision' },
    { title: 'Academic Policies', id: 'policies' },
    { title: 'Code of Conduct', id: 'conduct' },
    { title: 'Grading System', id: 'grading' },
    { title: 'Contact Info', id: 'contact' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800 space-y-10">
      {/* Cover */}
      <div className="text-center py-10 border-b">
        <h1 className="text-4xl font-bold">Student Handbook</h1>
        <p className="mt-2 text-lg text-gray-600">Academic Year 2024–2025</p>
      </div>

      {/* Table of Contents */}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Table of Contents</h2>
        <ul className="list-disc list-inside text-blue-600">
          {sections.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`} className="hover:underline">{section.title}</a>
            </li>
          ))}
        </ul>
      </div>

      {/* Sections */}
      <div className="space-y-12">
        {/* Welcome Message */}
        <section id="welcome">
          <h3 className="text-xl font-semibold mb-2">Welcome Message</h3>
          <p>
            Welcome to our institution! This handbook provides you with essential information about your academic life,
            responsibilities, and the services available to support your success.
          </p>
        </section>

        {/* Vision & Mission */}
        <section id="vision">
          <h3 className="text-xl font-semibold mb-2">Vision & Mission</h3>
          <p><strong>Vision:</strong> To be a center of excellence in education and innovation.</p>
          <p><strong>Mission:</strong> To provide accessible, inclusive, and high-quality learning that empowers students for life and career.</p>
        </section>

        {/* Academic Policies */}
        <section id="policies">
          <h3 className="text-xl font-semibold mb-2">Academic Policies</h3>
          <ul className="list-disc list-inside">
            <li>Students must maintain a minimum GPA of 2.00.</li>
            <li>Regular class attendance is required.</li>
            <li>Plagiarism and cheating are serious offenses and subject to disciplinary action.</li>
          </ul>
        </section>

        {/* Code of Conduct */}
        <section id="conduct">
          <h3 className="text-xl font-semibold mb-2">Code of Conduct</h3>
          <p>
            Students are expected to act with integrity, respect fellow students and staff, and comply with school rules at all times.
            Any form of bullying, discrimination, or violence is prohibited.
          </p>
        </section>

        {/* Grading System */}
        <section id="grading">
          <h3 className="text-xl font-semibold mb-2">Grading System</h3>
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border p-2">Grade</th>
                <th className="border p-2">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">1.00</td>
                <td className="border p-2">Excellent</td>
              </tr>
              <tr>
                <td className="border p-2">1.75</td>
                <td className="border p-2">Very Good</td>
              </tr>
              <tr>
                <td className="border p-2">3.00</td>
                <td className="border p-2">Passing</td>
              </tr>
              <tr>
                <td className="border p-2">5.00</td>
                <td className="border p-2 text-red-500">Fail</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Contact Info */}
        <section id="contact">
          <h3 className="text-xl font-semibold mb-2">Contact Information</h3>
          <p>
            For inquiries or assistance, you may contact the Student Affairs Office at:
            <br />
            <strong>Email:</strong> student.affairs@school.edu
            <br />
            <strong>Phone:</strong> (123) 456-7890
          </p>
        </section>
      </div>
    </div>
  );
};

export default StudentHandbook;
