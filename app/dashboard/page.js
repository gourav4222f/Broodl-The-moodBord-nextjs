import Main from '@/components/Main';
import Dashboard from '@/components/Dashboard';
import React from 'react';
import Login from '@/components/Login';
import { useAuth } from '@/context/AuthContext';
import Loading from '@/components/Loading';

export const metadata = {
    title: "Broodl -Dashboard",
    description: "This is the dashboard for Broodl.",
};

export default function DashboardPage() {
    // const IsAuthenticated = true;



    return (
        <Main>
            <Dashboard />
        </Main>
    );
}
