import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebaseClient';

export default function useFirebaseUser(): User | null {
  const [user, setUser] = useState<User | null>(auth.currentUser ?? null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u ?? null);
    });
    return () => unsub();
  }, []);

  return user;
}
