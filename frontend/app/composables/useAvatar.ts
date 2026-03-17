// composables/useAvatar.ts
export const useAvatar = () => {
  const colors = [
    "bg-red-400",
    "bg-orange-400",
    "bg-amber-400",
    "bg-green-400",
    "bg-teal-400",
    "bg-blue-400",
    "bg-indigo-400",
    "bg-violet-400",
    "bg-pink-400",
    "bg-rose-400",
  ];

  const getColor = (username: string | undefined): string => {
    if (!username) return "bg-gray-400"; // ← Fallback
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length] ?? "bg-gray-400";
  };

  const getInitial = (username: string | undefined): string => {
    return username?.charAt(0).toUpperCase() ?? "?";
  };

  return { getColor, getInitial };
};
