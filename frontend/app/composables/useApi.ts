export const useApi = () => {
  const config = useRuntimeConfig();
  return {
    baseUrl: import.meta.server ? config.apiBaseUrl as string : config.public.apiBaseUrl
  };
};
