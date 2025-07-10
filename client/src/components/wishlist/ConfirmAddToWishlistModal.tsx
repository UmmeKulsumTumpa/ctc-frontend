import React from 'react';
import { ActionIcons } from '../icons/actionIcons';

interface ConfirmAddToWishlistModalProps {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    wishlistName: string;
}

const ConfirmAddToWishlistModal: React.FC<ConfirmAddToWishlistModalProps> = ({ open, onConfirm, onCancel, wishlistName }) => {
    if (!open) return null;
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none backdrop-blur-xs">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full pointer-events-auto">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Confirm Action</h2>
                    <button 
                        onClick={onCancel} 
                        className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        <ActionIcons.Cancel size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-4">
                    <p className="text-gray-700 mb-4">
                        Are you sure you want to add <span className="font-medium text-emerald-700">"{wishlistName}"</span> to your wishlists?
                    </p>

                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={onCancel}
                            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                            <ActionIcons.Cancel size={16} />
                            <span>Cancel</span>
                        </button>
                        
                        <button
                            onClick={onConfirm}
                            className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                        >
                            <ActionIcons.Confirm size={16} />
                            <span>Confirm</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmAddToWishlistModal;
