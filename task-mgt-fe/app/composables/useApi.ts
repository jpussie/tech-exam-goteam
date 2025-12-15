export const useApi = () => {
  const config = useRuntimeConfig();
  const tokenCookie = useCookie('auth_token');

  const api = async (path: string, opts: RequestInit | any = {}) => {
    const url = `${config.public.apiBase}${path}`;

    // set headers
    const headers = {
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    };

    if (tokenCookie.value) {
      headers['Authorization'] = `Bearer ${tokenCookie.value}`;
    }

    // use native fetch or $fetch
    const response = await $fetch(url, {
      ...opts,
      headers,
      // credentials: 'include', // only for cookie-based flow
    });

    return response;
  };

  return { api };
};
