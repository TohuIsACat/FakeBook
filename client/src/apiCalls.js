import axios from "axios";
// function of login
export const loginCall = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post("auth/login", userCredential);
    dispatch({ type: "LOGIN_SUCESS", payload: res.data });
    localStorage.setItem("currentUser", JSON.stringify(res.data));
  } catch (e) {
    dispatch({ type: "LOGIN_FAILURE", payload: e });
  }
};
