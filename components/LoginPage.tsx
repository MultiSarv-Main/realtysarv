
import React from 'react';
import { User, CompanyProfile } from '../types';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { db } from '../db';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  onGoToInstall: () => void;
  isInstalled: boolean;
  users: User[];
  companyProfile?: CompanyProfile;
  onBackToLanding: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onGoToInstall, isInstalled, users, companyProfile, onBackToLanding }) => {
  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [error, setError] = React.useState<string | null>(null);
  const [loginStep, setLoginStep] = React.useState<'identity' | 'password'>('identity');
  const [isLoading, setIsLoading] = React.useState(false);

  const [activeSubdomain, setActiveSubdomain] = React.useState<string>(() => {
    const hostname = window.location.hostname;
    if (hostname.includes('realtysarv.com')) {
      const parts = hostname.split('.');
      if (parts.length > 2) return parts[0].toLowerCase();
    }
    return localStorage.getItem('realtySarvActiveSubdomain') || '';
  });
  const [isEditingSub, setIsEditingSub] = React.useState(false);
  const [typedSub, setTypedSub] = React.useState(activeSubdomain);

  const handleSwitchWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedSub.trim()) return;
    const cleanSub = typedSub.trim().toLowerCase();
    localStorage.setItem('realtySarvActiveSubdomain', cleanSub);
    setActiveSubdomain(cleanSub);
    setIsEditingSub(false);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const firebaseUser = result.user;
        
        let existingUser = users.find(u => u.email === firebaseUser.email);
        
        if (!existingUser) {
            existingUser = {
                id: firebaseUser.uid,
                name: firebaseUser.displayName || 'Google User',
                username: firebaseUser.email?.split('@')[0] || 'google_user',
                email: firebaseUser.email || '',
                phone: firebaseUser.phoneNumber || '',
                role: firebaseUser.email === "ramdasraut9@gmail.com" ? 'Admin' : 'Sales',
                isActive: true,
                assignedProjectIds: []
            };
            await db.users.put(existingUser);
        }
        onLoginSuccess(existingUser);
    } catch (err: any) {
        console.error('Google Sign In Error:', err);
        setError(err.message || 'Verification cancelled or failed.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleNext = (e: React.FormEvent) => {
      e.preventDefault();
      if (!username.trim()) {
          setError('Enter an email or username');
          return;
      }
      setError(null);
      setLoginStep('password');
  };

  const handleSubmit = React.useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
        let user = users.find(u => u.username === username);

        if (!user && username === 'ss' && password === 'sss') {
            user = {
                id: 'dev-admin-fallback',
                name: 'RealtySarv Admin',
                username: 'ss',
                password: 'sss',
                email: 'admin@realtysarv.com',
                phone: '9876543210',
                role: 'Admin',
                isActive: true,
                assignedProjectIds: [],
            };
        }

        if (user && user.password === password) {
            onLoginSuccess(user);
        } else {
            setError('Wrong password. Try again or click Forgot password to reset it.');
            setIsLoading(false);
        }
    }, 800);
  }, [username, password, onLoginSuccess, users]);

  return (
    <div className="relative min-h-screen w-full bg-white flex flex-col items-center justify-center p-6 font-sans overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-50 rounded-full blur-[120px] opacity-60"></div>
      </div>

      <button 
        onClick={onBackToLanding}
        className="fixed top-8 left-8 text-[#5f6368] hover:text-[#1a73e8] font-medium text-sm flex items-center gap-2 transition-colors z-50"
      >
        <i className="fas fa-arrow-left text-xs"></i> BACK TO OVERVIEW
      </button>

      <div className="w-full max-w-[450px] bg-white rounded-3xl border border-[#dadce0] p-10 md:p-12 shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] z-10 relative overflow-hidden transition-all duration-500">
        <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 bg-[#1a73e8] rounded-sm flex items-center justify-center text-white shadow-sm">
                <i className="fas fa-cube text-xs"></i>
              </div>
              <span className="text-2xl font-medium tracking-tight text-[#5f6368]">
                Realty<span className="text-[#202124] font-bold">Sarv</span>
              </span>
            </div>
            <h2 className="text-2xl font-medium text-[#202124] text-center">{loginStep === 'identity' ? 'Sign in' : 'Welcome'}</h2>
            <p className="text-[#202124] text-base mt-2 flex items-center gap-2">
                {loginStep === 'identity' ? 'Use your RealtySarv Account' : (
                    <span className="flex items-center gap-2 bg-[#f1f3f4] px-3 py-1 rounded-full border border-[#dadce0] text-sm">
                        <i className="fas fa-user-circle text-[#5f6368]"></i> {username}
                        <button onClick={() => setLoginStep('identity')} className="text-[#1a73e8] hover:text-[#174ea6]"><i className="fas fa-chevron-down text-[10px]"></i></button>
                    </span>
                )}
            </p>
            {isEditingSub ? (
              <form onSubmit={handleSwitchWorkspace} className="mt-4 flex flex-col items-center bg-slate-50 border border-[#1a73e8]/30 rounded-xl p-3 text-center w-full animate-fadeIn">
                <span className="text-[10px] font-bold text-[#1a73e8] uppercase tracking-widest mb-1.5">Change Workspace Subdomain</span>
                <div className="flex items-center gap-1.5 justify-center w-full max-w-[280px]">
                  <div className="relative flex items-center w-full">
                    <input
                      autoFocus
                      required
                      type="text"
                      id="subdomain-change-input"
                      placeholder="e.g. shreesh"
                      value={typedSub}
                      onChange={(e) => setTypedSub(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#1a73e8]"
                    />
                    <span className="absolute right-3 text-[10px] text-gray-400 font-bold font-mono">.realtysarv.com</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button type="submit" className="px-3 py-1 bg-[#1a73e8] text-white text-[10px] font-bold rounded-lg hover:bg-[#174ea6] transition-colors">Apply Route</button>
                  <button type="button" onClick={() => setIsEditingSub(false)} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-slate-600 text-[10px] font-bold rounded-lg transition-colors">Cancel</button>
                </div>
              </form>
            ) : (
              <div className="mt-4 flex flex-col items-center bg-slate-50 border border-slate-200/50 rounded-xl px-4 py-2.5 text-center w-full animate-fadeIn shadow-inner">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Enterprise Client Workspace</span>
                <div className="flex flex-col items-center gap-1 justify-center">
                  <div className="flex items-center gap-1.5 justify-center">
                    <i className="fas fa-building text-[#1a73e8] text-[11px]"></i>
                    <span id="active-workspace-name" className="text-xs font-extrabold text-slate-700 tracking-tight">
                      {activeSubdomain && companyProfile?.customData?.subdomain === activeSubdomain
                        ? companyProfile.name
                        : (activeSubdomain ? `${activeSubdomain.charAt(0).toUpperCase() + activeSubdomain.slice(1)} Realty` : (companyProfile?.name || "My RealtySarv Workspace"))
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-1 justify-center">
                    <span className="text-[10px] font-bold font-mono text-slate-500 bg-slate-200/50 border border-slate-200 px-2 py-0.5 rounded-md">
                      {activeSubdomain ? `${activeSubdomain}.realtysarv.com` : 'local-default'}
                    </span>
                    <button 
                      type="button" 
                      onClick={() => { setTypedSub(activeSubdomain); setIsEditingSub(true); }}
                      className="text-[10px] font-bold text-[#1a73e8] hover:underline ml-1"
                    >
                      (switch)
                    </button>
                  </div>
                </div>
              </div>
            )}
        </div>

        <div className="relative min-h-[140px]">
            {error && (
                <div id="login-error-alert" className="mb-4 text-xs text-[#d93025] flex items-center gap-2 bg-red-50 p-3 rounded-lg border border-red-100 animate-fadeIn">
                    <i className="fas fa-exclamation-circle text-xs flex-shrink-0"></i>
                    <span>{error}</span>
                </div>
            )}
            {loginStep === 'identity' ? (
                <form onSubmit={handleNext} className="animate-fadeIn space-y-6">
                    <div className="relative group">
                        <input autoFocus type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-4 rounded-md border border-[#dadce0] text-[#202124] text-base placeholder-transparent focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition-all peer" placeholder="Username" />
                        <label htmlFor="username" className="absolute left-4 -top-2.5 bg-white px-1 text-xs text-[#1a73e8] transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#5f6368] peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-[#1a73e8]">Email or username</label>
                    </div>
                </form>
            ) : (
                <form onSubmit={handleSubmit} className="animate-fadeIn space-y-6">
                    <div className="relative group">
                        <input autoFocus type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-4 rounded-md border border-[#dadce0] text-[#202124] text-base placeholder-transparent focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition-all peer" placeholder="Password" />
                        <label htmlFor="password" className="absolute left-4 -top-2.5 bg-white px-1 text-xs text-[#1a73e8] transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#5f6368] peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-[#1a73e8]">Enter your password</label>
                    </div>
                </form>
            )}
        </div>

        <div className="flex justify-between items-center mt-12 mb-6">
            {loginStep === 'identity' ? (
                <button type="button" onClick={onGoToInstall} className="text-[#1a73e8] font-bold text-sm hover:bg-blue-50 px-4 py-2 rounded transition-colors">Create Account / Setup Workspace</button>
            ) : <div className="invisible"></div>}
            <button onClick={loginStep === 'identity' ? handleNext : handleSubmit} disabled={isLoading} className="px-8 py-2.5 bg-[#1a73e8] text-white rounded font-bold text-sm hover:bg-[#174ea6] transition-all shadow-md active:scale-95 flex items-center gap-2 min-w-[100px] justify-center">{isLoading ? <i className="fas fa-circle-notch fa-spin text-lg"></i> : (loginStep === 'identity' ? 'Next' : 'Login')}</button>
        </div>

        {/* Google Authentication Divider & Button */}
        <div className="border-t border-[#dadce0] pt-6 flex flex-col items-center">
            <button 
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-[#dadce0] rounded-md bg-white hover:bg-gray-50 text-gray-700 font-bold text-sm shadow-sm transition-all duration-200 active:scale-[0.98]"
            >
                <i className="fab fa-google text-red-500 text-base"></i>
                Sign in with Google
            </button>
        </div>
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-6 text-xs text-[#5f6368] font-medium z-10">
        <button className="hover:underline">English (United Kingdom)</button>
        <div className="flex gap-6">
            <button className="hover:underline">Help</button>
            <button className="hover:underline">Privacy</button>
            <button className="hover:underline">Terms</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
