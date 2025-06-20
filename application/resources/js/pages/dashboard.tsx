import { useState } from 'react';
import Analytics from '../components/Analytics';
import Dashboard from '../components/Dashboard';
import Header from '../components/Header';
import Map from '../components/Map';
import Reports from '../components/Reports';
import Settings from '../components/Settings';
import Sidebar from '../components/Sidebar';
import Users from '../components/Users';

function DashboardPage() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard />;
            case 'reports':
                return <Reports />;
            case 'analytics':
                return <Analytics />;
            case 'map':
                return <Map />;
            case 'users':
                return <Users />;
            case 'settings':
                return <Settings />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
            <div className={`flex flex-1 flex-col transition-all duration-300 ${sidebarCollapsed ? '' : 'ml-64'}`}>
                <Header sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} />
                <main className="flex-1 overflow-auto p-6">{renderContent()}</main>
            </div>
        </div>
    );
}

export default DashboardPage;
