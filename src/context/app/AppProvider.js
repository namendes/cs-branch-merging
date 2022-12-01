import React, { useEffect, useReducer } from "react";
import ContentstackUIExtension from "@contentstack/ui-extensions-sdk";
import initialState from "./InitialState";
import { reducer } from "./AppReducer";


const AppContext = React.createContext();

const AppProvider = ({ children }) => {
    const [app, dispatch] = useReducer(reducer, { ...initialState });


    useEffect(() => {

        async function fetchData() {

            ContentstackUIExtension.init().then((extension) => {

                // extension.window.updateHeight();
                dispatch({ type: "SET_EXTENSION", payload: { uiExt: extension, config: extension.config } });
            }, error => {
                dispatch({
                    type: "SET_EXTENSION", payload: {
                        uiExt: {
                            entry: {
                            }
                        }, config:
                        {
                           
                        }
                    }
                });
            });

        }
        fetchData();

    }, []);

    return (
        <AppContext.Provider
            value={{
                app,
                dispatch,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppProvider };