import SignUpForm from "../components/form/SignUpForm";

const SignUp = () => {
    return (
        <div className="max-w-md mx-auto min-h-[80vh] py-32">
            <h2 className="text-2xl font-bold mb-6 text-center">Sign Up To Our Platform</h2>
            <SignUpForm />
        </div>
    );
};

export default SignUp;
