// import Button from '../components/common/Button';
// import { useNavigate } from 'react-router-dom';

function ExamCompletion() {
    // const navigate = useNavigate();
    return (
        <div className="w-dvw h-dvh grid place-content-center bg-[#f4fbf9] text-center">
            <h2 className="mb-4">
                Thank you so much for your interest in the fellowship program.
            </h2>
            <p>
                Your answers have been submitted and will be evaluated by our
                team. We'll react out to you with the results within 2 weeks.
            </p>
            <p>Please contact us at 9864214929 in case of any queries.</p>
            <p>
                <strong>
                    Your Exam Result will be sent with in a moment. Please check
                    your email.
                </strong>
            </p>
            {/* <div className="w-fit mx-auto mt-4">
                <Button
                    variant="primary"
                    handleBtnClick={() => {
                        navigate('/');
                    }}
                    outline
                >
                    Go To Home
                </Button>
            </div> */}
        </div>
    );
}

export default ExamCompletion;
