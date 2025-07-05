import React from 'react';

interface SidebarProps {
    current: string;
    onSelect: (section: string) => void;
}

const sections = [
    { key: 'profile', label: '👤 Profile', icon: '👤' },
    { key: 'update', label: '✏️ Update Profile', icon: '✏️' },
    { key: 'password', label: '🔐 Change Password', icon: '🔐' },
    { key: 'posts', label: '📚 Your Stories', icon: '📚' },
    { key: 'wishlists', label: '⭐ Your Dreams', icon: '⭐' },
];

const Sidebar: React.FC<SidebarProps> = ({ current, onSelect }) => {
    return (
        <aside className="bg-white border-2 border-blue-200 shadow-lg rounded-3xl w-72 min-h-full p-6 flex flex-col gap-3">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-blue-900 mb-2">Travel Dashboard</h2>
                <p className="text-gray-600 text-sm">Manage your adventure profile</p>
            </div>
            {sections.map(s => (
                <button
                    key={s.key}
                    className={`text-left px-4 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-3 ${
                        current === s.key 
                            ? 'bg-blue-600 text-white shadow-lg border-2 border-blue-700 transform scale-105' 
                            : 'hover:bg-blue-50 text-blue-900 border-2 border-transparent hover:border-blue-200 hover:shadow-md'
                    }`}
                    onClick={() => onSelect(s.key)}
                >
                    <span className="text-lg">{s.icon}</span>
                    <span>{s.label.replace(/^[^\s]+ /, '')}</span>
                </button>
            ))}
        </aside>
    );
};

export default Sidebar;
