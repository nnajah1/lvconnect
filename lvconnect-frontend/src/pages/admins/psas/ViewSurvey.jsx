
import DynamicModal from "@/components/dynamic/DynamicModal";
import {Loader} from "@/components/dynamic/loader";
import SurveyAdminView from "@/components/survey/ViewSurvey";
import { getSubmittedSurveyResponses } from "@/services/surveyAPI";
import { useEffect, useState } from "react";

const ViewSurveyResponseModal = ({ isOpen, closeModal, submittedItem }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [responseData, setResponseData] = useState(null);


    useEffect(() => {
        if (!submittedItem?.id) return;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await getSubmittedSurveyResponses(submittedItem.id);
                setResponseData(res.data);
            } catch (err) {
                console.error('Failed to load submitted response', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [submittedItem?.id]);
    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <DynamicModal isOpen={isOpen}
                    closeModal={closeModal}
                    title="Submitted Survey"
                    description="Fill out the survey."
                    showTitle={true}
                    showDescription={false}
                    // className="min-w-[40rem]! max-h-[35rem]! bg-[#EAF2FD]! overflow-auto!"   
                    >

                    <SurveyAdminView isOpen={isOpen} closeModal={closeModal} responseData={responseData} />

                </DynamicModal>
            )}

        </>
    );
};

export default ViewSurveyResponseModal;
