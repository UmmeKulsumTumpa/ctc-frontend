import React from 'react'

interface ShareWishlistModalProps {
    link: string
    onClose: () => void
}

const ShareWishlistModal: React.FC<ShareWishlistModalProps> = ({ link, onClose }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(link)
    }
    return (
        <div className="fixed left-0 top-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative mx-auto pointer-events-auto mt-24">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl">
                    ×
                </button>

                <h2 className="text-2xl font-bold text-emerald-900 mb-4">
                    Share Wishlist
                </h2>

                <div className="mb-6 text-gray-700">Copy and share this link:</div>

                <div className="flex items-center gap-2 mb-6">
                    <input
                        type="text"
                        value={link}
                        readOnly
                        className="flex-1 border-2 border-emerald-200 rounded-lg px-3 py-2 text-gray-800 bg-gray-50"
                        onFocus={e => e.target.select()}
                    />
                    
                    <button
                        onClick={handleCopy}
                        className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors"
                    >
                        Copy
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ShareWishlistModal
