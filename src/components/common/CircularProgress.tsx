interface ProgressType {
    value: number;
    max: number;
}

const CircularProgress = ({ value, max }: ProgressType) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const progress = (value / max) * circumference;

    return (
        <div className="flex justify-center items-center w-full h-full">
            <svg viewBox="0 0 100 100" className="w-full h-full">
                <g className="transform rotate-[-90deg] origin-center">
                    <circle
                        className="text-gray-300"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="50"
                        cy="50"
                    />
                    <circle
                        className="text-[#1935CA]"
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - progress}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="50"
                        cy="50"
                    />
                </g>
                <text
                    x="50%"
                    y="50%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    className="text-black text-[18px] font-bold"
                >
                    {value}/{max}
                </text>
            </svg>
        </div>
    );
};

export default CircularProgress;
