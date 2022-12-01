import _ from 'lodash';
import React, { Fragment, useState, useLayoutEffect, useRef, useEffect, useContext } from "react";
import { ArrowsRightLeftIcon, CheckIcon, ExclamationTriangleIcon, ArrowPathIcon, XMarkIcon, Cog8ToothIcon, XCircleIcon, MinusCircleIcon, PlusCircleIcon, QuestionMarkCircleIcon } from '@heroicons/react/20/solid'
import { Dialog, Transition } from '@headlessui/react'

import cma from "../api/management_api";
import { AppContext } from "../context";
import ComboBox from "./ComboBox";

const STATUS = {
  UNKNOWN: "UNKNOWN", //QuestionMarkCircleIcon
  UNCHANGED: "UNCHANGED", //CheckCircleIcon
  CHANGED: "CHANGED", //ExclamationTriangleIcon / ExclamationCircleIcon
  ADDED: "ADDED", //PlusCircleIcon
  REMOVED: "REMOVED" // MinusCircleIcon / XCircleIcon
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function Home({ }) {
  const { app } = useContext(AppContext);
  const checkbox = useRef()
  const [checked, setChecked] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)

  const [sourceTypes, setSourceTypes] = useState([])
  const [destinationTypes, setDestinationTypes] = useState([])

  const [combinedTypes, setCombinedTypes] = useState([])

  const [branches, setBranches] = useState([])
  const [sourceBranch, setSourceBranch] = useState(null)
  const [destinationBranch, setDestinationBranch] = useState(null)
  const [selectedTypes, setSelectedTypes] = useState([])
  const [loading, setLoading] = useState(false)
  const [merging, setMerging] = useState(false)

  const [dialogOpen, setDialogOpen] = useState(false)
  const cancelButtonRef = useRef(null)

  useLayoutEffect(() => {
    const isIndeterminate = selectedTypes.length > 0 && selectedTypes.length < combinedTypes.length
    setChecked(selectedTypes.length === combinedTypes.length && combinedTypes.length > 0)
    setIndeterminate(isIndeterminate)
    checkbox.current.indeterminate = isIndeterminate
  }, [selectedTypes])

  function toggleAll() {
    setSelectedTypes(checked || indeterminate ? [] : combinedTypes)
    setChecked(!checked && !indeterminate)
    setIndeterminate(false)
  }

  useEffect(() => {
    const fetchData = async () => {
      const resultBranches = await cma.getAllBranches(app.config.api_key, app.config.management_token, app.config.endpoint);
      setBranches(resultBranches.branches)

      setLoading(false);
    }
    if (app.uiExt && app.config) {
      fetchData();
      if (app.uiExt.window) {
        app.uiExt.window.enableAutoResizing();
      }
    }
  }, [app]);

  const fetchSourceTypes = async (branch) => {
    const resultTypes = await cma.getAllContentTypes(app.config.api_key, app.config.management_token, app.config.endpoint, branch);
    setSourceTypes(resultTypes.content_types)
  }

  const fetchDestinationTypes = async (branch) => {
    const resultTypes = await cma.getAllContentTypes(app.config.api_key, app.config.management_token, app.config.endpoint, branch);
    setDestinationTypes(resultTypes.content_types);
    return resultTypes.content_types;
  }

  const updateSourceBranch = async (value) => {
    setSourceBranch(value);
    const types = await fetchSourceTypes(value);
    combineBranches(types, null);
  }

  const updateDestinationBranch = async (value) => {
    setDestinationBranch(value);
    const types = await fetchDestinationTypes(value);
    combineBranches(null, types);
  }

  const onRefreshDestination = async () => {
    const types = await fetchDestinationTypes(destinationBranch);
    combineBranches(null, types);
  }

  const combineBranches = (source, destination) => {
    let sb = source;
    let db = destination;
    let combined = [];

    if (!sb && sourceTypes) {
      sb = sourceTypes
    }
    if (!db && destinationTypes) {
      db = destinationTypes;
    }

    if (sb && db) {
      var m = _.union(sb, db);
      combined = _.uniqBy(m, 'uid');
    }
    let compared = [];

    _.forEach(combined, function (value) {
      let src = _.find(sb, ['uid', value.uid]);
      let dest = _.find(db, ['uid', value.uid]);

      let current = {};

      if (src && !_.isEqual(src, {})) {
        current = {
          title: src.title,
          uid: src.uid,
          srcVersion: src._version,
          status: STATUS.ADDED,
          src: src
        }
        if (dest && !_.isEqual(dest, {})) {
          current.dest = dest;
          current.destVersion = dest._version;
          const s = _.omit(src, ['_version', 'created_at', 'DEFAULT_ACL', 'updated_at'])
          const d = _.omit(dest, ['_version', 'created_at', 'DEFAULT_ACL', 'updated_at']);
          const cp = _.isEqual(s, d);

          current.status = cp ? STATUS.UNCHANGED : STATUS.CHANGED;
        }
      } else {
        if (dest && !_.isEqual(dest, {})) {
          current = {
            title: dest.title,
            uid: dest.uid,
            destVersion: dest._version,
            status: STATUS.REMOVED,
            dest: src
          }
        }
      }
      if (current.status !== STATUS.UNCHANGED) {
        compared.push(current);
      }
    });

    compared = _.orderBy(compared, ['status', 'title'], ['asc', 'asc']);
    setCombinedTypes(compared);
    // console.log(compared);
  }
  const onRemoveBranches = () => {
    setSourceBranch(null);
    setDestinationBranch(null);
    setCombinedTypes(null);
  }

  const onMerge = async () => {
    setMerging(true);

    _.forEach(selectedTypes, async (type) => {
      if (type.status === STATUS.ADDED) {
        const ra = await cma.createContentType(app.config.api_key, app.config.management_token, app.config.endpoint, type.src, destinationBranch);
      } else if (type.status === STATUS.REMOVED) {
        const rr = await cma.deleteContentType(app.config.api_key, app.config.management_token, app.config.endpoint, type.uid, destinationBranch);
      } else if (type.status === STATUS.CHANGED) {
        const rc = await cma.updateContentType(app.config.api_key, app.config.management_token, app.config.endpoint, type.uid, type.src, destinationBranch);
      }
    })
    setDialogOpen(true);
    // onRemoveBranches();
    setMerging(false);
  }

  const onCloseDialog = () => {
    setDialogOpen(false);
    onRemoveBranches();
  }

  const getStatusIcon = (status) => {
    if (status === STATUS.UNCHANGED) {
      return <CheckIcon className="h-5 w-5 text-indigo-700" aria-hidden="true" />
    } else if (status === STATUS.CHANGED) {
      return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" aria-hidden="true" />
    } else if (status === STATUS.ADDED) {
      return <PlusCircleIcon className="h-5 w-5 text-green-700" aria-hidden="true" />
    } else if (status === STATUS.REMOVED) {
      return <MinusCircleIcon className="h-5 w-5 text-red-700" aria-hidden="true" />
    } else { //status === STATUS.UNKNOWN
      return <QuestionMarkCircleIcon className="h-5 w-5 text-indigo-700" aria-hidden="true" />
    }
  }

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8" style={{minHeight: 300 + 53 *combinedTypes?.length + "px"}}>
        <div className=" sm:items-center">
          <ol role="list" className="divide-y divide-gray-300  md:flex md:divide-y-0">
            <li key="1" className="relative md:flex md:flex-1">
              <span className="flex items-center px-6 py-4 text-sm font-medium">
                {sourceBranch === null ?
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-indigo-600 group-hover:border-gray-400">
                    <span className="text-gray-500 group-hover:text-gray-900">1</span>
                  </span>
                  :
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 group-hover:bg-indigo-800">
                    <CheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </span>
                }
              </span>
              <ComboBox label="Source branch" branches={branches} disabled={destinationBranch !== null} selectedBranch={sourceBranch} updateBranch={updateSourceBranch} />
              <a href="#" onClick={onRemoveBranches}
                className={classNames(
                  destinationBranch === null ? "hidden"
                    : "block",
                  ""
                  // "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 "
                )}
              >
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full hover:bg-indigo-600 ">
                  <XMarkIcon className="h-6 w-6 text-indigo-600 hover:text-white " aria-hidden="true" />
                </span>
              </a>
              <>
                {/* Arrow separator for lg screens and up */}
                <div className="absolute top-0 right-0 hidden h-full w-5 md:block" aria-hidden="true">
                  <svg
                    className="h-full w-full text-gray-300"
                    viewBox="0 0 22 80"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 -2L20 40L0 82"
                      vectorEffect="non-scaling-stroke"
                      stroke="currentcolor"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </>
            </li>
            <li key="2" className="relative md:flex md:flex-1">
              <span className="flex items-center px-6 py-4 text-sm font-medium">
                {destinationBranch === null ?
                  <span
                    className={classNames(
                      sourceBranch === null ? "border-gray-400"
                        : "border-indigo-600",
                      "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 "
                    )}
                  //  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 group-hover:border-gray-400"
                  >
                    <span className="text-gray-500 group-hover:text-gray-900">2</span>
                  </span>
                  :
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 group-hover:bg-indigo-800">
                    <CheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </span>
                }
              </span>
              <ComboBox label="Destination branch" branches={branches} disabled={sourceBranch === null} selectedBranch={destinationBranch} updateBranch={updateDestinationBranch} />
              <a href="#" onClick={onRefreshDestination}
                className={classNames(
                  destinationBranch === null ? "hidden"
                    : "block",
                  ""
                  // "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 "
                )}
              >
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full hover:bg-indigo-600 ">
                  <ArrowPathIcon className="h-6 w-6 text-indigo-600 hover:text-white " aria-hidden="true" />
                </span>
              </a>
              <>
                {/* Arrow separator for lg screens and up */}
                <div className="absolute top-0 right-0 hidden h-full w-5 md:block" aria-hidden="true">
                  <svg
                    className="h-full w-full text-gray-300"
                    viewBox="0 0 22 80"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 -2L20 40L0 82"
                      vectorEffect="non-scaling-stroke"
                      stroke="currentcolor"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </>
            </li>
            <li key="3" className="relative md:flex md:flex-1">
              <div className="flex items-center px-6 py-2 text-sm font-medium" >
                <span className="flex items-center px-6 py-4 text-sm font-medium">
                  {destinationBranch === null ?
                    <span
                      className={classNames(
                        sourceBranch === null ? "border-gray-400"
                          : "border-indigo-600",
                        "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 "
                      )}
                    //  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 group-hover:border-gray-400"
                    >
                      <span className="text-gray-500 group-hover:text-gray-900">3</span>
                    </span>
                    :
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white border-2 border-indigo-800">
                      <ArrowsRightLeftIcon className="h-6 w-6 text-indigo-600" />
                    </span>
                  }
                </span>

                <button disabled={sourceBranch === null || destinationBranch === null || merging || selectedTypes.length === 0}
                  onClick={onMerge}
                  className={classNames(
                    sourceBranch === null || destinationBranch === null || merging || selectedTypes.length === 0 ? "text-gray-200 bg-white"
                      : "text-white bg-indigo-600 border-transparent hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer",
                    "ml-4 w-full flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium"
                  )}>Merge</button>
              </div>
            </li>

          </ol>
        </div>
        <div className="flex-1 w-full -my-1  overflow-x-auto">
          <div className="inline-block min-w-full py-2 align-middle px-4">
            <div className="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              {/* {selectedTypes.length > 0 && (
              <div className="absolute top-0 left-12 flex h-12 items-center space-x-3 bg-gray-50 sm:left-16">
                <button
                  type="button"
                  className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Bulk edit
                  </button>
                <button
                  type="button"
                  className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Delete all
                  </button>
              </div>
            )} */}
              <table className="min-w-full table-fixed divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
                      <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                        ref={checkbox}
                        checked={checked}
                        onChange={toggleAll}
                      />
                    </th>
                    <th scope="col" className="min-w-[6rem]  text-left text-sm font-semibold text-gray-900">
                      Title
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      UID
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Source Version
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Destination Version
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {combinedTypes && combinedTypes.map((type) => (

                    <tr key={type.title} className={selectedTypes.includes(type) ? 'bg-gray-50' : undefined}>
                      <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                        {selectedTypes.includes(type) && (
                          <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                        )}
                        {type.status != STATUS.UNKNOWN && type.status != STATUS.UNCHANGED ?
                          <input
                            type="checkbox"
                            className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                            value={type.uid}
                            checked={selectedTypes.includes(type)}
                            onChange={(e) => {
                              // console.log( e.target.checked
                              //   ? [...selectedTypes, type]
                              //   : selectedTypes.filter((p) => p !== type))
                              // console.log([...selectedTypes, type])
                              setSelectedTypes(
                                e.target.checked
                                  ? [...selectedTypes, type]
                                  : selectedTypes.filter((p) => p !== type)
                              )
                            }
                            }
                          /> : <></>}
                      </td>
                      <td
                        className={classNames(
                          'whitespace-nowrap py-4 pr-3 text-sm font-medium',
                          selectedTypes.includes(type) ? 'text-indigo-600' : 'text-gray-900',
                        )}
                      >
                        {type.title}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{type.uid}</td>
                      <td className="whitespace-nowrap text-center px-3 py-4 text-sm text-gray-500">{type.srcVersion}</td>
                      <td className="whitespace-nowrap text-center px-3 py-4 text-sm text-gray-500">{type.destVersion}</td>
                      <td
                        className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                      >{getStatusIcon(type.status)}</td>
                      <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a href="#" className="text-indigo-600 hover:text-indigo-900">
                          Compare<span className="sr-only">, {type.title}</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Transition.Root show={dialogOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setDialogOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    {merging ?
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                        <Cog8ToothIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                      </div>
                      :
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                      </div>
                    }
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        Merging successful
                    </Dialog.Title>
                      {/* <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius aliquam laudantium explicabo
                          pariatur iste dolorem animi vitae error totam. At sapiente aliquam accusamus facere veritatis.
                      </p>
                      </div> */}
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-1 sm:gap-3">
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                      onClick={() => onCloseDialog()}
                      ref={cancelButtonRef}
                    >
                      Close
                  </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default Home;