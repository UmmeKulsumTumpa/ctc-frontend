import React from 'react'
import { ActionIcons } from '../icons/actionIcons'
import { FaCopy } from 'react-icons/fa'

interface ShareWishlistModalProps {
    link: string
    onClose: () => void
}

const ShareWishlistModal: React.FC<ShareWishlistModalProps> = ({ link, onClose }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(link)
    }
    
    return (
        <div className="fixed z-50 flex items-center justify-center p-4 inset-0 pointer-events-none backdrop-blur-xs">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full pointer-events-auto">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Share Wishlist</h2>
                    <button 
                        onClick={onClose} 
                        className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        <ActionIcons.Cancel size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-4">
                    <p className="text-sm text-gray-600 mb-3">Copy and share this link:</p>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={link}
                            readOnly
                            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 focus:outline-none"
                            onFocus={e => e.target.select()}
                        />
                        
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                        >
                            <FaCopy size={14} />
                            <span className="text-sm">Copy</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShareWishlistModal
