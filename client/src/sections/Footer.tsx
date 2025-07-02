export function Footer() {
    const today = new Date();
    return (
        <footer className="bg-gray-900 text-white py-8 w-full footer-bottom">
            <div className="text-center text-blue-100">
                <p>
                    &copy; {today.getFullYear()} Cefalo Travel Connect. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
