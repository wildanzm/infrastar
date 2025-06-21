import { BarChart3, FileText, LayoutDashboard, Map, Settings, Users } from 'lucide-react';
import React from 'react';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, collapsed, setCollapsed }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'reports', label: 'Reports', icon: FileText },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'map', label: 'Map View', icon: Map },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className={`fixed top-0 left-0 z-30 h-full bg-white shadow-xl transition-all duration-300 ${collapsed ? 'hidden' : 'w-64'}`}>
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
                {!collapsed && (
                    <div className="flex items-center space-x-2">
                        <img src="logo.png" alt="" width={30} />
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Infrastar</h1>
                            <p className="text-xs text-gray-500">Admin Dashboard</p>
                        </div>
                    </div>
                )}
            </div>

            <nav className="mt-6">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`group flex w-full items-center px-4 py-3 text-left transition-all duration-200 ${
                                activeTab === item.id
                                    ? 'border-r-3 border-blue-700 bg-blue-50 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            <Icon
                                className={`h-5 w-5 ${collapsed ? 'mx-auto' : 'mr-3'} ${
                                    activeTab === item.id ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-600'
                                }`}
                            />
                            {!collapsed && <span className="font-medium">{item.label}</span>}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default Sidebar;
