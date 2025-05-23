

import { useState, useEffect } from "react"
import "@/styles/student_soa.css"

const StudentSoa = () => {
    const [statementData, setStatementData] = useState({
    schoolYear: "",
    tuitionFee: {
      ratePerUnit: 0,
      units: 0,
      total: 0,
    },
    miscFees: [],
    miscTotal: 0,
    semesterTotal: 0,
    yearTotal: 0,
    scholarshipDiscount: 0,
    totalPayment: 0,
    programInfo: "",
  })


  return (
    <div className="">
      {/* Header */}
      <div className="statement-header">
        <div className="header-title-container">
          <h1 className="text-2xl font-bold text-[#1a2b4c]">Statement of Account</h1>
        </div>
      </div>

      {/* Content */}
      <div className="statement-content">
        <div className="statement-card">
          {/* School Year Header */}
          <div className="school-year-header">
            <div className="school-year-title-container">
              <h2 className="school-year-title">School Year {statementData.schoolYear}</h2>
            </div>
          </div>

          {/* Statement Content */}
          <div className="statement-inner-content">
            <div className="statement-inner-card">
              {/* Tuition Fee */}
              <div className="tuition-fee-row">
                <div className="tuition-fee-label">
                  <span className="tuition-fee-label-text">Tuition Fee</span>
                </div>
                <div className="tuition-fee-details">
                  <span className="tuition-fee-details-text">
                    P{statementData.tuitionFee.ratePerUnit}.00 per unit ({statementData.tuitionFee.units} units)
                  </span>
                </div>
                <div className="tuition-fee-amount">
                  <span className="tuition-fee-amount-text">P{statementData.tuitionFee.total.toLocaleString()}.00</span>
                </div>
              </div>

              {/* Miscellaneous Fee Breakdown */}
              <div className="misc-fee-section">
                <div className="misc-fee-header">
                  <div className="misc-fee-header-label">
                    <span className="misc-fee-header-text">Miscellaneous Fee Breakdown</span>
                  </div>
                </div>

                {/* Misc Fees List */}
                {statementData.miscFees.map((fee, index) => (
                  <div key={index} className="misc-fee-item">
                    <div className="misc-fee-item-label">
                      <span className="misc-fee-item-label-text">{fee.name}</span>
                    </div>
                    <div className="misc-fee-item-spacer"></div>
                    <div className="misc-fee-item-amount">
                      <span className="misc-fee-item-amount-text">{fee.amount.toLocaleString()}.00</span>
                    </div>
                  </div>
                ))}

                {/* Misc Total */}
                <div className="misc-total-row">
                  <div className="misc-total-label">
                    <span className="misc-total-label-text">Miscellaneous Fee Total:</span>
                  </div>
                  <div className="misc-total-amount">
                    <span className="misc-total-amount-text">P {statementData.miscTotal.toLocaleString()}.00</span>
                  </div>
                </div>
              </div>

              {/* Semester Totals */}
              <div className="semester-totals-section">
                <div className="semester-row">
                  <div className="semester-label">
                    <span className="semester-label-text">Miscellaneous Fee + Tuition Fee</span>
                  </div>
                  <div className="semester-name">
                    <span className="semester-name-text">1st Semester</span>
                  </div>
                  <div className="semester-amount">
                    <span className="semester-amount-text">P {statementData.semesterTotal.toLocaleString()}.00</span>
                  </div>
                </div>

                <div className="second-semester-row">
                  <div className="second-semester-label"></div>
                  <div className="second-semester-name">
                    <span className="second-semester-name-text">2nd Semester</span>
                  </div>
                  <div className="second-semester-amount">
                    <span className="semester-amount-text">P {statementData.semesterTotal.toLocaleString()}.00</span>
                  </div>
                </div>
              </div>

              {/* Year Total and Payment */}
              <div className="year-total-section">
                <div className="year-total-row">
                  <div className="year-total-label">
                    <span className="year-total-label-text">Whole Academic Year</span>
                  </div>
                  <div className="year-total-spacer"></div>
                  <div className="year-total-amount">
                    <span className="year-total-amount-text">P {statementData.yearTotal.toLocaleString()}.00</span>
                  </div>
                </div>

                <div className="scholarship-row">
                  <div className="scholarship-label-spacer"></div>
                  <div className="scholarship-label">
                    <span className="scholarship-label-text">Scholarship Discount</span>
                  </div>
                  <div className="scholarship-amount">
                    <span className="year-total-amount-text">
                      P {statementData.scholarshipDiscount.toLocaleString()}.00
                    </span>
                  </div>
                </div>

                <div className="total-payment-row">
                  <div className="total-payment-spacer"></div>
                  <div className="total-payment-label">
                    <span className="total-payment-label-text">Total Payment</span>
                  </div>
                  <div className="total-payment-amount">
                    <span className="total-payment-amount-text">
                      P {statementData.totalPayment.toLocaleString()}.00
                    </span>
                  </div>
                </div>
              </div>

              {/* Program Info (Hidden in this view) */}
              <div className="program-info">
                <div className="program-info-container">
                  <div className="program-info-content">
                    <span className="program-info-semester">Second Semester</span>
                    <span className="program-info-text">{statementData.programInfo}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentSoa;
