import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Eye, EyeOff, Edit, Calendar } from 'lucide-react';


export const SOADetailsView = ({ soaData, isCollapsed, onToggle, title, isOther = false, handleEdit, userRole }) => (
  <div className="bg-gray-50 shadow-md rounded-lg p-6 mb-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors"
      >
        <Calendar className="w-5 h-5" />
        {title}
        {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
      </button>
      {userRole === "registrar" && (
        <div className="flex items-center gap-2">
          {soaData.is_visible ? (
            <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              <Eye className="w-4 h-4" />
              Visible
            </span>

          ) : (
            <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
              <EyeOff className="w-4 h-4" />
              Hidden
            </span>
          )}
          {!isOther && (
            <button
              onClick={handleEdit}
              className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>
      )}
    </div>

    {!isCollapsed && (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tuition Information */}
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-3">Tuition Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Rate per Unit:</span>
                <span>₱{soaData.tuition_per_unit?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Units:</span>
                <span>{soaData.total_units}</span>
              </div>
              <div className="flex justify-between font-medium border-t pt-2">
                <span>Tuition Total:</span>
                <span>₱{soaData.tuition_total?.toLocaleString()}.00</span>
              </div>
            </div>
          </div>

          {/* Quick Summary */}
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-3">Quick Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b pt-2">
                <span>Miscellaneous Total:</span>
                <span>₱{soaData.miscellaneous_total?.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between">
                <span>Miscellaneous Fee + Tuition Fee (1st Semester):</span>
                <span>₱{soaData.first_term_total?.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between">
                <span>Miscellaneous Fee + Tuition Fee (2nd Semester):</span>
                <span>₱{soaData.second_term_total?.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span>Academic Year Total:</span>
                <span>₱{soaData.whole_academic_year?.toLocaleString()}.00</span>
              </div>
              {/* <div className="flex justify-between font-medium border-t pt-2 text-green-600">
                <span>Final Payment:</span>
                <span>₱{soaData.total_payment?.toLocaleString()}.00</span>
              </div> */}
            </div>
          </div>
        </div>

        {/* Miscellaneous Fees */}
        <div className="mt-6 bg-white rounded-lg p-4">
          <h3 className="font-semibold text-gray-700 mb-3">Miscellaneous Fees</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-2 px-3">Fee Name</th>
                  <th className="text-right py-2 px-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                {soaData.fees?.map((fee, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-3">{fee.fee_name}</td>
                    <td className="text-right py-2 px-3">₱{fee.amount?.toLocaleString()}.00</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 bg-gray-50 font-semibold">
                  <td className="py-2 px-3">Total Miscellaneous Fees</td>
                  <td className="text-right py-2 px-3">
                    ₱{soaData.miscellaneous_total?.toLocaleString()}.00
                  </td>
                </tr>
                <tr className="bg-gray-50 font-semibold">
                  <td className="py-2 px-3">Miscellaneous Fee + Tuition Fee (1st Semester)</td>
                  <td className="text-right py-2 px-3">
                    ₱{soaData.first_term_total?.toLocaleString()}.00
                  </td>
                </tr>
                <tr className="bg-gray-50 font-semibold">
                  <td className="py-2 px-3">Miscellaneous Fee + Tuition Fee (2nd Semester)</td>
                  <td className="text-right py-2 px-3">
                    ₱{soaData.second_term_total?.toLocaleString()}.00
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Academic Year Summary */}
        <div className="mt-6 bg-white rounded-lg p-4 overflow-auto ">
          <h3 className="font-semibold text-gray-700 mb-3">Academic Year Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between"></div>
            <div className="flex justify-between items-center font-semibold text-lg">
              {userRole === "registrar" ? (
                <span>Academic Year Total Per Student:</span>
              ) : (<span>Academic Year Total:</span>)}
              <span>₱{soaData.whole_academic_year?.toLocaleString()}.00</span>
            </div>
            <div className="flex justify-between"></div>
            {userRole === "student" && (
              <div className=''>
                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>Scholarship Discount:</span>
                  <span>₱{soaData.scholarship_discount?.toLocaleString()}.00</span>
                </div>
                <div className="flex justify-between items-center font-semibold text-lg text-green-500">
                  <span>Total Payment:</span>
                  <span>₱{soaData.total_payment?.toLocaleString()}.00</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    )}
  </div>
);



