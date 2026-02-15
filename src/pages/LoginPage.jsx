import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, User, Lock } from 'lucide-react';
import clsx from 'clsx';

export const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm();

    const onSubmit = async (data) => {
        try {
            await login(data.email, data.password, data.rememberMe);
            navigate(from, { replace: true });
        } catch (error) {
            setError('root', {
                type: 'manual',
                message: error.message || 'Login failed',
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="mx-auto w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
                            <LogIn className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                        <p className="text-gray-400">Sign in to manage your tasks</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    {...register('email', { required: 'Email is required' })}
                                    className={clsx(
                                        "block w-full pl-10 pr-3 py-3 bg-gray-900/50 border rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all",
                                        errors.email ? "border-red-500 focus:ring-red-500/50" : "border-gray-700"
                                    )}
                                    placeholder="intern@demo.com"
                                />
                            </div>
                            {errors.email && <p className="text-red-400 text-xs ml-1">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    {...register('password', { required: 'Password is required' })}
                                    className={clsx(
                                        "block w-full pl-10 pr-3 py-3 bg-gray-900/50 border rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all",
                                        errors.password ? "border-red-500 focus:ring-red-500/50" : "border-gray-700"
                                    )}
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && <p className="text-red-400 text-xs ml-1">{errors.password.message}</p>}
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    {...register('rememberMe')}
                                    className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-600 rounded bg-gray-800"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                                    Remember me
                                </label>
                            </div>
                            <div className="text-sm">
                                <a href="#" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        {errors.root && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                                {errors.root.message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-blue-500/20 hover:shadow-blue-500/40"
                        >
                            {isSubmitting ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : 'Sign in'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-xs text-gray-500">
                        <p>Use existing credentials:</p>
                        <p className="mt-1 font-mono bg-gray-800/50 inline-block px-2 py-1 rounded">intern@demo.com / intern123</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
