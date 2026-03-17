export const useTimeAgo = (date: string | Date | null | undefined): string => {
  if (!date) return "";

  const then = new Date(date);
  if (isNaN(then.getTime())) return ""; // ← ungültiges Datum abfangen

  const now = new Date();
  const diff = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
};
