
import DynamicModal from "@/components/dynamic/DynamicModal";
import { Loader } from "@/components/dynamic/loader";
import ConfirmationModal, { ErrorModal } from "@/components/dynamic/alertModal";
import ShowSubmission from "@/components/school_forms/userViewSchoolForm";
import { useAuthContext } from "@/context/AuthContext";

import { useEffect, useState } from "react";
import { useUserRole } from "@/utils/userRole";
import { toast } from "react-toastify";
import { getSubmittedFormById, reviewSubmission } from "@/services/school-formAPI";
import FormPDFGenerator from "@/components/school_forms/downloadForms";
import headerImg from '@/assets/header.png';
import footerImg from '@/assets/footer.png';


const UserViewFormModal = ({ isOpen, closeModal, submittedItem, fetchSubmitted }) => {
    const [form, setForm] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [adminRemarks, setAdminRemarks] = useState('');
    const [isApproving, setIsApproving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [showApproveConfirm, setShowApproveConfirm] = useState(false);
    const [showRejectConfirm, setShowRejectConfirm] = useState(false);

    const userRole = useUserRole();

    const loadForm = async () => {
        setIsLoading(true);
        try {
            const response = await getSubmittedFormById(submittedItem.id);
            const submission = response.data.submission;
            const submissionData = response.data.submission_data;
            const title = submission.form_type.title;
            const description = submission.form_type.description;
            const content = submission.form_type.content;

            setForm({
                ...submission,
                data: submissionData,
                title,
                description,
                content,
            });
        } catch (err) {
            toast.error("Failed to load form");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (submittedItem?.id) {
            loadForm();
            setShowApproveConfirm(false);
            setShowRejectConfirm(false);
            setAdminRemarks('');
        }
    }, [submittedItem]);

    const handleApprove = () => setShowApproveConfirm(true);
    const handleReject = () => setShowRejectConfirm(true);

    const confirmApprove = async () => {
        if (!submittedItem) return;
        setIsApproving(true);
        try {
            await reviewSubmission(submittedItem.id, {
                status: 'approved',
                admin_remarks: adminRemarks,
            });
            toast.success("Submission approved successfully!");
            setShowApproveConfirm(false);
            setAdminRemarks('');
            closeModal();

            setTimeout(() => {
                fetchSubmitted();
            }, 200);
        } catch (err) {
            toast.error("Failed to approve submission");
        } finally {
            setIsApproving(false);
        }
    };

    const confirmReject = async () => {
        if (!submittedItem) return;
        setIsRejecting(true);
        try {
            await reviewSubmission(submittedItem.id, {
                status: 'rejected',
                admin_remarks: adminRemarks,
            });
            toast.success("Submission rejected.");
            setShowRejectConfirm(false);
            setAdminRemarks('');
            closeModal();

            setTimeout(() => {
                fetchSubmitted();
            }, 200);
        } catch (err) {
            toast.error("Failed to reject submission");
        } finally {
            setIsRejecting(false);
        }
    };

    const cancelApprove = () => {
        setShowApproveConfirm(false);
        setAdminRemarks('');
    };

    const cancelReject = () => {
        setShowRejectConfirm(false);
        setAdminRemarks('');
    };

    const handleCloseModal = () => {
        setShowApproveConfirm(false);
        setShowRejectConfirm(false);
        setAdminRemarks('');
        closeModal();
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <>
            {/* Only show main modal when confirm modals are NOT open */}
            {!showApproveConfirm && !showRejectConfirm && (
                <DynamicModal
                    isOpen={isOpen}
                    closeModal={handleCloseModal}
                    showCloseButton={true}
                    title={form?.title}
                    description={form?.description}
                    showTitle={true}
                    showDescription={true}
                    headerButtons={
                        form.status === 'approved' && (
                            <FormPDFGenerator
                                submissionId={form.id}
                                content={form.content}
                                data={form.data}
                                title={form.title}
                                description={form.description}
                                reviewedBy={form.reviewed_by}
                                loading={isLoading}
                                headerImageUrl={headerImg}
                                footerImageUrl={footerImg}
                            />
                        )
                    }
                    showFooter={form?.status === "pending" && userRole === "psas"}
                    footerButtons={
                        <>
                            <button
                                onClick={handleReject}
                                disabled={isRejecting || isApproving}
                                className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 shadow-md disabled:opacity-50"
                            >
                                Reject
                            </button>
                            <button
                                onClick={handleApprove}
                                disabled={isApproving || isRejecting}
                                className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 disabled:bg-blue-300 flex items-center gap-2"
                            >
                                Approve
                            </button>
                        </>
                    }
                >
                    <ShowSubmission
                        closeModal={handleCloseModal}
                        userRole={userRole}
                        form={form}
                        loadForm={loadForm}
                        loading={isLoading}
                    />
                </DynamicModal>
            )}

            {/* Approve Confirmation Modal */}
            {showApproveConfirm && (
                <ConfirmationModal
                    isOpen={showApproveConfirm}
                    closeModal={cancelApprove}
                    title="Approve Form"
                    description="Are you sure you want to approve this school form?"
                >
                    <button
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 cursor-pointer"
                        onClick={cancelApprove}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
                        onClick={confirmApprove}
                        disabled={isApproving}
                    >
                        {isApproving ? 'Approving...' : 'Approve'}
                    </button>
                </ConfirmationModal>
            )}

            {/* Reject Confirmation Modal */}
            {showRejectConfirm && (
                <ErrorModal
                    isOpen={showRejectConfirm}
                    closeModal={cancelReject}
                    title="Reject Form"
                    description="Are you sure you want to reject this school form?"
                >
                    <div className="flex w-full flex-col">
                        <div className="w-full">
                            <textarea
                                placeholder="Enter admin remarks"
                                className="w-full px-3 py-2 border rounded mb-4 resize-none focus:outline-none focus:ring focus:border-blue-300"
                                value={adminRemarks}
                                onChange={(e) => setAdminRemarks(e.target.value)}
                                disabled={isRejecting}
                                rows={4}
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 mr-2"
                                onClick={cancelReject}
                                disabled={isRejecting}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={confirmReject}
                                disabled={isRejecting}
                            >
                                {isRejecting ? 'Rejecting...' : 'Reject'}
                            </button>
                        </div>
                    </div>
                </ErrorModal>
            )}
        </>
    );
};


export default UserViewFormModal;
