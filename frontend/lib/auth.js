const TOKEN_KEY = "token";
const USER_KEY = "user";

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  if (typeof window === "undefined") return;
  if (!token) return;

  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
};

export const getUser = () => {
  if (typeof window === "undefined") return null;

  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (err) {
    console.error("Invalid user data in storage, clearing auth");
    clearAuth();
    return null;
  }
};

export const setUser = (user) => {
  if (typeof window === "undefined") return;
  if (!user) return;

  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const removeUser = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = () => {
  const token = getToken();
  const user = getUser();
  return Boolean(token && user);
};

export const clearAuth = () => {
  removeToken();
  removeUser();
};

export const logout = (router) => {
  clearAuth();

  if (router) {
    router.push("/login");
  } else if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};
