import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchHeroData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/hero`);
    return response.data;
  } catch (error) {
    console.error('Error fetching hero data:', error);
    throw error;
  }
};
