import { useAuthContext } from "../../context/AuthContext"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "../../components/ui/button"
import preventBackNavigation from "@/utils/preventBackNavigation"

import LVConnect from "@/components/ui/lv-connect"

import illustration from "@/assets/illustration.jpg"

import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../components/ui/input-otp"
import { toast } from "react-toastify"

const OTPVerification = () => {
  preventBackNavigation(true)

  const location = useLocation()
  const navigate = useNavigate()
  const { isLoading, resendOTP, verifyOTP, setTimer, timer, user, isResendDisabled, setIsResendDisabled } =
    useAuthContext()
  const [otp, setOtp] = useState("")
  const [error, setError] = useState(null)

  // Retrieve userId, deviceId, and deviceName from the location state
  const { userId } = location.state || {}

  // Check if OAuth user
  const isOAuth = location.state?.isOAuth || false

  // Redirect to login if accessed directly
  useEffect(() => {
    if (!user && !userId) {
      navigate("/login", { replace: true })
    } else if (user) {
      navigate("/", { replace: true })
    }
  }, [userId, user, navigate])

  useEffect(() => {
    const startTime = localStorage.getItem("otpStartTime")
    if (startTime) {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000)
      const remainingTime = Math.max(120 - elapsedTime, 0) // Adjust for elapsed time
      setTimer(remainingTime)
    } else {
      setTimer(120) // Default if no previous timer
    }
  }, [])

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)

      return () => clearInterval(interval)
    } else {
      setIsResendDisabled(false)
    }
  }, [timer])

  // Restrict OTP input to only numbers (digits 0-9)
  const handleOtpChange = (value) => {
    const numericValue = value.replace(/\D/g, "") // Remove non-digit characters
    setOtp(numericValue)
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setError(null)
    if (!userId) {
      toast.error("Invalid request. Please try again.")
      return
    }
    if (!otp) {
      toast.error("invalid OTP. Please Try again.")
      return
    }
    try {
      const response = await verifyOTP(location.state.userId, otp, location.state.rememberDevice, isOAuth)

      if (response.success) {
        //Redirect to Change Password if password must change
        if (response.mustChangePassword) {
          navigate("/change-password", { state: { userId: response.userId }, replace: true })
        } else {
          navigate("/", { replace: true })
        }
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      toast.error("OTP verification failed")
    }
  }

  const handleResendOTP = async () => {
    try {
      const response = await resendOTP(userId, "unrecognized_device") // Call API to resend OTP

      if (response.success) {
        toast.success("A new OTP has been sent to your email.")
        setTimer(120) // Restart the timer (assuming 120 seconds)
        localStorage.setItem("otpStartTime", Date.now()) // Save new start time
        setIsResendDisabled(true)
      } else {
        throw new Error(response.message || "Failed to resend OTP. Please try again.")
      }
    } catch (error) {
      console.error("Resend OTP failed:", error)
      toast.error(error.message)
    }
  }

  // Format timer (MM:SS)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      <img
        src={illustration || "/placeholder.svg"}
        alt="Background"
        className="absolute inset-0 w-full h-full blur-[2px] object-cover"
      />

      <div className="relative bg-white/70 backdrop-blur-sm rounded-lg shadow-lg w-full max-w-[320px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[580px] min-h-[400px] sm:min-h-[420px] md:min-h-[450px] flex flex-col justify-center items-center p-4 sm:p-6 md:p-8">
        <div className="flex flex-col items-center gap-2 sm:gap-3 md:gap-4 w-full">
          <div className="flex justify-center items-center mb-2 sm:mb-3 md:mb-4">
            <LVConnect />
          </div>

          <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 text-center">
            Authenticate your account
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4 md:mb-6 text-center font-semibold px-2">
            Please enter the One-Time Password (OTP) sent to the <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>email address you provided.
          </p>

          {/* {error && <p style={{ color: "red" }}>{error}</p>} */}

          <div className="flex justify-center space-x-1 sm:space-x-2 mb-3 sm:mb-4 w-full">
            <InputOTP maxLength={6} value={otp} onChange={handleOtpChange} className="mb-2 sm:mb-3 md:mb-4">
              <InputOTPGroup className="gap-1 sm:gap-2">
                {[...Array(6)].map((_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-sm sm:text-base md:text-lg"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="text-xs sm:text-sm md:text-base text-gray-600 w-full flex justify-center sm:justify-end mb-3 sm:mb-4 px-2 sm:pr-4">
            {isResendDisabled ? (
              <span className="text-center sm:text-right">
                Resend OTP in <span className="text-red-500 font-semibold">{formatTime(timer)}</span>
              </span>
            ) : isLoading ? (
              <span className="text-blue-500 font-semibold">Sending...</span>
            ) : (
              <button
                onClick={handleResendOTP}
                disabled={isResendDisabled || isLoading}
                className="text-blue-500 font-semibold hover:underline"
              >
                Resend OTP
              </button>
            )}
          </div>

          <Button
            onClick={handleVerifyOTP}
            className="w-full sm:w-[90%] mt-2 sm:mt-3 md:mt-4 h-10 sm:h-11 md:h-12 text-sm sm:text-base"
          >
            Verify
          </Button>
        </div>
      </div>
    </div>
  )
}

export default OTPVerification
