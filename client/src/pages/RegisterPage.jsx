import RegisterForm from '../components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      {/* Subtle ice texture overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-secondary-dark/10 via-transparent to-primary/5 pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full border-4 border-accent shadow-lg shadow-primary/40 mb-4">
            <span className="font-heading font-bold text-white text-xl">GP</span>
          </div>
          <h1 className="font-heading text-4xl font-bold text-accent uppercase tracking-widest">
            Goal Posts
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-primary via-accent to-primary mx-auto mt-3" />
          <p className="text-text-secondary text-sm mt-3 font-scoreboard uppercase tracking-wider">
            Create Your Account
          </p>
        </div>

        {/* Register Card */}
        <div className="card border-t-4 border-t-primary">
          <h2 className="font-heading text-xl font-bold text-text-primary uppercase tracking-wider mb-6 text-center">
            Register
          </h2>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
