import { useAppDispatch } from '../app/hooks';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { setShowToast } from '../feature/exam/examSlice';

function Home() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    return (
        <div>
            <h1>This is a home page.</h1>
            <Button
                variant="primary"
                outline
                handleBtnClick={() => {
                    dispatch(setShowToast(false));
                    navigate('/exam-playground');
                }}
            >
                Go To Exam
            </Button>
        </div>
    );
}

export default Home;
