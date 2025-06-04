
import { useEffect, useState } from "react";
import "@/styles/admin_soa.css";
import { createSoa, getActiveAcademicYear, getAllSoa, getFeeCategories, getSoa, updateSoa } from "@/services/enrollmentAPI";
import { toast } from "react-toastify";
import api from "@/services/axios";
import { Button } from "@/components/ui/button";
import { Loader3 } from "@/components/dynamic/loader";
import { SOADetailsView } from "@/components/enrollment/soaManager";
import { useUserRole } from "@/utils/userRole";

const AdminSoa = () => {
  const UserRole = useUserRole();
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(true); // Controls form visibility
  const [currentTemplateId, setCurrentTemplateId] = useState(null);
  const [currentSoaData, setCurrentSoaData] = useState(null);
  const [schoolYear, setSchoolYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [feeCategories, setFeeCategories] = useState([]);
  const [currentSoaCollapsed, setCurrentSoaCollapsed] = useState(false);
  const [collapsedSoas, setCollapsedSoas] = useState({});
  const [otherSoas, setOtherSoas] = useState([]);

  const [formData, setFormData] = useState({
    schoolYear: "",
    tuition_per_unit: "",
    total_units: "",
    miscFees: [],
    is_visible: 0,
  });

  const [newFee, setNewFee] = useState({
    fee_category_id: "",
    fee_name: "",
    amount: "",
  });

  useEffect(() => {
    const fetchYear = async () => {
      setLoading(true);
      try {
        const res = await getActiveAcademicYear();
        const activeYear = res.data.data;

        setSchoolYear(activeYear);
        setFormData((prev) => ({
          ...prev,
          schoolYear: activeYear.school_year,
        }));
      } catch (e) {
        toast.error("Failed to load active academic year");
      } finally {
        setLoading(false);
      }
    };

    const fetchFeeCategories = async () => {
      try {
        const res = await getFeeCategories();
        setFeeCategories(res.data.data);
      } catch (e) {
        toast.error("Failed to load fee categories");
      }
    };

    fetchYear();
    fetchFeeCategories();
  }, []);

  const refreshSoa = async (schoolYear) => {
    if (!schoolYear) return;

    try {
      const res = await getSoa(schoolYear);
      const data = res.data.data;

      setFormData((prev) => ({
        ...prev,
        tuition_per_unit: data.tuition_per_unit || "",
        total_units: data.total_units || "",
        miscFees: data.fees || [],
        is_visible: data.is_visible !== undefined ? data.is_visible : 1,
      }));

      setCurrentTemplateId(data.id);
      setCurrentSoaData(data);
      setIsEditing(true);
      setShowForm(false);
    } catch (err) {
      if (err.response?.status === 404) {
        console.log("No existing SOA found. Ready to create new.");
      } else {
        console.error("Error fetching SOA:", err);
      }

      setFormData((prev) => ({
        ...prev,
        tuition_per_unit: "",
        total_units: "",
        miscFees: [],
        is_visible: 0,
      }));
      setCurrentTemplateId(null);
      setCurrentSoaData(null);
      setIsEditing(false);
      setShowForm(true);
    }
  };

  useEffect(() => {
    if (schoolYear) {
      refreshSoa(schoolYear);
    }
  }, [schoolYear]);

  useEffect(() => {
    const fetchAllSoas = async () => {
      setLoading(true);
      try {
        const res = await getAllSoa();
        setOtherSoas(res.data);
      } catch (err) {
        toast.error("Failed to fetch SOAs");
      } finally {
        setLoading(false);
      }
    };

    fetchAllSoas();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let processedValue;

    if (type === "checkbox") {
      processedValue = checked;
    } else if (type === "number") {
      processedValue = value === "" ? "" : Math.max(0, Number(value));
    } else {
      processedValue = value;
    }

    setFormData({
      ...formData,
      [name]: processedValue,
    });
  };

  const handleMiscFeeChange = (index, e) => {
    const { name, value, type } = e.target;
    const updatedFees = [...formData.miscFees];

    if (type === "number") {
      updatedFees[index][name] = value === "" ? "" : Math.max(0, Number(value));
    } else {
      updatedFees[index][name] = value;
    }

    setFormData({
      ...formData,
      miscFees: updatedFees,
    });
  };

  const handleNewFeeChange = (e) => {
    const { name, value, type } = e.target;
    let processedValue;

    if (type === "number") {
      processedValue = value === "" ? "" : Math.max(0, Number(value));
    } else {
      processedValue = value;
    }

    setNewFee({
      ...newFee,
      [name]: processedValue,
    });
  };

  const addNewFee = () => {
    if (!newFee.fee_name.trim() ||
      newFee.amount === "" ||
      Number(newFee.amount) <= 0 ||
      !newFee.fee_category_id) {
      toast.info("Please enter a valid fee category, fee name, and a positive amount.");
      return;
    }

    setFormData({
      ...formData,
      miscFees: [...formData.miscFees, {
        ...newFee,
        amount: Number(newFee.amount),
        fee_category_id: Number(newFee.fee_category_id)
      }],
    });
    setNewFee({ fee_category_id: "", fee_name: "", amount: "" });
  };

  const removeFee = (index) => {
    const updatedFees = [...formData.miscFees];
    updatedFees.splice(index, 1);
    setFormData({
      ...formData,
      miscFees: updatedFees,
    });
  };

  const handleEdit = () => {
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    if (currentSoaData) {
      // Reset form data to current SOA data - preserve schoolYear
      setFormData(prev => ({
        schoolYear: prev.schoolYear, // Keep the schoolYear from formData
        tuition_per_unit: currentSoaData.tuition_per_unit || "",
        total_units: currentSoaData.total_units || "",
        miscFees: currentSoaData.fees || [],
        is_visible: currentSoaData.is_visible !== undefined ? currentSoaData.is_visible : true,
      }));
      setShowForm(false);
    }
  };

  const toggleCurrentSoa = () => {
    setCurrentSoaCollapsed(!currentSoaCollapsed);
  };

  const toggleSoa = (soaId) => {
    setCollapsedSoas(prev => ({
      ...prev,
      [soaId]: !prev[soaId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tuition_per_unit || !formData.total_units) {
      toast.error("Please fill in tuition per unit and total units");
      return;
    }

    if (formData.miscFees.length === 0) {
      toast.error("Please add at least one miscellaneous fee");
      return;
    }

    try {
      // Create new categories 
      const resolvedFees = await Promise.all(
        formData.miscFees.map(async (fee) => {
          if (fee.category_name && !fee.fee_category_id) {
            const res = await api.post("/api/fee-categories", {
              name: fee.category_name.trim(),
            });
            return {
              ...fee,
              fee_category_id: res.data.data.id,
            };
          }
          return fee;
        })
      );

      // Prepare final payload
      const payload = {
        is_visible: formData.is_visible,
        tuition_per_unit: parseFloat(formData.tuition_per_unit),
        total_units: parseInt(formData.total_units),
        fees: resolvedFees.map((fee) => ({
          fee_category_id: parseInt(fee.fee_category_id),
          fee_name: fee.fee_name,
          amount: parseFloat(fee.amount),
        })),
      };

      // Submit the SOA
      let res;
      if (isEditing && currentTemplateId) {
        res = await updateSoa(currentTemplateId, payload);
        toast.success("SOA updated successfully!");
        refreshSoa(schoolYear);
      } else {
        res = await createSoa(payload);
        toast.success("SOA created successfully!");
        refreshSoa(schoolYear);
        setCurrentTemplateId(res.data.data.id);
        setCurrentSoaData(res.data.data);
        setIsEditing(true);
      }

      // Update current SOA data and hide form
      const updatedSoaData = {
        ...payload,
        id: currentTemplateId || res?.data?.data?.id,
        fees: resolvedFees,
        school_year: formData.schoolYear
      };
      setCurrentSoaData(updatedSoaData);
      setShowForm(false);

    } catch (error) {
      console.error("Failed to submit SOA", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };


  const calculateTotals = () => {
    const rate = parseFloat(formData.tuition_per_unit) || 0;
    const units = parseFloat(formData.total_units) || 0;
    const tuitionTotal = rate * units;
    const miscTotal = formData.miscFees.reduce((sum, fee) => sum + (parseFloat(fee.amount) || 0), 0);
    const termTotal = tuitionTotal + miscTotal;
    const yearTotal = termTotal * 2;

    return { tuitionTotal, miscTotal, termTotal, yearTotal };
  };

  const { tuitionTotal, miscTotal, termTotal, yearTotal } = calculateTotals();

  console.log(otherSoas)
  if (loading) {
    return <Loader3 />
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Statement of Account Management</h1>

        {/* Current SOA Section - Collapsible */}
        {!loading && currentSoaData && !showForm && (
          <SOADetailsView
            soaData={currentSoaData}
            isCollapsed={currentSoaCollapsed}
            onToggle={toggleCurrentSoa}
            title={`Current SOA for ${currentSoaData.school_year || formData.schoolYear}`}
            handleEdit={handleEdit}
            userRole={UserRole}
          />
        )}

        {/* Other SOAs Section */}
        {!loading && !showForm && otherSoas.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Previous SOAs</h2>
            <div className="space-y-4">
              {otherSoas.map((soa) => (
                <SOADetailsView
                  key={soa.id}
                  soaData={soa}
                  isCollapsed={collapsedSoas[soa.id] || false}
                  onToggle={() => toggleSoa(soa.id)}
                  title={`SOA for ${soa.school_year}`}
                  isOther={true}
                  userRole={UserRole}
                />
              ))}
            </div>
          </div>
        )}

        {/* Create New SOA Button */}
        {/* {!loading && !showForm && (
          <div className="flex justify-center">
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Create New SOA
            </button>
          </div>
        )} */}

        {/* Form Section */}
        {!loading && showForm && (
          <div className="space-y-6">
            {/* Header with Visibility Toggle */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {isEditing ? 'Edit SOA' : 'Create New SOA'}
              </h2>
              <div className="flex items-center gap-4">
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_visible"
                    name="is_visible"
                    checked={formData.is_visible}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 m-auto"
                  />
                  <label htmlFor="is_visible" className="text-sm font-medium text-gray-700">
                    Visible to Students
                  </label>
                </div>
              </div>
            </div>

            {/* General Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-3">General Information</h3>
              <div className="max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">School Year</label>
                <input
                  type="text"
                  value={formData.schoolYear}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
                />
              </div>
            </div>

            {/* Tuition Fee */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-3">Tuition Fee</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rate Per Unit (₱)</label>
                  <input
                    type="number"
                    name="tuition_per_unit"
                    value={formData.tuition_per_unit}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Units</label>
                  <input
                    type="number"
                    name="total_units"
                    value={formData.total_units}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>
              </div>
              <div className="text-sm font-medium text-gray-700">
                Tuition Fee Total: ₱{tuitionTotal.toLocaleString()}.00
              </div>
            </div>

            {/* Miscellaneous Fees */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-3">Miscellaneous Fees</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-white">
                      <th className="text-left py-2 px-3">Fee Category</th>
                      <th className="text-left py-2 px-3">Fee Name</th>
                      <th className="text-left py-2 px-3">Amount (₱)</th>
                      <th className="text-left py-2 px-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.miscFees.map((fee, index) => (
                      <tr key={index} className="border-b bg-white">
                        <td className="py-2 px-3">
                          <select
                            name="fee_category_id"
                            value={fee.fee_category_id}
                            onChange={(e) => handleMiscFeeChange(index, e)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="">Select Category</option>
                            {feeCategories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            name="fee_name"
                            value={fee.fee_name}
                            onChange={(e) => handleMiscFeeChange(index, e)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            name="amount"
                            value={fee.amount}
                            onChange={(e) => handleMiscFeeChange(index, e)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                            min="0"
                            step="0.01"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <button
                            type="button"
                            onClick={() => removeFee(index)}
                            className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                    {/* Add New Fee Row */}
                    <tr className="border-b bg-blue-50">
                      <td className="py-2 px-3">
                        <select
                          name="fee_category_id"
                          value={newFee.fee_category_id}
                          onChange={handleNewFeeChange}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="">Select Category</option>
                          {feeCategories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          name="fee_name"
                          value={newFee.fee_name}
                          onChange={handleNewFeeChange}
                          placeholder="New fee name"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          name="amount"
                          value={newFee.amount}
                          onChange={handleNewFeeChange}
                          placeholder="Amount"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <button
                          type="button"
                          onClick={addNewFee}
                          className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                          disabled={!newFee.fee_name.trim() || !newFee.amount || !newFee.fee_category_id}
                        >
                          Add Fee
                        </button>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="border-y-2 bg-gray-100 font-semibold">
                      <td className="py-2 px-3" colSpan="2">Miscellaneous Fee Total</td>
                      <td className="py-2 px-3" colSpan="2">
                        ₱{miscTotal.toLocaleString()}.00
                      </td>
                    </tr>
                    <tr className=" bg-gray-100 font-semibold">
                      <td className="py-2 px-3" colSpan="2">Miscellaneous Fee + Tuition Fee (1st Semester)</td>
                      <td className="py-2 px-3" colSpan="2">
                        ₱{termTotal.toLocaleString()}.00
                      </td>
                    </tr>
                    <tr className=" bg-gray-100 font-semibold">
                      <td className="py-2 px-3" colSpan="2">Miscellaneous Fee + Tuition Fee (2nd Semester)</td>
                      <td className="py-2 px-3" colSpan="2">
                        ₱{termTotal.toLocaleString()}.00
                      </td>
                    </tr>
                  
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-3">Summary</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Academic Year Total Per Student:</span>
                    <span>₱{yearTotal.toLocaleString()}.00</span>
                  </div>
          
                  
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button onClick={handleSubmit} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                {isEditing ? "Update SOA" : "Create SOA"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminSoa;