import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchFirecrawlData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/firecrawl`);
    return response.data;
  } catch (error) {
    console.error('Error fetching firecrawl data:', error);
    throw error;
  }
};
