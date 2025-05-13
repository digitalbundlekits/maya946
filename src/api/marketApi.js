import axios from 'axios';

export const fetchAllMarkets = () => {
  return axios.get('https://bhoom.miramatka.com/api/api.php');
};
