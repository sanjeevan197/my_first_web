const SUPER_ADMIN = 'sanjeev.arjava@gmail.com';

// Get admin list from localStorage (managed by super admin)
const getAdminEmails = (): string[] => {
  const stored = localStorage.getItem('adminEmails');
  return stored ? JSON.parse(stored) : [];
};

// Save admin list to localStorage
const saveAdminEmails = (emails: string[]): void => {
  localStorage.setItem('adminEmails', JSON.stringify(emails));
};

export const isSuperAdmin = (email: string | null): boolean => {
  return email?.toLowerCase() === SUPER_ADMIN;
};

export const isAdmin = (email: string | null): boolean => {
  if (!email) return false;
  if (isSuperAdmin(email)) return true;
  const adminEmails = getAdminEmails();
  return adminEmails.includes(email.toLowerCase());
};

export const getUserRole = (email: string | null): 'superadmin' | 'admin' | 'user' => {
  if (isSuperAdmin(email)) return 'superadmin';
  if (isAdmin(email)) return 'admin';
  return 'user';
};

export const addAdmin = (email: string): boolean => {
  const adminEmails = getAdminEmails();
  if (!adminEmails.includes(email.toLowerCase())) {
    adminEmails.push(email.toLowerCase());
    saveAdminEmails(adminEmails);
    return true;
  }
  return false;
};

export const removeAdmin = (email: string): boolean => {
  const adminEmails = getAdminEmails();
  const filtered = adminEmails.filter(e => e !== email.toLowerCase());
  if (filtered.length !== adminEmails.length) {
    saveAdminEmails(filtered);
    return true;
  }
  return false;
};

export const getAllAdmins = (): string[] => {
  return getAdminEmails();
};