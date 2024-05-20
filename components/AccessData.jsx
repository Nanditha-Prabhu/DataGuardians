import { useState, useEffect } from "react";
import abi from "../contractJson/anonymize.json";
import { ethers } from "ethers";
import Memos from "./Memos";
import axios from "axios"; // Import axios for making HTTP requests
import { useAuth } from "../src/contexts/authContext/index";
import { getAuth } from "firebase/auth";
import { Navigate } from 'react-router-dom'

const baseUrl = "https://ariyal-ksp-datathon-backend.hf.space";

function AccessData() {

  const { userLoggedIn } = useAuth(); //Route protection
  const auth = getAuth();
  const user = auth.currentUser;
  let username = "";

  if (user !== null) {
    user.providerData.forEach((profile) => {
      username = profile.displayName;
    });
  }

  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });

  const [account, setAccount] = useState("Not connected");
  const [fileNames, setFileNames] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState("");
  // ColumnNames gives the list of column name avail to selected filename or collection
  const [columnNames, setColumnNames] = useState([]); // prev -> anonymizableKeys, Update -> columnNames
  // AnonymizedData contains data that received from backend after anonymizing the req data
  const [anonymizedData, setAnonymizedData] = useState([]);
  // list of columns that must be anonymized.
  const [anonymizedCols, setAnonymizedCols] = useState([]);

  useEffect(() => {
    const template = async () => {
      const contractAddres = "0xD6C7e6F67960261121c3d2388eeE9e785E916BC2";
      const contractABI = abi.abi;

      try {
        const { ethereum } = window;
        const account = await ethereum.request({
          method: "eth_requestAccounts",
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        setAccount(account);
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(
          contractAddres,
          contractABI,
          signer
        );
        console.log(contract);
        setState({ provider, signer, contract });

        // Fetch file names from Flask backend
        const response = await axios.get(`${baseUrl}/fileNames`);
        setFileNames(response.data);
      } catch (error) {
        alert("Create a metamask account");
        console.log(error);
      }
    };
    template();
  }, []);

  const handleColsChange = (e) => {
    // console.log(e)
    // Destructuring
    const { value, checked } = e.target;
    console.log(`${value} is ${checked}`);

    // Case 1 : The user checks the box
    if (checked) {
      if (!anonymizedCols.includes(value))
        setAnonymizedCols((cols) => [...cols, value]);
    }

    // Case 2  : The user unchecks the box
    else {
      const index = anonymizedCols.indexOf(value);
      if (index !== -1) {
        anonymizedCols.splice(index, 1);
        setAnonymizedCols(anonymizedCols);
      }
    }
  };

  const buyChai = async (event) => {
    event.preventDefault();
    const { contract } = state;
    const fileName = selectedFileName;
    // const name = document.querySelector("#file-name").value;

    console.log(anonymizedCols);
    //const amount = document.querySelector("#amount").value;
    const amount = { value: ethers.utils.parseEther("0.001") };
    const transaction = await contract.anonymize_columns(
      username,
      selectedFileName,
      anonymizedCols,
      amount
    );

    await transaction.wait();
    alert("Transaction is successful");

    // const anonymize_columns =
    //   document.querySelector("#anonymizable-data").value; // anonymizeColumns must be a list, it must contain list of columns to anonymize

    // Send file name and column name to backend
    const data = {
      file_name: fileName,
      column_name: columnNames,
      anonymize_columns: anonymizedCols,
    };
    console.log(data);

    try {
      const response = await fetch(`${baseUrl}/anonymize-data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log(response);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      console.log(responseData);
      alert(
        "Data anonymized successfully and stored in database. Please go to downloads section to download the anonymized data."
      );
      setAnonymizedData(responseData.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFileSelect = async (event) => {
    const selectedFile = event.target.value;
    setSelectedFileName(selectedFile);
    // Fetch anonymizable keys for the selected file from Flask backend
    const response = await axios.get(
      `${baseUrl}/columnNames?fileName=${selectedFile}`
    );
    setColumnNames(response.data);
  };

  const handleSearchChange = async (event) => {
    const search = event.target.value;
    if (search === "") {
      const data = {
        file_name: selectedFileName,
        column_name: columnNames,
        anonymize_columns: anonymizedCols,
      };

      try {
        const response = await fetch(`${baseUrl}/anonymize-data`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        console.log(response);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const responseData = await response.json();
        console.log(responseData);
        setAnonymizedData(responseData.data);
      } catch (error) {
        console.error("Error:", error);
      }
      return;
    }
    const data = {
      file_name: selectedFileName,
      column_name: columnNames,
      anonymize_columns: anonymizedCols,
      search_query: search,
      search_index: selectedFileName + "_index",
      limit: 50,
    };
    const response = await fetch(`${baseUrl}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const res_data = await response.json();
    console.log(res_data);
    setAnonymizedData(res_data["data"]);
  };
  return (
    <>
    {/* Route protection */}
    {!userLoggedIn && (<Navigate to={'/'} replace={true} />)}
    {/* UI code */}
      <div className="flex flex-col items-center">
        {/* Starts: Taking info from user, like what to display and which file to display */}
        <form
          className="border-4 m-7 p-7 bg-gray-700 text-white rounded-lg grid grid-cols-1 justify-center items-center w-96"
          onSubmit={buyChai}
        >
          <div className="font-semibold text-2xl">Access the Data</div>
          <div className="sm:col-span-3 mt-5">
            <label
              htmlFor="file-name"
              className="block text-sm text-white font-medium leading-6"
            >
              File name
            </label>
            <div>
              <select
                id="file-name"
                name="file-name"
                autoComplete="file-name"
                className="block px-3 py-2 place-content-stretch justify-items-stretch w-full rounded-md border-0  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                onChange={handleFileSelect}
              >
                <option key="">Select the file-name</option>
                {fileNames.map((fileName, index) => (
                  <option key={index}>{fileName}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="sm:col-span-3 my-5">
            <label
              htmlFor="anonymizable-data"
              className="block text-sm font-medium leading-6 text-white"
            >
              Data to be anonymized
            </label>
            <div className="mt-2 space-y-2">
              <div className="justify-between grid grid-cols-2 gap-4">
                {columnNames &&
                  columnNames.map((item, idx) => {
                    return (
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={item}
                          name="anonymizable-data"
                          value={item}
                          onChange={handleColsChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded base-1/2"
                        />
                        <label
                          htmlFor={item}
                          className="text-sm font-medium text-gray-900 dark:text-slate-200"
                        >
                          {item}
                        </label>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          <button
            className="group inline-block rounded bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-[2px] hover:text-gr focus:outline-none focus:ring active:text-opacity-75"
            href="#"
          >
            <span className="block rounded-sm bg-gray-700 px-8 py-3 text-sm font-medium group-hover:bg-transparent">
              Submit
            </span>
          </button>
        </form>
        {/* Ends: Taking info from user, like what to display and which file to display */}

        {/* Start: Here, the output from the server is displayed */}
        <div className=" mb-5 flex flex-shrink-0 items-center">
          <input
            placeholder="Search..."
            id="search"
            name="search"
            className="block px-3 py-2 place-content-stretch justify-items-stretch w-full rounded-md border-1  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:max-w-xs sm:text-sm sm:leading-6"
            onChange={handleSearchChange}
          />
        </div>
        <div className=" max-w-lg h-2/5 overflow-x-scroll rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="max-w-lg divide-y-2 divide-gray-200 bg-white text-sm dark:divide-gray-700 dark:bg-gray-900">
            <thead className="ltr:text-left rtl:text-right">
              <tr>
                {columnNames.map((keys, idx) => (
                  <th
                    key={idx}
                    className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200"
                  >
                    {keys}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {anonymizedData &&
                anonymizedData.map((data) => {
                  return (
                    <tr>
                      {columnNames.map((key) => {
                        return (
                          <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">
                            {data[key]}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        <Memos state={state} />
      </div>
    </>
  );
}

export default AccessData;
