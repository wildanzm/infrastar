import { router, usePage } from '@inertiajs/react';
import { Bell, ChevronDown, ChevronLeft, Menu, Search, User } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface HeaderProps {
    sidebarCollapsed: boolean;
    setSidebarCollapsed: (collapsed: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarCollapsed, setSidebarCollapsed }) => {
    const { auth } = usePage().props as any;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        router.post(route('logout'));
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
                    {/* Notification Icon */}
                    <div className="relative">
                        <button className="relative rounded-lg p-2 transition-colors hover:bg-gray-100">
                            <Bell className="h-5 w-5 text-gray-600" />
                        </button>
                    </div>

                    {/* User Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 rounded-lg p-2 transition-all hover:bg-gray-100"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                                <User className="h-4 w-4 text-white" />
                            </div>
                            <div className="hidden flex-col text-left md:flex">
                                <p className="text-sm leading-none font-medium text-foreground">{auth.user?.name || 'User'}</p>
                            </div>
                            <ChevronDown className="h-4 w-4 text-gray-600" />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border bg-white shadow-lg">
                                <div className="px-4 py-3 text-sm text-gray-700">
                                    <div className="font-semibold">{auth.user?.name}</div>
                                    <div className="text-xs text-gray-500">{auth.user?.email}</div>
                                </div>
                                <hr />

                                <button onClick={handleLogout} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100">
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
