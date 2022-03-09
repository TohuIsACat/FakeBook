const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        currentUser: null,
        isFetching: true,
        error: false,
      };
    case "LOGIN_SUCESS":
      return {
        currentUser: action.payload,
        isFetching: false,
        error: false,
      };
    case "LOGIN_FAILURE":
      return {
        currentUser: null,
        isFetching: false,
        error: action.payload,
      };
    case "FOLLOW":
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          followings: [...state.currentUser.followings, action.payload],
        },
      };
    case "UNFOLLOW":
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          followings: state.currentUser.followings.filter(
            (following) => following !== action.payload
          ),
        },
      };
    case "EDITPROFILEIMG":
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          profilePicture: action.payload,
        },
      };
    default:
      return state;
  }
};

export default AuthReducer;
