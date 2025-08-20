import React, { useState, useRef, useEffect } from 'react';
import StarIcon from './icons/StarIcon';
import FireIcon from './icons/FireIcon';
import UserCircleIcon from './icons/UserCircleIcon';

interface AppHeaderProps {
    points: number;
    streak: number;
    isAdmin: boolean;
    onAdminClick: () => void;
    onLogout: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ points, streak, isAdmin, onAdminClick, onLogout }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [adminClickCount, setAdminClickCount] = useState(0);
    const adminClickTimer = useRef<number | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (adminClickTimer.current) {
                clearTimeout(adminClickTimer.current);
            }
        };
    }, []);

    const handleLogoutClick = () => {
        onLogout();
        setIsDropdownOpen(false);
    }
    
    const handleAdminClick = () => {
        onAdminClick();
        setIsDropdownOpen(false);
    }
    
    const handleTitleClick = () => {
        if (isAdmin) return; // No need to trigger if already admin

        if (adminClickTimer.current) {
            clearTimeout(adminClickTimer.current);
        }

        const newCount = adminClickCount + 1;
        setAdminClickCount(newCount);

        if (newCount >= 7) {
            onAdminClick();
            setAdminClickCount(0);
        } else {
            adminClickTimer.current = window.setTimeout(() => {
                setAdminClickCount(0);
            }, 2000); // Reset after 2 seconds of inactivity
        }
    };


    return (
        <header className="fixed top-0 left-0 right-0 z-[60] p-4 bg-[#0A192F]/80 backdrop-blur-md border-b border-slate-700/50">
            <div className="max-w-4xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
                <h1 onClick={handleTitleClick} className="text-2xl font-bold text-gold-royal select-none cursor-pointer" title="اضغط 7 مرات للدخول كمدير">رحلتي</h1>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-4 bg-slate-800/80 shadow-md rounded-full px-4 py-2 border border-slate-700">
                        <div className="flex items-center gap-1 font-bold text-yellow-300">
                            <StarIcon className="w-5 h-5 text-yellow-400" />
                            <span>{points}</span>
                        </div>
                        <div className="w-px h-5 bg-slate-600"></div>
                        <div className="flex items-center gap-1 font-bold text-red-400">
                            <FireIcon className="w-5 h-5 text-red-500" />
                            <span>{streak}</span>
                        </div>
                    </div>
                    <div className="relative" ref={dropdownRef}>
                        <button onClick={() => setIsDropdownOpen(prev => !prev)} className="text-slate-300 hover:text-gold-royal transition">
                            <UserCircleIcon className="w-9 h-9" />
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute start-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 animate-fade-in">
                                <a onClick={handleAdminClick} className="block px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 cursor-pointer">
                                    {isAdmin ? 'مراجعة الوضع' : 'وضع المطور'}
                                </a>
                                {isAdmin && (
                                    <a onClick={handleLogoutClick} className="block px-4 py-2 text-sm text-red-400 hover:bg-slate-700 cursor-pointer">
                                        تسجيل الخروج
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AppHeader;