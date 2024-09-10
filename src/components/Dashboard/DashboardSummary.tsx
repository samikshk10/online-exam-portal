import Dashboard from './Dashboard';
import { useMemo } from 'react';

export default function DashboardSummary() {
    const memoizedDashboard = useMemo(() => <Dashboard />, []);

    return <div>{memoizedDashboard}</div>;
}
