const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api/v1' 
  : 'https://mscaterers-server.onrender.com/api/v1'; // I'm assuming the server URL

export default API_URL;
