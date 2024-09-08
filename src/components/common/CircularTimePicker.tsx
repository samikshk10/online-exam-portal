import React, { useState } from 'react';

function CircularTimePicker() {
    const [selectedHour, setSelectedHour] = useState<number | null>(null);
    const [selectedMinute, setSelectedMinute] = useState<number | null>(null);

    const hours = Array.from({ length: 12 }, (_, i) => i + 1);
    const minutes = Array.from({ length: 60 }, (_, i) => i);

    const renderCircleItems = (
        items: number[],
        selected: number | null,
        setSelected: (value: number) => void
    ) => {
        const radius = 100; // Adjust radius as needed
        const angleStep = 360 / items.length;

        return items.map((item, index) => {
            const angle = angleStep * index;
            const x = radius * Math.cos((angle * Math.PI) / 180);
            const y = radius * Math.sin((angle * Math.PI) / 180);

            return (
                <div
                    key={item}
                    className={`absolute text-center cursor-pointer transition-colors ${
                        item === selected ? 'text-blue-600' : 'text-gray-600'
                    }`}
                    style={{
                        transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                    }}
                    onClick={() => setSelected(item)}
                >
                    {item < 10 ? `0${item}` : item}
                </div>
            );
        });
    };

    return (
        <div className="flex flex-col items-center mt-10">
            <div className="text-2xl mb-4">
                {`${selectedHour !== null ? selectedHour.toString().padStart(2, '0') : '--'}:${selectedMinute !== null ? selectedMinute.toString().padStart(2, '0') : '--'}`}
            </div>
            <div className="relative w-64 h-64">
                <div className="relative w-full h-full">
                    {renderCircleItems(hours, selectedHour, setSelectedHour)}
                    {renderCircleItems(
                        minutes,
                        selectedMinute,
                        setSelectedMinute
                    )}
                </div>
            </div>
        </div>
    );
}

export default CircularTimePicker;
