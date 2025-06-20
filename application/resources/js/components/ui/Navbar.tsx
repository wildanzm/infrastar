import { router } from '@inertiajs/react';
import { ChevronDown, Menu, User, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from './button';

interface NavbarProps {
    auth: {
        user: {
            name: string;
            email: string;
        } | null;
    };
}

const Navbar = ({ auth }: NavbarProps) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        router.post(route('logout'));
    };

    // close dropdown when clicking outside
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
        <nav className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between bg-white px-[7%] py-4 shadow">
            {/* Logo */}
            <div className="flex items-center gap-2">
                <img src="logo.png" alt="" width={40} />
                <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Infrastar</h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden gap-6 text-lg font-semibold text-foreground md:flex">
                <a href="#">Home</a>
                <a href="#">About</a>
                <a href="#">Feature</a>
            </div>

            {/* Auth / Dropdown */}
            <div className="hidden items-center md:flex">
                {!auth.user ? (
                    <div className="space-x-2">
                        <a href={route('login')}>
                            <Button className="text-sm md:text-base">Masuk</Button>
                        </a>
                        <a href={route('register')}>
                            <Button className="border border-primary bg-white text-sm text-primary hover:text-white md:text-base">Daftar</Button>
                        </a>
                    </div>
                ) : (
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm md:text-base"
                        >
                            <User size={35} className="rounded-full bg-primary p-1 text-white" />
                            <span className="hidden text-lg font-bold sm:inline">Halo, {auth.user.name.split(' ')[0]}</span>
                            <ChevronDown size={16} />
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border bg-white shadow-md">
                                <div className="px-4 py-3 text-sm text-gray-700">
                                    <div className="text-lg font-semibold">{auth.user.name}</div>
                                    <div className="text-xs text-gray-500">{auth.user.email}</div>
                                </div>
                                <hr />
                                <button onClick={handleLogout} className="w-full px-4 py-4 text-left text-sm text-red-600 hover:bg-gray-100">
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Mobile Menu Icon */}
            <div className="md:hidden">
                <button onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X size={24} /> : <Menu size={24} />}</button>
            </div>

            {/* Mobile Menu Panel */}
            {mobileOpen && (
                <div className="absolute top-full left-0 z-40 flex w-full flex-col gap-4 border-t bg-white px-6 py-4 shadow-md md:hidden">
                    <a href="#">Home</a>
                    <a href="#">About</a>
                    <a href="#">Feature</a>
                    {!auth.user ? (
                        <>
                            <a href={route('login')}>
                                <Button className="w-full">Masuk</Button>
                            </a>
                            <a href={route('register')}>
                                <Button className="w-full border border-primary bg-white text-primary hover:text-white">Daftar</Button>
                            </a>
                        </>
                    ) : (
                        <>
                            <div className="text-sm">
                                <div className="font-medium">{auth.user.name}</div>
                                <div className="text-xs text-gray-500">{auth.user.email}</div>
                            </div>
                            <Button
                                className="w-full border border-red-600 bg-white text-red-600 hover:bg-red-600 hover:text-white"
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
