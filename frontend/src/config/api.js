// ไฟล์กลางสำหรับเก็บ API URL
// เปลี่ยนแค่ที่นี่ที่เดียว ทุกไฟล์จะอัพเดตตาม

const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'https://velora-x8m0.onrender.com';

export default API_URL;
