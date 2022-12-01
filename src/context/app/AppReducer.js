import initialState from "./InitialState";

export const reducer = (state, action) => {
  switch (action.type) {
    case "INIT": {
      return initialState;
    }
    case "SET_EXTENSION" :{
      console.log("SET EXTENSION: ", action.payload.config, action.payload.uiExt);
      const result = {
        uiExt: action.payload.uiExt,
        config: action.payload.config,
        initialValue: action.payload.config
      };
      console.log(result)
      return result;
    }
    case "LOAD_ERROR": {
      return {...initialState};
    }
    default:
      throw new Error();
  }
};