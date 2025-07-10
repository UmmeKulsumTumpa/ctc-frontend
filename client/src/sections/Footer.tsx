export function Footer() {
    const today = new Date();
    return (
        <footer className="bg-blue-900 text-white border-t-2 border-blue-200 mt-16">
            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="text-center">
                    <p className="text-blue-100 text-lg mb-2">
                        &copy; {today.getFullYear()} Cefalo Travel Connect. All rights reserved.
                    </p>
                    <p className="text-blue-200">
                        Where dreams take flight and adventures begin
                    </p>
                </div>
            </div>
        </footer>
    );
}
