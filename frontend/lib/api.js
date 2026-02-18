import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      typeof window !== "undefined" &&
      error.response?.status === 401
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post("/api/auth/register", data),
  login: (data) => api.post("/api/auth/login", data),
  getMe: () => api.get("/api/auth/me"),
};

export const resumeAPI = {
  createOrUpdateBase: (data) =>
    api.post("/api/resume/base", data),

  getBase: () => api.get("/api/resume/base"),
  getVersions: () => api.get("/api/resume/versions"),
  getVersion: (id) =>
    api.get(`/api/resume/versions/${id}`),

  deleteVersion: (id) =>
    api.delete(`/api/resume/versions/${id}`),

  getStats: () => api.get("/api/resume/stats"),

  downloadPDF: async (id) => {
    const response = await api.get(
      `/api/resume/pdf/${id}`,
      { responseType: "blob" }
    );

    const blob = new Blob([response.data], {
      type: "application/pdf",
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "resume.pdf";

    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  },
};

export const aiAPI = {
  getRoles: () => api.get("/api/ai/roles"),

  adaptResume: (data) =>
    api.post("/api/ai/adapt", data),

  parseResumeFile: async (file) => {
    const formData = new FormData();
    formData.append("resume", file);

    return api.post(
      "/api/ai/parse-resume",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },
};

export default api;
