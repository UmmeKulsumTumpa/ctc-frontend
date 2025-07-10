import React from 'react';

interface ConfirmAddToWishlistModalProps {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    wishlistName: string;
}

const ConfirmAddToWishlistModal: React.FC<ConfirmAddToWishlistModalProps> = ({ open, onConfirm, onCancel, wishlistName }) => {
    if (!open) return null;
    return (
        <div className="fixed left-0 top-0 z-50 flex items-center justify-center w-full h-full pointer-events-none">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative mx-auto pointer-events-auto mt-24">
                <button onClick={onCancel} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl">
                    ×
                </button>

                <h2 className="text-2xl font-bold text-emerald-900 mb-4">
                    Add to Wishlist
                </h2>

                <div className="mb-6 text-gray-700">
                    Are you sure you want to add 
                    <span className="font-bold text-emerald-700">{wishlistName}</span> to your wishlists?
                </div>

                <div className="flex gap-4 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-bold border border-gray-300 hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmAddToWishlistModal;
