import SignUpForm from "../components/form/SignUpForm";

const SignUp = () => {
    return (
        <div className="min-h-[85vh] bg-white py-16">
            <div className="max-w-6xl mx-auto px-6">
                <div className="max-w-md mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-emerald-900 mb-3">
                            Join the Adventure Club
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Start your journey of a lifetime
                        </p>
                    </div>
                    <SignUpForm />
                </div>
            </div>
        </div>
    );
};

export default SignUp;
