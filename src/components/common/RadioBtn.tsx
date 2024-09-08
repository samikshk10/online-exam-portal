import { isOptionSelected } from '../../helper/helper';
import { CheckedQuestionType } from '../../types/question';
interface RadioBtnType {
    name: string;
    label: string;
    index: number;
    qid?: number;
    handleOptionChange: () => void;
    checkedQuestions?: CheckedQuestionType[];
}

function RadioBtn({
    name,
    label,
    index,
    qid,
    handleOptionChange,
    checkedQuestions,
}: RadioBtnType) {
    return (
        <div className="flex">
            <label
                className="relative flex items-center rounded-full cursor-pointer"
                htmlFor={`option-${index}`}
            >
                <input
                    name={name}
                    type="radio"
                    checked={isOptionSelected(qid!, label, checkedQuestions!)}
                    onChange={handleOptionChange}
                    className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-[#1935CA] text-[#1935CA] transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-[#1935CA] checked:before:bg-[#1935CA] hover:before:opacity-10"
                    id={`option-${index}`}
                />
                <span className="absolute text-[#1935CA] transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                    >
                        <circle
                            data-name="ellipse"
                            cx="8"
                            cy="8"
                            r="8"
                        ></circle>
                    </svg>
                </span>
            </label>
            <label
                className="text-[18px] mt-px pl-3 font-normal cursor-pointer select-none"
                htmlFor={`option-${index}`}
            >
                {label}
            </label>
        </div>
    );
}

export default RadioBtn;
