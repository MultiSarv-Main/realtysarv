
import React from 'react';
import { User } from '../../types';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSaveUser: (updatedUser: User) => void;
  users: User[];
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, user, onSaveUser, users }) => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmNewPassword, setConfirmNewPassword] = React.useState('');
  const [reportsTo, setReportsTo] = React.useState('');
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone || '');
      setReportsTo(user.reportsTo || '');
      setNewPassword('');
      setConfirmNewPassword('');
      setErrors({});
    }
  }, [user]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.trim() && !emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (newPassword && newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters long.';
    }
    if (newPassword && newPassword !== confirmNewPassword) {
      newErrors.confirmNewPassword = 'Passwords do not match.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = React.useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (validate()) {
      const updatedUser: User = { 
        ...user, 
        name: name.trim(), 
        email: email.trim(), 
        phone: phone.trim(),
        reportsTo: reportsTo || null,
      };
      
      if (newPassword) {
        updatedUser.password = newPassword;
      }

      onSaveUser(updatedUser);
      onClose();
    } else {
        // Validation errors are displayed on the form
    }
  }, [name, email, phone, newPassword, confirmNewPassword, reportsTo, user, errors, onSaveUser, onClose]);

  if (!isOpen || !user) return null;
  
  const potentialManagers = users.filter(u => u.id !== user.id); // A user cannot report to themselves

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 animate-fadeIn"
      onClick={onClose}
      aria-labelledby="editUserModalTitle"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-[var(--medium-bg)] p-6 sm:p-8 rounded-lg shadow-xl w-11/12 max-w-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="editUserModalTitle" className="text-xl sm:text-2xl font-bold mb-6 text-[var(--text-primary)] text-center">
          Edit User: {user?.name}
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="editUserName" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Full Name</label>
            <input type="text" id="editUserName" value={name} onChange={handleInputChange(setName, 'name')} className="w-full p-3 rounded-md border border-[var(--light-bg)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)]" required />
          </div>
          <div>
            <label htmlFor="editUserUsername" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Username (Read-only)</label>
            <input type="text" id="editUserUsername" value={user.username} readOnly className="w-full p-3 rounded-md border border-[var(--light-bg)] bg-[var(--dark-bg)] text-[var(--text-secondary)] focus:outline-none cursor-not-allowed" />
          </div>
          <div>
            <label htmlFor="editUserEmail" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Email</label>
            <input type="email" id="editUserEmail" value={email} onChange={handleInputChange(setEmail, 'email')} onBlur={validate} className={`w-full p-3 rounded-md border ${errors.email ? 'border-red-500' : 'border-[var(--light-bg)]'} bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)]`} required />
            {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email}</span>}
          </div>
          <div>
            <label htmlFor="editUserPhone" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Mobile Number</label>
            <input type="tel" id="editUserPhone" value={phone} onChange={handleInputChange(setPhone, 'phone')} className="w-full p-3 rounded-md border border-[var(--light-bg)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)]" required />
          </div>
           <div>
              <label htmlFor="editReportsTo" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Reports To</label>
              <select id="editReportsTo" value={reportsTo} onChange={(e) => setReportsTo(e.target.value)} className="w-full p-3 rounded-md border border-[var(--light-bg)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)]">
                <option value="">-- None --</option>
                {potentialManagers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
          <div className="pt-4 mt-2 border-t border-[var(--light-bg)]">
            <p className="text-sm text-[var(--text-secondary)] mb-2">Change Password (optional)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="editNewPassword" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">New Password</label>
                <input type="password" id="editNewPassword" value={newPassword} onChange={handleInputChange(setNewPassword, 'newPassword')} onBlur={validate} placeholder="••••••••" className={`w-full p-3 rounded-md border ${errors.newPassword ? 'border-red-500' : 'border-[var(--light-bg)]'} bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)]`} />
                {errors.newPassword && <span className="text-red-500 text-xs mt-1 block">{errors.newPassword}</span>}
              </div>
              <div>
                <label htmlFor="editConfirmNewPassword" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Confirm New Password</label>
                <input type="password" id="editConfirmNewPassword" value={confirmNewPassword} onChange={handleInputChange(setConfirmNewPassword, 'confirmNewPassword')} onBlur={validate} placeholder="••••••••" className={`w-full p-3 rounded-md border ${errors.confirmNewPassword ? 'border-red-500' : 'border-[var(--light-bg)]'} bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)]`} />
                {errors.confirmNewPassword && <span className="text-red-500 text-xs mt-1 block">{errors.confirmNewPassword}</span>}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-md bg-gray-700 text-[var(--text-primary)] font-medium hover:bg-gray-600 transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-md bg-[var(--primary-color)] text-white font-medium hover:bg-[#128c7e] transition-colors">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
