
import DynamicModal from "@/components/dynamic/DynamicModal";
import { Loader } from "@/components/dynamic/loader";
import UserFormView from "@/components/school_forms/userSubmitForm"
import ConfirmationModal from "@/components/dynamic/alertModal";
import { useState } from "react";
import StudentEditForm from "@/components/school_forms/userSubmitForm";
import { createBatchAccount, createOneAccount } from "@/services/enrollmentAPI";
import { toast } from "react-toastify";

const CreateAccountModal = ({loadNewStudents, isOpen, closeModal, showSingleForm, setShowSingleForm, showBatchForm, setShowBatchForm }) => {


    const [isLoading, setIsLoading] = useState(false);

    const handleSuccess = (formId) => {
        setIsLoading(true);

        setTimeout(() => {
            closeModal();
            if (formId) {
                setIsSuccessModalOpen(true);
            }
            setIsLoading(false);
        }, 2000);
    };

    const [singleAccount, setSingleAccount] = useState({ first_name: '', last_name: '' });
    const [csvFile, setCsvFile] = useState(null);

    const [loading, setLoading] = useState(false);
    const handleSingleSubmit = async () => {
        try {
            setLoading(true);
            const response = await createOneAccount(singleAccount);
            toast.success(`Success: ${response.data.message}`);
            await loadNewStudents();
            closeModal();
        } catch (error) {
            console.error(error);
            toast.error('Failed to create student account');
        } finally {
            setLoading(false);
        }
    };

    const handleBatchSubmit = async () => {
        if (!csvFile) {
            toast.info('Please select a CSV or Excel file.');
            return;
        }

        const formData = new FormData();
        formData.append('file', csvFile);

        try {
            setLoading(true);
            const response = await createBatchAccount(formData)
             if (response.status === 207 && response.data?.details) {
        const details = Array.isArray(response.data.details)
            ? response.data.details.join('\n')
            : response.data.details;

        toast.info(`Some entries failed:\n${details}`);
    } else {
        toast.success(`Batch Success: ${response.data.message}`);
    }
            await loadNewStudents();
            closeModal();
        } catch (error) {
            console.error(error);
            toast.error('Failed to create student accounts in batch');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {isLoading ? (
                // Show loader while waiting for success
                <Loader />
            ) : (
                <DynamicModal isOpen={isOpen}
                    closeModal={closeModal}
                    showCloseButton={false}
                    title="Create Account"
                    description="Fill out the form below to create account."
                    showTitle={false}
                    showDescription={false}
                    className="max-w-[60rem]! max-h-[35rem]! bg-[#EAF2FD]! overflow-auto!">

                    {showSingleForm && (
                        <>
                            <input
                                type="text"
                                placeholder="First Name"
                                value={singleAccount.first_name}
                                onChange={(e) => setSingleAccount({ ...singleAccount, first_name: e.target.value })}
                                className="border p-2 w-full"
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={singleAccount.last_name}
                                onChange={(e) => setSingleAccount({ ...singleAccount, last_name: e.target.value })}
                                className="border p-2 w-full"
                            />
                            <div className="flex gap-2 justify-end">
                                <button
                                    onClick={() => setShowSingleForm(false)}
                                    className="text-sm text-gray-500 hover:underline cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSingleSubmit}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
                                    disabled={loading}
                                >
                                    {loading ? "Creating..." : "Submit"}
                                </button>
                            </div>
                        </>
                    )}

                    {showBatchForm && (
                        <>
                            <input
                                type="file"
                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                onChange={(e) => setCsvFile(e.target.files[0])}
                                className="border p-2 w-full"
                            />
                            <div className="flex gap-2 justify-end">
                                <button
                                    onClick={() => setShowBatchForm(false)}
                                    className="text-sm text-gray-500 hover:underline cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleBatchSubmit}
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
                                    disabled={loading}
                                >
                                    {loading ? "Uploading..." : "Submit Batch"}
                                </button>
                            </div>
                        </>
                    )}


                </DynamicModal>
            )}

        </>
    );
};

export default CreateAccountModal;
