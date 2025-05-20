;

import { useState } from "react";
import "../Registrar_screens/registrar_styling/admin_soa.css";

const AdminView = () => {
  const [formData, setFormData] = useState({
    schoolYear: "",
    tuitionFee: {
      ratePerUnit: "",
      units: "",
    },
    miscFees: [],
    scholarshipDiscount: "",
    programInfo: "",
  });

  const [newFee, setNewFee] = useState({
    name: "",
    amount: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const processedValue = type === "number" ? (value === "" ? "" : Math.max(0, Number(value))) : value;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: processedValue,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: processedValue,
      });
    }
  };

  const handleMiscFeeChange = (index, e) => {
    const { name, value, type } = e.target;
    const updatedFees = [...formData.miscFees];
    updatedFees[index][name] = type === "number" ? (value === "" ? "" : Math.max(0, Number(value))) : value;

    setFormData({
      ...formData,
      miscFees: updatedFees,
    });
  };

  const handleNewFeeChange = (e) => {
    const { name, value, type } = e.target;
    setNewFee({
      ...newFee,
      [name]: type === "number" ? (value === "" ? "" : Math.max(0, Number(value))) : value,
    });
  };

  const addNewFee = () => {
    if (!newFee.name.trim() || newFee.amount === "" || Number(newFee.amount) <= 0) {
      alert("Please enter a valid fee name and a positive amount.");
      return;
    }

    setFormData({
      ...formData,
      miscFees: [...formData.miscFees, { ...newFee, amount: Number(newFee.amount) }],
    });
    setNewFee({ name: "", amount: "" });
  };

  const removeFee = (index) => {
    const updatedFees = [...formData.miscFees];
    updatedFees.splice(index, 1);
    setFormData({
      ...formData,
      miscFees: updatedFees,
    });
  };

  const calculateTotals = () => {
    const rate = parseFloat(formData.tuitionFee.ratePerUnit) || 0;
    const units = parseFloat(formData.tuitionFee.units) || 0;
    const tuitionTotal = rate * units;

    const miscTotal = formData.miscFees.reduce((sum, fee) => sum + (parseFloat(fee.amount) || 0), 0);
    const semesterTotal = tuitionTotal + miscTotal;
    const yearTotal = semesterTotal * 2;
    const scholarship = parseFloat(formData.scholarshipDiscount) || 0;

    return {
      tuitionTotal,
      miscTotal,
      semesterTotal,
      yearTotal,
      totalPayment: yearTotal - scholarship,
    };
  };

  const { tuitionTotal, miscTotal, semesterTotal, yearTotal, totalPayment } = calculateTotals();

  const handleSubmit = (e) => {
    e.preventDefault();

    const completeData = {
      ...formData,
      tuitionFee: {
        ...formData.tuitionFee,
        total: tuitionTotal,
      },
      miscTotal,
      semesterTotal,
      yearTotal,
      totalPayment,
    };

 
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="admin-header-title">
          <h1>Statement of Account of Students</h1>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h2 className="section-title">General Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="input-label">School Year</label>
                <input
                  type="text"
                  name="schoolYear"
                  value={formData.schoolYear}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="input-label">Program & Year Level</label>
                <input
                  type="text"
                  name="programInfo"
                  value={formData.programInfo}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="section-title">Tuition Fee</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="input-label">Rate Per Unit (₱)</label>
                <input
                  type="number"
                  name="tuitionFee.ratePerUnit"
                  value={formData.tuitionFee.ratePerUnit}
                  onChange={handleInputChange}
                  className="input-field"
                  min="0"
                />
              </div>
              <div>
                <label className="input-label">Number of Units</label>
                <input
                  type="number"
                  name="tuitionFee.units"
                  value={formData.tuitionFee.units}
                  onChange={handleInputChange}
                  className="input-field"
                  min="0"
                />
              </div>
            </div>
            <div className="mt-2">
              <p className="font-medium">Tuition Fee Total: ₱{tuitionTotal.toLocaleString()}.00</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="section-title">Miscellaneous Fees</h2>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr className="bg-gray-100">
                    <th>Fee Name</th>
                    <th>Amount (₱)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.miscFees.map((fee, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          name="name"
                          value={fee.name}
                          onChange={(e) => handleMiscFeeChange(index, e)}
                          className="input-field"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="amount"
                          value={fee.amount}
                          onChange={(e) => handleMiscFeeChange(index, e)}
                          className="input-field"
                          min="0"
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => removeFee(index)}
                          className="remove-fee-button"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td>
                      <input
                        type="text"
                        name="name"
                        value={newFee.name}
                        onChange={handleNewFeeChange}
                        placeholder="New fee name"
                        className="input-field"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="amount"
                        value={newFee.amount}
                        onChange={handleNewFeeChange}
                        placeholder="Amount"
                        className="input-field"
                        min="0"
                      />
                    </td>
                    <td>
                    <button
                      type="button"
                      onClick={addNewFee}
                      className="add-fee-button"
                      disabled={!newFee.name.trim() || !newFee.amount}
                    >
                      Add Fee
                    </button>

                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100">
                    <td className="font-semibold">Miscellaneous Fee Total</td>
                    <td className="font-semibold" colSpan="2">
                      ₱{miscTotal.toLocaleString()}.00
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="section-title">Scholarship & Totals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="input-label">Scholarship Discount (₱)</label>
                <input
                  type="number"
                  name="scholarshipDiscount"
                  value={formData.scholarshipDiscount}
                  onChange={handleInputChange}
                  className="input-field"
                  min="0"
                />
              </div>
            </div>

            <div className="total-container">
              <div className="grid grid-cols-2 gap-2">
                <p className="font-medium">Miscellaneous Fees + Tuition Fee for 1st semister and 2nd semister:</p>
                <p>₱{semesterTotal.toLocaleString()}.00</p>

                <p className="font-medium">Academic Year Total:</p>
                <p>₱{yearTotal.toLocaleString()}.00</p>

                <p className="font-medium">Scholarship Discount:</p>
                <p>₱{(parseFloat(formData.scholarshipDiscount) || 0).toLocaleString()}.00</p>

                <p className="font-semibold text-lg">Total Payment:</p>
                <p className="font-semibold text-lg">₱{totalPayment.toLocaleString()}.00</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminView;