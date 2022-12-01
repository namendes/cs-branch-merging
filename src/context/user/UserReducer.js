import initialState from "./InitialState";

export const reducer = (state, action) => {
  switch (action.type) {
    case "INIT": {
      return initialState;
    }
    case "SIGN_IN" :{
      console.log("sign ien", action)
      return {
        csUser: action.payload.user,
        firstName:action.payload.user.first_name,
        authToken: action.payload.user.authtoken,
        authenticated:true,
      }
    }
    case "SIGN_OUT" :{
      console.log("sign out")
      return {...initialState};
    }
    case "CHANGE_NAME" :{
      console.log("CHANGE name", action)
      return {...state, username:action.payload.username};
    }
    case "CHECKING":{
      return {...initialState, checked:false};
    }
    case "LOAD_ERROR": {
      return {...initialState};
    }
    default:
      throw new Error();
  }
};