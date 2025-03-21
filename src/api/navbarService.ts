import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchNavbarData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/navbar`);
    return response.data;
  } catch (error) {
    console.error('Error fetching navbar data:', error);
    throw error;
  }
};
