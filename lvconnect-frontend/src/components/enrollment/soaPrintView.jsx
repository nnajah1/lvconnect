
import React, { forwardRef } from 'react';

const SOAPrintView = forwardRef(({ soaData, userRole, title }, ref) => {

  return (
    <div ref={ref} style={{ position: 'absolute', left: '-9999px', top: 0 }}>
      <div className="p-6 w-[800px] text-sm font-sans text-black bg-white">
        <h2 className="text-xl font-bold mb-4">{title}</h2>

        {/* Tuition Info */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">Tuition Information</h3>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Rate per Unit:</span>
              <span>₱{soaData.tuition_per_unit?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Units:</span>
              <span>{soaData.total_units}</span>
            </div>
            <div className="flex justify-between font-medium border-t pt-1">
              <span>Tuition Total:</span>
              <span>₱{soaData.tuition_total?.toLocaleString()}.00</span>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">Quick Summary</h3>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Miscellaneous Total:</span>
              <span>₱{soaData.miscellaneous_total?.toLocaleString()}.00</span>
            </div>
            <div className="flex justify-between">
              <span>1st Sem Total:</span>
              <span>₱{soaData.first_term_total?.toLocaleString()}.00</span>
            </div>
            <div className="flex justify-between">
              <span>2nd Sem Total:</span>
              <span>₱{soaData.second_term_total?.toLocaleString()}.00</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-1">
              <span>Academic Year Total:</span>
              <span>₱{soaData.whole_academic_year?.toLocaleString()}.00</span>
            </div>
          </div>
        </div>

        {/* Fees Table */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">Miscellaneous Fees</h3>
          <table className="w-full border text-sm">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="text-left px-2 py-1">Fee Name</th>
                <th className="text-right px-2 py-1">Amount</th>
              </tr>
            </thead>
            <tbody>
              {soaData.fees?.map((fee, index) => (
                <tr key={index} className="border-b">
                  <td className="px-2 py-1">{fee.fee_name}</td>
                  <td className="px-2 py-1 text-right">₱{fee.amount?.toLocaleString()}.00</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Student Totals */}
        {userRole === 'student' && (
          <div>
            <div className="flex justify-between font-semibold">
              <span>Scholarship Discount:</span>
              <span>₱{soaData.scholarship_discount?.toLocaleString()}.00</span>
            </div>
            <div className="flex justify-between font-semibold text-green-600">
              <span>Total Payment:</span>
              <span>₱{soaData.total_payment?.toLocaleString()}.00</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default SOAPrintView;
