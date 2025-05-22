export const isAuthenticated = () => {
  return localStorage.getItem("userId") !== null;
};

export const loginLocal = (userId) => {
  localStorage.setItem("userId", userId);
};

export const logoutLocal = () => {
  localStorage.removeItem("userId");
};

export const getUser = () => {
  return localStorage.getItem("userId");
};
