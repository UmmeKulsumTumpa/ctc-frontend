export function Footer(){
    const today = new Date();

    return (
        <footer className="bg-blue-600 text-white text-center p-4">
            <p>
                &copy; {today.getFullYear()} CTC. All rights reserved.
            </p>
        </footer>
    )
}