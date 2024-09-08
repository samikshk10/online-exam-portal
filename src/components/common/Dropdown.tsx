import React, { useEffect, useState } from 'react';
import { MicIcon, VideoIcon } from '../../helper/icons';

interface DropdownType {
    isWebCam?: boolean;
    isMic?: boolean;
    isOpen: boolean;
    onToggle: () => void;
    options: string[];
    setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
    selectedOption: string;
}

const Dropdown = ({
    isWebCam,
    isMic,
    isOpen,
    onToggle,
    options,
    selectedOption,
    setSelectedOption,
}: DropdownType) => {
    // const [selectedOption, setSelectedOption] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isMic || isWebCam) {
            if (options.length > 0) {
                setSelectedOption(options[0]);
                setIsLoading(false);
            } else if (isLoading) {
                setSelectedOption('Searching...');
            } else {
                setSelectedOption('Device not found');
            }
        }
    }, [options]);

    useEffect(() => {
        if (!isMic || !isWebCam) {
            if (options.length > 0) {
                setSelectedOption(options[0]);
            }
        }
    }, []);

    return (
        <div className="relative inline-block text-left min-w-[250px]">
            <div>
                <button
                    type="button"
                    className="inline-flex justify-between w-full rounded-full border border-gray-300 hover:border-[#47a992] shadow-sm px-4 py-2 bg-white text-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#47a992]"
                    onClick={onToggle}
                >
                    <div className="flex items-center">
                        {isWebCam ? (
                            <VideoIcon
                                className="mr-2"
                                style={{ fontSize: '20px' }}
                            />
                        ) : isMic ? (
                            <MicIcon
                                className="mr-2"
                                style={{ fontSize: '25px' }}
                            />
                        ) : null}
                        {selectedOption?.length > 20
                            ? selectedOption.substring(0, 20) + ' ...'
                            : selectedOption}
                    </div>
                    <svg
                        className={`-mr-1 h-5 w-5 transition-all ${isOpen ? 'rotate-0 mt-1' : 'rotate-180 ml-2'}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 3a1 1 0 01.7.3l6 6a1 1 0 11-1.4 1.4L10 5.42 4.7 10.7a1 1 0 01-1.4-1.4l6-6A1 1 0 0110 3z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>

            {isOpen && (
                <div className="z-10 origin-top-right absolute right-0 mt-1 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                    >
                        {options.map((option) => (
                            <button
                                key={option}
                                className="block px-4 py-2 text-md text-gray-700 hover:bg-gray-100 w-full text-left"
                                onClick={() => {
                                    setSelectedOption(option);
                                    onToggle();
                                }}
                                role="menuitem"
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dropdown;
