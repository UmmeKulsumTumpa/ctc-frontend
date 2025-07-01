import SignInForm from "../components/form/SignInForm";

const SignIn = () => {
    return (
        <div className="max-w-md mx-auto py-8 min-h-[80vh] py-32">
            <h2 className="text-2xl font-bold mb-6 text-center">Sign In To Your Account</h2>
            <SignInForm />
        </div>
    );
};

export default SignIn;
