import buildUrl from 'build-url';
// const contentstack = require('@contentstack/management');

// const apiKey = process.env.REACT_APP_API_KEY;
// const authToken = process.env.REACT_APP_MANAGEMENT_TOKEN;
// const cma_base_url = process.env.REACT_APP_CMA_BASE_URL;

// const contentstackClient = contentstack.client({ endpoint: 'https://api.contentstack.io/v3' })
// const stack = contentstackClient.stack({ api_key: apiKey, management_token: authToken });

export default {
    // getAllReleases(api_key, management_token, endpoint) {
    //     console.log("getAllReleases params", api_key, management_token, endpoint)
    //     const contentstackClient = contentstack.client({ endpoint })
    //     const stack = contentstackClient.stack({ api_key, management_token });

    //     return new Promise((resolve, reject) => {
    //         stack.release().query().find()
    //             .then((result) => {
    //                 resolve(result);
    //             },
    //                 (error) => {
    //                     reject(error);
    //                 },
    //             );
    //     });
    // },
    getAllContentTypes(api_key, management_token, endpoint, branch) {
        // console.log("getAllCotnentTypes params", api_key, management_token, endpoint)
        const url = buildUrl(endpoint.concat("/content_types"), {
            // path: contentTypeId.concat("/entries/"),
            queryParams: {
                include_count: false,
                include_global_field_schema: true,
                include_branch: false
            }
        });
        // const contentstackClient = contentstack.client({ endpoint })
        // const stack = contentstackClient.stack({ api_key, management_token});
        var a;
        return new Promise(function (resolve, reject) {
            var header = {
                "Content-Type": "application/json",
                // "authtoken": management_token,
                "authorization": management_token,
                "api_key": api_key,
                "Access-Control-Allow-Origin": null,
                "branch": branch.uid
            };

            fetch(url, {
                method: "GET",
                headers: header,

            }).then(function (e) {
                return a = e.status, e.json()
            }).then(function (e) {
                throw 200 === a && resolve(e), Error("Failed to fetch resource")
            }).catch(function (e) {
                reject(e)
            })
        })
    },

    getAllBranches(api_key, management_token, endpoint) {
        // console.log("getAllCotnentTypes params", api_key, management_token, endpoint)
        const url = buildUrl(endpoint.concat("/stacks"), {
             path: "/branches/",
            queryParams: {
                include_count: false,
                include_global_field_schema: true,
                include_branch: false
            }
        });
        // const contentstackClient = contentstack.client({ endpoint })
        // const stack = contentstackClient.stack({ api_key, management_token});
        var a;
        return new Promise(function (resolve, reject) {
            var header = {
                "Content-Type": "application/json",
                // "authtoken": management_token,
                "authorization": management_token,
                "api_key": api_key,
                "Access-Control-Allow-Origin": null
            };

            fetch(url, {
                method: "GET",
                headers: header,

            }).then(function (e) {
                return a = e.status, e.json()
            }).then(function (e) {
                throw 200 === a && resolve(e), Error("Failed to fetch resource")
            }).catch(function (e) {
                reject(e)
            })
        })
    },
    //https://api.contentstack.io/v3/content_types?include_count=false&include_global_field_schema=true&include_branch=false

    deleteContentType(api_key, management_token, endpoint, contentTypeUid, branch) {

        // https://{{base_url}}/v3/content_types/{{content_type_uid}}
        const url = buildUrl(endpoint.concat("/content_types"), {
            path: contentTypeUid,
        });
        var a;
        return new Promise(function (resolve, reject) {
            var header = {
                "Content-Type": "application/json",
                "authorization": management_token,
                "api_key": api_key,
                "Access-Control-Allow-Origin": null,
                "branch": branch.uid
            };

            fetch(url, {
                method: "DELETE",
                headers: header,

            }).then(function (e) {
                return a = e.status, e.json()
            }).then(function (e) {
                throw 200 === a && resolve(e), Error("Failed to fetch resource")
            }).catch(function (e) {
                reject(e)
            })
        })
    },
    createContentType(api_key, management_token, endpoint,  schema, branch) {

        // https://{{base_url}}/v3/content_types/{{content_type_uid}}
        const url = buildUrl(endpoint.concat("/content_types"), {
            // path: contentTypeUid,
        });
        var a;
        return new Promise(function (resolve, reject) {
            var header = {
                "Content-Type": "application/json",
                "authorization": management_token,
                "api_key": api_key,
                "Access-Control-Allow-Origin": null,
                "branch": branch.uid
            };

            fetch(url, {
                method: "POST",
                headers: header,
                body: JSON.stringify({"content_type":schema})
            }).then(function (e) {
                return a = e.status, e.json()
            }).then(function (e) {
                throw 200 === a && resolve(e), Error("Failed to fetch resource")
            }).catch(function (e) {
                reject(e)
            })
        })
    },
    updateContentType(api_key, management_token, endpoint, contentTypeUid, schema, branch) {

        // https://{{base_url}}/v3/content_types/{{content_type_uid}}
        const url = buildUrl(endpoint.concat("/content_types"), {
            path: contentTypeUid,
        });
        var a;
        return new Promise(function (resolve, reject) {
            var header = {
                "Content-Type": "application/json",
                "authorization": management_token,
                "api_key": api_key,
                "Access-Control-Allow-Origin": null,
                "branch": branch.uid
            };

            fetch(url, {
                method: "PUT",
                headers: header,
                body: JSON.stringify({"content_type":schema})
            }).then(function (e) {
                return a = e.status, e.json()
            }).then(function (e) {
                throw 200 === a && resolve(e), Error("Failed to fetch resource")
            }).catch(function (e) {
                reject(e)
            })
        })
    },
    getContentType(endpoint, authToken, apiKey, contentTypeUid, entryId) {

        // https://{{base_url}}/v3/content_types/{{content_type_uid}}
        const url = buildUrl(endpoint.concat("/content_types"), {
            path: contentTypeUid,
        });
        var a;
        return new Promise(function (resolve, reject) {
            var header = {
                "Content-Type": "application/json",
                "authtoken": authToken,
                "api_key": apiKey,
                "Access-Control-Allow-Origin": null
            };

            fetch(url, {
                method: "GET",
                headers: header,

            }).then(function (e) {
                return a = e.status, e.json()
            }).then(function (e) {
                throw 200 === a && resolve(e), Error("Failed to fetch resource")
            }).catch(function (e) {
                reject(e)
            })
        })
    },
    // getEntryByGlobalId(authToken, apiKey, contentTypeId, globalId) {

    //     // https://{{base_url}}/v3/content_types/{{content_type_uid}}/entries?query={"title": "rtest"}

    //     const query = {
    //         "global_id": globalId
    //     }
    //     const url = buildUrl(cma_base_url.concat("/content_types"), {
    //         path: contentTypeId.concat("/entries/"),
    //         queryParams: {
    //             query: JSON.stringify(query),
    //             include_workflow: true

    //         }
    //     });
    //     var a;
    //     return new Promise(function (resolve, reject) {
    //         var header = {
    //             "Content-Type": "application/json",
    //             "authtoken": authToken,
    //             "api_key": apiKey,
    //             "Access-Control-Allow-Origin": null
    //         };

    //         fetch(url, {
    //             method: "GET",
    //             headers: header,
    //         }).then(function (e) {
    //             //   console.log(e.json())
    //             return a = e.status, e.json()
    //         }).then(function (e) {
    //             throw 200 === a && resolve(e), Error("Failed to fetch resource")
    //         }).catch(function (e) {

    //             reject(e)
    //         })
    //     })
    //     return ""
    // },
    // getEntryQuery(contentTypeUid, entryId) {
    //     return new Promise((resolve, reject) => {
    //         // contentstackClient.stack({ api_key: apiKey, management_token: authToken})
    //         const authorsQ = stack.contentType('authors').entry()
    //             .query({ query: { uid: entryId } }).find().then(
    //                 (result) => {
    //                     resolve(result[0]);
    //                 },
    //                 (error) => {
    //                     reject(error);
    //                 },
    //             );

    //         // .fetch()
    //         // .then((contenttype) => {
    //         //     console.log(contenttype)
    //         // })
    //     });
    // },
    // getEntry(contentTypeUid, entryId) {
    //     return new Promise((resolve, reject) => {
    //         stack.contentType(contentTypeUid).entry(entryId)
    //             .fetch()
    //             .then((result) => {
    //                 resolve(result);
    //                 // console.log(result)
    //             },
    //                 (error) => {
    //                     reject(error);
    //                 },
    //             );

    //         // .fetch()
    //         // .then((contenttype) => {
    //         //     console.log(contenttype)
    //         // })
    //     });
    // },
    // // getEntryPAI( contentTypeUid, entryId) {
    // // return null;
    // //     const contentstackClient = contentstack.client({ endpoint: 'https://api.contentstack.io/v3' })
    // //     contentstackClient.stack({ api_key: apiKey, management_token: authToken})

    // //     //  https://{{base_url}}/v3/content_types/{{content_type_uid}}/entries/{{entry_uid}}
    // //     const url = buildUrl(cma_base_url.concat("/content_types"), {
    // //         path: contentTypeUid.concat("/entries/", entryId),
    // //         queryParams: {
    // //             include_workflow: true
    // //         }
    // //     });
    // //     var a;
    // //     return new Promise(function (resolve, reject) {
    // //         var header = {
    // //             "Content-Type": "application/json",
    // //             "authtoken": authToken,
    // //             "api_key": apiKey,
    // //             "Access-Control-Allow-Origin": null
    // //         };

    // //         fetch(url, {
    // //             method: "GET",
    // //             headers: header,

    // //         }).then(function (e) {
    // //             return a = e.status, e.json()
    // //         }).then(function (e) {
    // //             throw 200 === a && resolve(e), Error("Failed to fetch resource")
    // //         }).catch(function (e) {
    // //             reject(e)
    // //         })
    // //     })
    // // },
    // createEntry(contentTypeUid, payload) {
    //     return new Promise((resolve, reject) => {
    //         stack.contentType(contentTypeUid).entry().create({ entry: payload })
    //             //.fetch()
    //             .then((result) => {
    //                 resolve(result);
    //             }, 
    //                 (error) => {
    //                     reject(error);
    //                 },
    //             );
    //     });
    // },
    // async createCopyFromPayload(contentTypeUid, payload) {
    //     const newEntry = this.cleanEntryForCopy(payload);
    //     return await this.createEntry(contentTypeUid, newEntry);
    // },
    // async createCopyFromUid(contentTypeUid, uidToCopy) {
    //     const entryToCopy = await this.getEntry(contentTypeUid, uidToCopy);
    //     return await this.createCopyFromPayload(entryToCopy.content_type_uid, entryToCopy);
    // },
    // cleanEntryForCopy(entry) {
    //     const newEntry = this.createObjectCopyWithoutRef(entry);

    //     const randomNumberToAvoidUniqueTitleConstraint = Math.floor(Math.random() * 10000) + 1; // ugly hack
    //     newEntry.title += " - Copy " + randomNumberToAvoidUniqueTitleConstraint;
    //     newEntry.uid = null;

    //     // for each object property
    //     Object.keys(newEntry).forEach(function (key, index) {
    //         // if property is an object with a "uid" property
    //         if (typeof newEntry[key] === 'object' &&
    //             !Array.isArray(newEntry[key]) &&
    //             newEntry[key] !== null &&
    //             Object.keys(newEntry[key]).includes("uid")) {
    //             // change the root object property to just the uid (ref to create)
    //             newEntry[key] = newEntry[key].uid;
    //         }
    //     });

    //     return newEntry;
    // },
    // createObjectCopyWithoutRef(object) { // should be moved out of CMA
    //     return JSON.parse(JSON.stringify(object)); // small hack to create new object without ref/pointer
    // },
    // updateEntry(authToken, apiKey, contentTypeUid, destEntryId, entry) {

    //     const url = buildUrl(cma_base_url.concat("/content_types"), {
    //         path: contentTypeUid.concat("/entries/", destEntryId),
    //         queryParams: {
    //             locale: ''
    //         }
    //     });
    //     var a;
    //     return new Promise(function (resolve, reject) {
    //         var header = {
    //             "Content-Type": "application/json",
    //             "authtoken": authToken,
    //             "api_key": apiKey,
    //             "Access-Control-Allow-Origin": null
    //         };
    //         const data = {
    //             entry: entry
    //         }
    //         fetch(url, {
    //             method: "PUT",
    //             headers: header,
    //             body: JSON.stringify(data)
    //         }).then(function (e) {
    //             //  console.log(e)
    //             return a = e.status, e.json()
    //         }).then(function (e) {
    //             throw 200 === a && resolve(e), Error("Failed to fetch resource")
    //         }).catch(function (e) {
    //             reject(e)
    //         })
    //     })
    // },
    // getWorkflow(authToken, apiKey, workflowUid) {

    //     // https://{{base_url}}/v3/workflows/{{workflow_uid}}
    //     const url = buildUrl(cma_base_url.concat("/workflows"), {
    //         path: workflowUid,
    //     });
    //     var a;
    //     return new Promise(function (resolve, reject) {
    //         var header = {
    //             "Content-Type": "application/json",
    //             "authtoken": authToken,
    //             "api_key": apiKey,
    //             "Access-Control-Allow-Origin": null
    //         };

    //         fetch(url, {
    //             method: "GET",
    //             headers: header,

    //         }).then(function (e) {
    //             return a = e.status, e.json()
    //         }).then(function (e) {
    //             throw 200 === a && resolve(e), Error("Failed to fetch resource")
    //         }).catch(function (e) {
    //             reject(e)
    //         })
    //     })
    // },
    // setWorkflowForEntry(authToken, stackConfig, contentTypeUid, entryUid, workflow_stage_uid, comment, notify) {

    //     // //https://{{base_url}}/v3/content_types/{{content_type_uid}}/entries/{{entry_uid}}/workflow

    //     const url = buildUrl(cma_base_url.concat("/content_types"), {
    //         path: contentTypeUid.concat("/entries/", entryUid, "/workflow"),
    //     });
    //     var a;
    //     return new Promise(function (resolve, reject) {
    //         var header = {
    //             "Content-Type": "application/json",
    //             "authtoken": authToken,
    //             "api_key": stackConfig.uid,
    //             "Access-Control-Allow-Origin": null
    //         };
    //         const data = {
    //             "workflow": {
    //                 "workflow_stage": {
    //                     "comment": comment,
    //                     // "due_date": "Thu Dec 01 2018",
    //                     "notify": notify,
    //                     "uid": workflow_stage_uid,
    //                     "assigned_to": stackConfig.assigned_to,
    //                     "assigned_by_roles": stackConfig.assigned_by_roles
    //                 }
    //             }
    //         }

    //         fetch(url, {
    //             method: "POST",
    //             headers: header,
    //             body: JSON.stringify(data)
    //         }).then(function (e) {
    //             //  console.log(e)
    //             return a = e.status, e.json()
    //         }).then(function (e) {
    //             throw 200 === a && resolve(e), Error("Failed to fetch resource")
    //         }).catch(function (e) {
    //             reject(e)
    //         })
    //     })
    //     // return 'set';
    // },
    // getStacks(authToken, organization_uid) {
    //     const url = cma_base_url.concat("/stacks")
    //     var a;

    //     return new Promise(function (resolve, reject) {
    //         var header = {
    //             "Content-Type": "application/json",
    //             "authtoken": authToken,
    //             "organization_uid": organization_uid,
    //             "Access-Control-Allow-Origin": null
    //         };

    //         fetch(url, {
    //             method: "GET",
    //             headers: header,
    //         }).then(function (e) {
    //             //  console.log(e)
    //             return a = e.status, e.json()
    //         }).then(function (e) {
    //             throw 200 === a && resolve(e), Error("Failed to fetch resource")
    //         }).catch(function (e) {
    //             reject(e)
    //         })
    //     })
    // },
    // getToken() {
    //     const url = cma_base_url.concat("/user-session")
    //     var a;
    //     return new Promise(function (resolve, reject) {
    //         var header = {
    //             "Content-Type": "application/json",
    //             "Access-Control-Allow-Origin": null
    //         };
    //         const data = {
    //             user: {
    //                 email: email,
    //                 password: password,
    //                 tfa_token: tfa_token
    //             }
    //         }

    //         fetch(url, {
    //             method: "POST",
    //             headers: header,
    //             body: JSON.stringify(data)
    //         }).then(function (e) {
    //             //  console.log(e)
    //             return a = e.status, e.json()
    //         }).then(function (e) {
    //             throw 200 === a && resolve(e), Error("Failed to fetch resource")
    //         }).catch(function (e) {
    //             reject(e)
    //         })
    //     })
    // },

}
