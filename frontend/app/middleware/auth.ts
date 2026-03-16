export default defineNuxtRouteMiddleware(() => {
  const token = useCookie("token");
  const tokenValue = token.value as string;
  if (!tokenValue) {
    return navigateTo("/");
  }

  try {
    const parts = tokenValue.split(".");
    if (parts.length < 3) return;

    const payload = JSON.parse(atob(parts[1] as string));
    const isExpired = payload.exp * 1000 < Date.now();

    if (isExpired) {
      token.value = null;
      useState("user").value = null;
      return navigateTo("/");
    }
  } catch {
    token.value = null;
    useState("user").value = null;
    return navigateTo("/");
  }
});
