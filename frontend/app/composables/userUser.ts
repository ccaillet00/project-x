// composables/useUser.ts
interface User {
  id: number;
  username: string;
}

export const useUser = () => {
  const user = useState<User | null>("user", () => null);

  const loadUserFromToken = () => {
    const token = useCookie<string>("token");
    const tokenValue = token.value as string;

    if (!tokenValue) return;

    try {
      const parts = tokenValue.split(".");
      if (parts.length < 3) return;

      const payload = JSON.parse(atob(parts[1] as string));
      user.value = {
        id: payload.id,
        username: payload.username,
      };
    } catch {
      user.value = null;
    }
  };

  // ← Beim ersten Aufruf direkt laden falls Token vorhanden
  if (!user.value) {
    loadUserFromToken();
  }

  return { user, loadUserFromToken };
};
