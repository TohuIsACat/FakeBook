export const loginStart = (userCredentials) => ({
  type: "LOGIN_START",
});

export const loginSucess = (currentUser) => ({
  type: "LOGIN_SUCESS",
  payload: currentUser,
});

export const loginFailure = (error) => ({
  type: "LOGIN_FAILURE",
  payload: error,
});

export const Follow = (userID) => ({
  type: "FOLLOW",
  payload: userID,
});

export const Unfollow = (userID) => ({
  type: "UNFOLLOW",
  payload: userID,
});

export const EditProfileImg = (fileName) => ({
  type: "EDITPROFILEIMG",
  payload: fileName,
});
