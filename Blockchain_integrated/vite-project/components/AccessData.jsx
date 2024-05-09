import { useState, useEffect } from "react";
import abi from "../contractJson/chai.json";
import { ethers } from "ethers";
import Memos from "./Memos";
import axios from "axios"; // Import axios for making HTTP requests

function AccessData() {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });

  const [account, setAccount] = useState("Not connected");
  const [fileNames, setFileNames] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [columnNames, setColumnNames] = useState([]); // prev -> anonymizableKeys, Update -> columnNames
  const [anonymizedData, setAnonymizedData] = useState([]);

  useEffect(() => {
    const template = async () => {
      const contractAddres = "0x4A477A2a0012eC1274a736FB3921C6EA2eAD357c";
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
        const response = await axios.get("http://127.0.0.1:5000/fileNames");
        setFileNames(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    template();
  }, []);
  const buyChai = async (event) => {
    event.preventDefault();
    const { contract } = state;
    const name = document.querySelector("#file-name").value;
    const message = document.querySelector("#anonymizable-data").value;
    //const amount = document.querySelector("#amount").value;
    const amount = { value: ethers.utils.parseEther("0.001") };
    const transaction = await contract.anonymize_file(name, message, amount);
    await transaction.wait();
    alert("Transaction is successul");

    const fileName = selectedFileName;
    const anonymize_columns = document.querySelector("#anonymizable-data").value;  // anonymizeColumns must be a list, it must contain list of columns to anonymize

    // Send file name and column name to backend
    const data = {
      file_name: fileName,
      column_name: columnNames,
      anonymize_columns: anonymize_columns 
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/display-anonymized-data",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

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
      `http://127.0.0.1:5000/columnNames?fileName=${selectedFile}`
    );
    setColumnNames(response.data);
  };

  return (
    <>
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
            <div>
              <select
                id="anonymizable-data"
                name="anonymizable-data"
                autoComplete="anonymizable-data"
                className="block px-3 py-2 w-full rounded-md border-0  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              >
                {columnNames.map((key, index) => (
                  <option key={index}>{key}</option>
                ))}
              </select>
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
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table
            className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm dark:divide-gray-700 dark:bg-gray-900"
          >
            <thead className="ltr:text-left rtl:text-right">
              <tr>
                {columnNames.map((keys) => {
                  return <th className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">{keys}</th>
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {anonymizedData.map((data) => {
                return <tr>
                  {columnNames.map((key) => {
                    return <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">
                      {data[key]}
                    </td>
                  })}
                </tr>
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
