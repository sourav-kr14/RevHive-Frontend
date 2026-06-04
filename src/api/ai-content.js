import axios from "axios";

export const callAI = async (data) => {
  console.log("CALL AI FIRED", data);

  const res = await axios.post("/api/ai", data);

  console.log("CALL AI RESPONSE", res.data);

  return res;
};