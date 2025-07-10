import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ActionIcons } from '../icons/actionIcons'
import { FaSignInAlt } from 'react-icons/fa'

interface AddToWishlistModalProps {
    onClose: () => void
}

const AddToWishlistModal: React.FC<AddToWishlistModalProps> = ({ onClose }) => {
    const navigate = useNavigate()
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none backdrop-blur-xs">
            <div className="bg-white rounded-lg shadow-lg max-w-sm w-full pointer-events-auto">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Sign in Required</h2>
                    <button 
                        onClick={onClose} 
                        className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        <ActionIcons.Cancel size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-4">
                    <p className="text-gray-700 mb-4">
                        You need to sign in to add this wishlist to your collection.
                    </p>
                    
                    <button
                        onClick={() => navigate('/signin')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                    >
                        <FaSignInAlt size={16} />
                        <span>Go to Sign In</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AddToWishlistModal
