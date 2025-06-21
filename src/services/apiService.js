import axios from "axios";

// Create axios instance with default configuration
const apiClient = axios.create({
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add any common request modifications here
    console.log(
      `Making ${config.method?.toUpperCase()} request to: ${config.url}`
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      console.error(
        "API Error Response:",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      // Request was made but no response received
      console.error("API No Response:", error.request);
    } else {
      // Something else happened
      console.error("API Error:", error.message);
    }
    return Promise.reject(error);
  }
);

// Generic API call function
export const apiCall = async (config) => {
  try {
    const response = await apiClient(config);
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      status: error.response?.status || null,
    };
  }
};

// Base URL for all meta deck APIs
const BASE_URL =
  "https://raw.githubusercontent.com/abhidexhigh/ItemSwapJsonData/refs/heads/main";

// Specific function to fetch comps data
export const fetchCompsData = async () => {
  const config = {
    method: "GET",
    url: `${BASE_URL}/compsNew.json`,
  };

  try {
    const result = await apiCall(config);

    if (result.success) {
      // Parse the data structure to match what the component expects
      const {
        props: {
          pageProps: {
            dehydratedState: {
              queries: { data },
            },
          },
        },
      } = result.data;

      return {
        success: true,
        data: {
          metaDecks: data?.metaDeckList?.metaDecks || [],
          champions: data?.refs?.champions || [],
          items: data?.refs?.items || [],
          traits: data?.refs?.traits || [],
          augments: data?.refs?.augments || [],
          forces: data?.refs?.forces || [],
          skillTree: data?.refs?.skillTree || [],
        },
      };
    }

    return result;
  } catch (error) {
    console.error("Error fetching comps data:", error);
    return {
      success: false,
      error: "Failed to parse comps data",
    };
  }
};

// Generic function to fetch meta deck data
export const fetchMetaDeckData = async (endpoint) => {
  const config = {
    method: "GET",
    url: `${BASE_URL}/${endpoint}`,
  };

  try {
    const result = await apiCall(config);

    if (result.success) {
      // Return the data directly as it's already in the expected format
      return {
        success: true,
        data: result.data,
      };
    }

    return result;
  } catch (error) {
    console.error(`Error fetching meta deck data from ${endpoint}:`, error);
    return {
      success: false,
      error: `Failed to fetch data from ${endpoint}`,
    };
  }
};

// Specific functions for each meta deck type
export const fetchMetaDeckChampions = () =>
  fetchMetaDeckData("metaDeckChampions.json");
export const fetchMetaDeckTraits = () =>
  fetchMetaDeckData("metaDeckTraits.json");
export const fetchMetaDeckItems = () => fetchMetaDeckData("metaDeckItems.json");
export const fetchMetaDeckSkillTree = () =>
  fetchMetaDeckData("metaDeckSkillTree.json");
export const fetchMetaDeckAugments = () =>
  fetchMetaDeckData("metaDeckAugments.json");

// Other reusable API functions can be added here
export const get = (url, config = {}) => {
  return apiCall({ method: "GET", url, ...config });
};

export const post = (url, data, config = {}) => {
  return apiCall({ method: "POST", url, data, ...config });
};

export const put = (url, data, config = {}) => {
  return apiCall({ method: "PUT", url, data, ...config });
};

export const del = (url, config = {}) => {
  return apiCall({ method: "DELETE", url, ...config });
};

export default apiClient;
