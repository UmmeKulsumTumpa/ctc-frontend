import React from 'react';

interface SidebarProps {
    current: string;
    onSelect: (section: string) => void;
}

const sections = [
    { key: 'profile', label: 'Profile' },
    { key: 'update', label: 'Update Profile' },
    { key: 'password', label: 'Change Password' },
    { key: 'posts', label: 'Your Posts' },
    { key: 'wishlists', label: 'Your Wishlists' },
];

const Sidebar: React.FC<SidebarProps> = ({ current, onSelect }) => {
    return (
        <aside className="bg-gray-100 w-56 min-h-full p-4 flex flex-col gap-2 border-r">
            <h2 className="text-lg font-bold text-blue-900 mb-4">Dashboard</h2>
            {sections.map(s => (
                <button
                    key={s.key}
                    className={`text-left px-3 py-2 rounded font-semibold transition-all ${current === s.key ? 'bg-blue-600 text-white shadow' : 'hover:bg-blue-200 text-blue-900'}`}
                    onClick={() => onSelect(s.key)}
                >
                    {s.label}
                </button>
            ))}
        </aside>
    );
};

export default Sidebar;
