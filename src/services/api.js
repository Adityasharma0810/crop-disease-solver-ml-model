const getBackend2BaseUrl = () => {
  return (
    import.meta.env.VITE_BACKEND2_URL ||
    "https://crop-disease-solver-ml-model-0yo1.onrender.com"
  );
};

export const BACKEND2_BASE_URL = getBackend2BaseUrl();