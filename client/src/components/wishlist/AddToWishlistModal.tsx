import React from 'react'
import { useNavigate } from 'react-router-dom'

interface AddToWishlistModalProps {
    onClose: () => void
}

const AddToWishlistModal: React.FC<AddToWishlistModalProps> = ({ onClose }) => {
    const navigate = useNavigate()
    return (
        <div className="fixed left-0 top-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative mx-auto pointer-events-auto mt-24">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl">×</button>
                <h2 className="text-2xl font-bold text-emerald-900 mb-4">
                    Sign in Required
                </h2>

                <div className="text-gray-700 mb-6">You need to sign in to add this wishlist to your collection.
                </div>
                
                <button
                    onClick={() => navigate('/signin')}
                    className="w-full px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold shadow-lg hover:bg-emerald-700 transition-colors text-lg"
                >
                    Go to Sign In
                </button>
            </div>
        </div>
    )
}

export default AddToWishlistModal
