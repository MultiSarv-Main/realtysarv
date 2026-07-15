
import React from 'react';
import { CompanyProfile } from '../../types';
import Avatar from '../Avatar';

interface AdminAppearanceSettingsProps {
  profile: CompanyProfile;
  onUpdateProfile: (updatedProfile: CompanyProfile) => void;
  themeColor: string;
  onThemeColorChange: (color: string) => void;
  themeMode: 'light' | 'dark';
  onThemeModeChange: (mode: 'light' | 'dark') => void;
}

const PREDEFINED_COLORS = [
  '#00a884', // Default Green
  '#3b82f6', // Blue
  '#a855f7', // Purple
  '#f97316', // Orange
  '#ef4444', // Red
];

const AdminAppearanceSettings: React.FC<AdminAppearanceSettingsProps> = ({ profile, onUpdateProfile, themeColor, onThemeColorChange, themeMode, onThemeModeChange }) => {
  const [logoUrl, setLogoUrl] = React.useState(profile.logoUrl);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleColorChange = (color: string) => {
    onThemeColorChange(color);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setLogoUrl(base64String);
        onUpdateProfile({ ...profile, logoUrl: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoUrl(undefined);
    onUpdateProfile({ ...profile, logoUrl: undefined });
  };
  
  return (
    <div className="p-4 bg-[var(--medium-bg)] rounded-lg shadow-md h-full flex flex-col">
      <h3 className="text-xl font-bold mb-6 text-[var(--text-primary)]">Appearance</h3>

      <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Settings Panel */}
        <div className="space-y-8">
            <fieldset className="border border-[var(--light-bg)] p-6 rounded-lg">
                <legend className="px-2 text-lg font-semibold text-[var(--text-primary)]">Color Scheme</legend>
                <div className="mt-4 space-y-4">
                    <div>
                        <label htmlFor="primaryColor" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Primary Color</label>
                        <div className="flex items-center gap-4">
                            <input
                                id="primaryColor"
                                type="color"
                                value={themeColor}
                                onChange={(e) => handleColorChange(e.target.value)}
                                className="w-12 h-12 p-1 bg-[var(--dark-bg)] border border-[var(--light-bg)] rounded-md cursor-pointer"
                            />
                             <div className="flex flex-wrap gap-3">
                                {PREDEFINED_COLORS.map(color => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => handleColorChange(color)}
                                        className={`w-8 h-8 rounded-full transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--medium-bg)] ${themeColor === color ? 'ring-2 ring-white' : ''}`}
                                        style={{ backgroundColor: color }}
                                        aria-label={`Set color to ${color}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Theme Mode</label>
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => onThemeModeChange('dark')}
                                className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${themeMode === 'dark' ? 'bg-blue-600 text-white' : 'bg-[var(--dark-bg)] text-[var(--text-secondary)] hover:bg-[var(--light-bg)]'}`}
                            >
                                <i className="fas fa-moon"></i>Dark
                            </button>
                            <button
                                type="button"
                                onClick={() => onThemeModeChange('light')}
                                className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${themeMode === 'light' ? 'bg-blue-600 text-white' : 'bg-[var(--dark-bg)] text-[var(--text-secondary)] hover:bg-[var(--light-bg)]'}`}
                            >
                                <i className="fas fa-sun"></i>Light
                            </button>
                        </div>
                    </div>
                </div>
            </fieldset>
            
             <fieldset className="border border-[var(--light-bg)] p-6 rounded-lg">
                <legend className="px-2 text-lg font-semibold text-[var(--text-primary)]">Branding</legend>
                <div className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Company Logo</label>
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-24 bg-[var(--dark-bg)] rounded-lg flex items-center justify-center border border-[var(--light-bg)]">
                                {logoUrl ? (
                                    <img src={logoUrl} alt="Company Logo" className="max-w-full max-h-full object-contain" />
                                ) : (
                                    <i className="fas fa-image text-3xl text-[var(--text-secondary)]"></i>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/png, image/jpeg, image/svg+xml" className="hidden" />
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
                                    Upload Logo
                                </button>
                                {logoUrl && (
                                     <button type="button" onClick={handleRemoveLogo} className="px-4 py-2 text-sm rounded-md bg-red-600 text-white font-medium hover:bg-red-700 transition-colors">
                                        Remove Logo
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
             </fieldset>
        </div>
        
        {/* Live Preview Panel */}
        <div>
            <div className={`sticky top-0 p-6 rounded-lg border transition-colors ${themeMode === 'dark' ? 'bg-[var(--dark-bg)] border-[var(--light-bg)]' : 'bg-[#f0f2f5] border-[#e9edef]'}`}>
                <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-4 text-center">Live Preview</h4>
                <div className="space-y-6">
                    {/* Preview Button */}
                    <div>
                        <p className="text-xs text-[var(--text-secondary)] mb-2 text-center">Button</p>
                        <button className="w-full px-5 py-2 rounded-md text-white font-medium transition-colors" style={{ backgroundColor: themeColor }}>
                            Preview Button
                        </button>
                    </div>

                    {/* Preview Chat Item */}
                     <div>
                        <p className="text-xs text-[var(--text-secondary)] mb-2 text-center">Chat Item (Active)</p>
                         <div className={`flex p-3 gap-3 rounded-md ${themeMode === 'dark' ? 'bg-[var(--light-bg)]' : 'bg-[#f8f9fa]'}`}>
                            <Avatar initials="LP" size="md" />
                            <div className="flex-1 overflow-hidden">
                                <p className="font-semibold text-[var(--text-primary)]">Lead Preview</p>
                                <p className="text-sm text-[var(--text-secondary)] truncate">This is a preview message...</p>
                            </div>
                        </div>
                    </div>
                    
                     {/* Preview Task */}
                    <div>
                        <p className="text-xs text-[var(--text-secondary)] mb-2 text-center">Icon & Tag</p>
                        <div className="flex items-center justify-center gap-4">
                            <i className="fas fa-check-circle text-2xl" style={{ color: themeColor }}></i>
                             <span className="px-3 py-1 text-sm rounded-full font-semibold text-white" style={{ backgroundColor: themeColor }}>
                                Tag
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAppearanceSettings;
