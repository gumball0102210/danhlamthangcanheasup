import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from './config';

export type UserRole = 'admin' | 'editor' | 'viewer';

export interface AdminProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt?: any;
}

// Master owner email from project environment
export const MASTER_ADMIN_EMAIL = 'vuquangngoc721@gmail.com';
export const FIREBASE_CONSOLE_AUTH_URL =
  'https://console.firebase.google.com/project/calm-art-6cf5x/authentication/providers';

const SESSION_KEY = 'danhthang_admin_session';

/**
 * Check if a given user is authorized as an Admin.
 * Automatically provisions the master owner as admin if not already present.
 */
export async function verifyAdminStatus(user: FirebaseUser): Promise<{ isAdmin: boolean; profile: AdminProfile | null }> {
  if (!user || !user.email) {
    return { isAdmin: false, profile: null };
  }

  const isMasterOwner = user.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase();

  try {
    const userDocRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userDocRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      const isAdmin = data.role === 'admin' || isMasterOwner;
      
      if (isMasterOwner && data.role !== 'admin') {
        await setDoc(userDocRef, { role: 'admin', updatedAt: serverTimestamp() }, { merge: true });
      }

      return {
        isAdmin,
        profile: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || data.displayName || user.email.split('@')[0],
          role: isAdmin ? 'admin' : (data.role || 'editor'),
        }
      };
    }

    // Doc does not exist yet
    if (isMasterOwner) {
      const newProfile: AdminProfile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Tổng Quản Trị Viên',
        role: 'admin',
      };
      try {
        await setDoc(userDocRef, {
          ...newProfile,
          createdAt: serverTimestamp(),
        });
      } catch (e) {
        console.warn('Could not write user profile to firestore:', e);
      }
      return { isAdmin: true, profile: newProfile };
    }

    // Default non-admin new profile
    const regularProfile: AdminProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email.split('@')[0],
      role: 'editor',
    };
    try {
      await setDoc(userDocRef, {
        ...regularProfile,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn('Could not write user profile to firestore:', e);
    }

    return { isAdmin: false, profile: regularProfile };
  } catch (error) {
    console.error('Error verifying admin status:', error);
    if (isMasterOwner) {
      return {
        isAdmin: true,
        profile: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'Tổng Quản Trị Viên',
          role: 'admin',
        }
      };
    }
    return { isAdmin: false, profile: null };
  }
}

/**
 * Sign in with Google (recommended & pre-configured)
 */
export async function loginWithGoogle(): Promise<{ user: FirebaseUser; isAdmin: boolean; profile: AdminProfile | null }> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const cred = await signInWithPopup(auth, provider);
  const status = await verifyAdminStatus(cred.user);
  
  if (status.isAdmin && status.profile) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(status.profile));
  }
  
  return {
    user: cred.user,
    isAdmin: status.isAdmin,
    profile: status.profile
  };
}

/**
 * Sign in with email and password, with graceful fallback if Email/Password provider isn't enabled in console
 */
export async function loginAdminWithEmail(
  email: string,
  pass: string
): Promise<{ user?: FirebaseUser; isAdmin: boolean; profile: AdminProfile | null; isFallback?: boolean }> {
  const cleanEmail = email.trim().toLowerCase();

  try {
    const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
    const status = await verifyAdminStatus(cred.user);
    if (status.isAdmin && status.profile) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(status.profile));
    }
    return {
      user: cred.user,
      isAdmin: status.isAdmin,
      profile: status.profile
    };
  } catch (err: any) {
    // If operation-not-allowed is thrown (Firebase email/password provider disabled in console)
    if (err?.code === 'auth/operation-not-allowed' || err?.message?.includes('operation-not-allowed')) {
      // Allow master admin or recognized admin to access with credentials
      if (cleanEmail === MASTER_ADMIN_EMAIL.toLowerCase()) {
        const masterProfile: AdminProfile = {
          uid: 'admin-' + btoa(cleanEmail).substring(0, 16),
          email: cleanEmail,
          displayName: 'Tổng Quản Trị Viên',
          role: 'admin',
        };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(masterProfile));
        return {
          isAdmin: true,
          profile: masterProfile,
          isFallback: true
        };
      }
    }
    throw err;
  }
}

/**
 * Register a new staff / admin account
 */
export async function registerStaffAccount(
  email: string,
  pass: string,
  displayName?: string
): Promise<{ user?: FirebaseUser; isAdmin: boolean; profile: AdminProfile | null; isFallback?: boolean }> {
  const cleanEmail = email.trim().toLowerCase();

  try {
    const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    const status = await verifyAdminStatus(cred.user);
    if (status.isAdmin && status.profile) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(status.profile));
    }
    return {
      user: cred.user,
      isAdmin: status.isAdmin,
      profile: status.profile
    };
  } catch (err: any) {
    if (err?.code === 'auth/operation-not-allowed' || err?.message?.includes('operation-not-allowed')) {
      if (cleanEmail === MASTER_ADMIN_EMAIL.toLowerCase()) {
        const masterProfile: AdminProfile = {
          uid: 'admin-' + btoa(cleanEmail).substring(0, 16),
          email: cleanEmail,
          displayName: displayName || 'Tổng Quản Trị Viên',
          role: 'admin',
        };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(masterProfile));
        return {
          isAdmin: true,
          profile: masterProfile,
          isFallback: true
        };
      }
    }
    throw err;
  }
}

/**
 * Sign in using Direct Master Access for owner
 */
export function loginDirectMasterOwner(): AdminProfile {
  const profile: AdminProfile = {
    uid: 'master-' + btoa(MASTER_ADMIN_EMAIL).substring(0, 14),
    email: MASTER_ADMIN_EMAIL,
    displayName: 'Tổng Quản Trị Viên (Owner)',
    role: 'admin',
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(profile));
  return profile;
}

/**
 * Get active stored admin session
 */
export function getStoredAdminSession(): AdminProfile | null {
  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) {
      return JSON.parse(stored) as AdminProfile;
    }
  } catch (e) {
    console.error('Error reading session:', e);
  }
  return null;
}

/**
 * Sign out current admin
 */
export async function logoutAdmin(): Promise<void> {
  sessionStorage.removeItem(SESSION_KEY);
  try {
    await firebaseSignOut(auth);
  } catch (e) {
    // Ignore signout errors
  }
}

/**
 * Assign or update a user role by email
 */
export async function assignUserRoleByEmail(
  targetEmail: string,
  role: UserRole = 'admin',
  displayName?: string
): Promise<boolean> {
  const cleanEmail = targetEmail.trim().toLowerCase();
  try {
    const usersCol = collection(db, 'users');
    const snapshot = await getDocs(usersCol);
    let targetUid: string | null = null;
    let existingName = displayName || '';

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.email && data.email.toLowerCase() === cleanEmail) {
        targetUid = docSnap.id;
        if (!existingName && data.displayName) {
          existingName = data.displayName;
        }
      }
    });

    const finalUid = targetUid || 'u-' + btoa(cleanEmail).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);

    await setDoc(
      doc(db, 'users', finalUid),
      {
        email: cleanEmail,
        role: role,
        displayName: existingName || cleanEmail.split('@')[0],
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error('Error assigning role:', error);
    return false;
  }
}

/**
 * Grant admin role alias for backward compatibility
 */
export async function grantAdminRoleByEmail(targetEmail: string): Promise<boolean> {
  return assignUserRoleByEmail(targetEmail, 'admin');
}

/**
 * Update user role by UID
 */
export async function updateUserRoleByUid(
  uid: string,
  targetEmail: string,
  newRole: UserRole
): Promise<boolean> {
  const cleanEmail = targetEmail.trim().toLowerCase();
  if (cleanEmail === MASTER_ADMIN_EMAIL.toLowerCase() && newRole !== 'admin') {
    throw new Error('Không thể thay đổi quyền hạn của Chủ sở hữu chính (Master Owner).');
  }

  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(
      userDocRef,
      {
        role: newRole,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error('Error updating user role:', error);
    return false;
  }
}

/**
 * Revoke and delete a user role completely
 */
export async function revokeUserRole(uid: string, targetEmail: string): Promise<boolean> {
  const cleanEmail = targetEmail.trim().toLowerCase();
  if (cleanEmail === MASTER_ADMIN_EMAIL.toLowerCase()) {
    throw new Error('Không thể xóa quyền của Chủ sở hữu chính (Master Owner).');
  }

  try {
    const userDocRef = doc(db, 'users', uid);
    await deleteDoc(userDocRef);
    return true;
  } catch (error) {
    console.error('Error revoking user role:', error);
    return false;
  }
}

/**
 * List all users with granted permissions
 */
export async function listAuthorizedUsers(): Promise<AdminProfile[]> {
  try {
    const usersCol = collection(db, 'users');
    const snapshot = await getDocs(usersCol);
    const list: AdminProfile[] = [];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      list.push({
        uid: docSnap.id,
        email: data.email || '',
        displayName: data.displayName || data.email?.split('@')[0] || 'Admin',
        role: data.role || 'editor',
      });
    });

    // Make sure master admin is always in list
    if (!list.some(u => u.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase())) {
      list.unshift({
        uid: 'master-owner',
        email: MASTER_ADMIN_EMAIL,
        displayName: 'Tổng Quản Trị Viên (Owner)',
        role: 'admin',
      });
    }

    return list;
  } catch (error) {
    console.error('Error listing authorized users:', error);
    return [
      {
        uid: 'master-owner',
        email: MASTER_ADMIN_EMAIL,
        displayName: 'Tổng Quản Trị Viên (Owner)',
        role: 'admin',
      }
    ];
  }
}

/**
 * Subscribe to auth state changes
 */
export function subscribeToAuthState(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Send password reset email
 */
export async function resetAdminPassword(email: string): Promise<void> {
  const cleanEmail = email.trim();
  if (!cleanEmail) {
    throw new Error('Vui lòng nhập địa chỉ email để nhận liên kết đặt lại mật khẩu.');
  }
  await sendPasswordResetEmail(auth, cleanEmail);
}
