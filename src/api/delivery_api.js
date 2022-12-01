import _ from 'lodash';


export default {
    //https://eu-cdn.contentstack.com/v3/content_types/segments/entries/?&include_owner=true&environment=development
    getEntries(contentType, stack, include_owner = false) {
        var i;
        return new Promise(function (resolve, reject) {
            var header = {
                // Authorization: "Bearer ".concat(token)
                api_key:stack.apiKey,
                access_token:stack.deliveryToken
            };
            var url = `https://eu-cdn.contentstack.com/v3/content_types/${contentType}/entries/?&include_owner=${include_owner}&environment=${stack.environment}`
            // var url = "https://api." + COMMERCETOOLS_DOMAIN + "/" + COMMERCETOOLS_PROJECT_KEY
            //     + "/product-projections?"
            //     + "where=categories(id%3D%22" + catId + "%22)"
            //     + "&staged=true"
            //     + "&limit=" + limit
            
            fetch(url, {
                method: "GET",
                headers: header
            }).then(function (e) {
                // console.log(e.status)
                return i = e.status, e.json()
            }).then(function (e) {
                throw 200 === i && resolve(e), Error("Failed to fetch resource")
            }).catch(function (e) {
                reject(e)
            })
        })
    },
//   /**
//    *
//    * fetches all the entries from specific content-type
//    * @param {* content-type uid} contentTypeUid
//    * @param {* reference field name} referenceFieldPath
//    *
//    */
//   getEntry(contentTypeUid, referenceFieldPath) {
//     return new Promise((resolve, reject) => {
//       const query = Stack.ContentType(contentTypeUid).Query()
//       if (referenceFieldPath) query.includeReference(referenceFieldPath)
//       query
//         .includeOwner()
//         .toJSON()
//         .find()
//         .then(
//           (result) => {
//             result[0][0].contentType = contentTypeUid;
//             // console.log(result)
//             resolve(result)
//           },
//           (error) => {
//             reject(error)
//           }
//         )
//     })
//   },

//   /**
//    *fetches specific entry from a content-type
//    *
//    * @param {* content-type uid} contentTypeUid
//    * @param {* url for entry to be fetched} entryUrl
//    * @param {* reference field name} referenceFieldPath
//    * @returns
//    */
//   getEntryByUrl(contentTypeUid, entryUrl, referenceFieldPath) {
//     return new Promise((resolve, reject) => {
//       const blogQuery = Stack.ContentType(contentTypeUid).Query()
//       if (referenceFieldPath) blogQuery.includeReference(referenceFieldPath)
//       blogQuery.includeOwner().toJSON()
//       const data = blogQuery.where("url", `${entryUrl}`).find()
//       data.then(
//         (result) => {
          
//           if(result[0].length > 0){ result[0][0].contentType = contentTypeUid;}
          
//           resolve(result[0])
//         },
//         (error) => {
//           reject(error)
//         }
//       )
//     })
//   },
//     /**
//    *fetches specific entry from a content-type
//    *
//    * @param {* content-type uid} contentTypeUid
//    * @param {* url for entry to be fetched} entryUrl
//    * @param {* reference field name} referenceFieldPath
//    * @returns
//    */
//    getEntriesByType(contentTypeUid, referenceFieldPath) {
//     return new Promise((resolve, reject) => {
//       const query = Stack.ContentType(contentTypeUid).Query()
//       if (referenceFieldPath) query.includeReference(referenceFieldPath)
//       query.includeOwner().toJSON()
//       const data = query.find()
//       data.then(
//         (result) => {
          
//           // if(result[0].length > 0){
//           //   result[0][0].contentType = contentTypeUid;
//           // }
          
//           resolve(result)
//         },
//         (error) => {
//           reject(error)
//         }
//       )
//     })
//   },
//   getPageTemplateByCommerceId(contentTypeUid, commerceId,referenceFieldPath ) {
//     var i;
//     return new Promise(function (resolve, reject) {
//       var header = {
//         api_key: process.env.REACT_APP_APIKEY,
//         access_token: process.env.REACT_APP_DELIVERY_TOKEN
//       };
//       let refs = null;
//       if(referenceFieldPath){
//           refs = _.map(referenceFieldPath, (val) =>{
//             return "&include[]=" + val;
//           }).join('&');
//       }
//       // console.log(refs)
//       var url = process.env.REACT_APP_ENDPOINT + `content_types/${contentTypeUid}/entries?environment=${process.env.REACT_APP_ENVIRONMENT}&query=`
//         .concat(`{ "associated_categories.id": { "$in": [ "${commerceId}" ] } }`)
//         .concat(refs)
//         // .concat(`&include[]=${referenceFieldPath}`)
//       // console.log(url)
//       fetch(url, {
//         method: "GET",
//         headers: header
//       }).then(function (e) {
//         return i = e.status, e.json()
//       }).then(function (e) {
//         throw 200 === i && resolve(e), Error("Failed to fetch resource")
//       }).catch(function (e) {
//         reject(e)
//       })
//     })
//   },
  // getEntryByCommerceId(contentTypeUid, commerceId, referenceFieldPath) {
  //   return new Promise((resolve, reject) => {

  //     const query = Stack.ContentType(contentTypeUid).Query()

  //     if (referenceFieldPath) query.includeReference(referenceFieldPath) 

  //     // query.includeOwner().toJSON()

  //     const data = query.where("associated_categories.id" , `{'$in': ['${commerceId}']}`).find();

  //     data.then((result) => {
  //       resolve(result[0])
  //     },
  //       (error) => {
  //         reject(error)
  //       }
  //     )
  //   })
  // },
}
