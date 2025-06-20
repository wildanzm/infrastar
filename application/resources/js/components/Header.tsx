import { Bell, ChevronLeft, Menu, Search, User } from 'lucide-react';
import React from 'react';

interface HeaderProps {
    sidebarCollapsed: boolean;
    setSidebarCollapsed: (collapsed: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarCollapsed, setSidebarCollapsed }) => {
    return (
        <header className="border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="rounded-lg p-2 transition-colors hover:bg-gray-100">
                        {sidebarCollapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                    </button>
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-50 rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <button className="relative rounded-lg p-2 transition-colors hover:bg-gray-100">
                            <Bell className="h-5 w-5 text-gray-600" />
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                3
                            </span>
                        </button>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="hidden text-right">
                            <p className="text-sm font-medium text-gray-900">John Admin</p>
                            <p className="text-xs text-gray-500">Administrator</p>
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
                            <User className="h-4 w-4 text-white" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
