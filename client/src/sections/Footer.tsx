export function Footer() {
    const today = new Date();

    return (
        <footer className="bg-gray-800 text-white py-8">
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
                <p>
                    &copy; {today.getFullYear()} Cefalo Travel Connect. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
