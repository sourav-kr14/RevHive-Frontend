import axios from "axios";

export const callAI = async (data) => {
  try {
    const res = await axios.post("http://localhost:8080/api/ai", data);
    return res;
  } catch (err) {
    console.error("AI error:", err);
    throw err;
  }
};
