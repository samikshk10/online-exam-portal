import Card from '../common/Card';
import React, { useEffect, useState } from 'react';
import { getDashboardDatas, getExam } from '../../services/examService';

interface DashboardData {
    totalExaminee: number;
    totalCodeQuestions: number;
    totalMCQquestions: number;
    totalScheduledExam: number;
    totalAdmin: number;
}
const Dashboard: React.FC = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData>();

    const getDashboardData = async () => {
        const response = await getDashboardDatas();
        console.log(response, 'thi si srespionse');
        setDashboardData(response);
    };
    useEffect(() => {
        getDashboardData();
    }, []);
    return (
        <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card
                    title="Total Examinee"
                    count={dashboardData?.totalExaminee ?? 'N/A'}
                />
                <Card
                    title="Total Code Questions"
                    count={dashboardData?.totalCodeQuestions ?? 'N/A'}
                />
                <Card
                    title="Total MCQ Questions"
                    count={dashboardData?.totalMCQquestions ?? 'N/A'}
                />
                <Card
                    title="Active Exam Schedules"
                    count={dashboardData?.totalScheduledExam ?? 'N/A'}
                />
            </div>
        </div>
    );
};

export default Dashboard;
