import { useState, useEffect } from "react";
import abi from "../contractJson/chai.json";
import { ethers } from "ethers";
import Memos from "./Memos";

function AccessData() {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });

  const [account, setAccount] = useState("Not connected");
  useEffect(() => {
    const template = async () => {
      const contractAddres = "0x4A477A2a0012eC1274a736FB3921C6EA2eAD357c";
      const contractABI = abi.abi;
      //Metamask part
      //1. In order do transactions on goerli testnet
      //2. Metmask consists of infura api which actually help in connectig to the blockhain
      try {
        const { ethereum } = window;
        const account = await ethereum.request({
          method: "eth_requestAccounts",
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        setAccount(account);
        const provider = new ethers.providers.Web3Provider(ethereum); //read the Blockchain
        const signer = provider.getSigner(); //write the blockchain

        const contract = new ethers.Contract(
          contractAddres,
          contractABI,
          signer
        );
        console.log(contract);
        setState({ provider, signer, contract });
      } catch (error) {
        console.log(error);
      }
    };
    template();
  }, []);

  const anonymize_file = async (event) => {
    event.preventDefault();
    const { contract } = state;
    const name = "satwik";
    const file_name = document.querySelector("#file-name").value;
    const column_name = document.querySelector("#anonymizable-data").value;
    //const amount = document.querySelector("#amount").value;
    const amount = { value: ethers.utils.parseEther("0.001") };
    const transaction = await contract.anonymize_file(
      file_name,
      column_name,
      amount
    );
    await transaction.wait();
    alert("Transaction is successful");
    window.location.reload();
  };

  return (
    <>
      <form className=" border-4 m-7 p-7" onSubmit={anonymize_file}>
        <div className=" font-semibold text-2xl">Access the Data</div>
        <div className="sm:col-span-3">
          <label
            htmlFor="file-name"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            File name
          </label>
          <div className="mt-2">
            <select
              id="file-name"
              name="file-name"
              autoComplete="file-name"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
            >
              <option>United States</option>
              <option>Canada</option>
              <option>Mexico</option>
            </select>
          </div>
        </div>

        <div className="sm:col-span-3">
          <label
            htmlFor="anonymizable-data"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Data to be anonymized
          </label>
          <div className="mt-2">
            <select
              id="anonymizable-data"
              name="anonymizable-data"
              autoComplete="anonymizable-data"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
            >
              <option>United States</option>
              <option>Canada</option>
              <option>Mexico</option>
            </select>
          </div>
        </div>

        <button
          class="group inline-block rounded bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px] hover:text-white focus:outline-none focus:ring active:text-opacity-75"
          href="#"
        >
          <span class="block rounded-sm bg-white px-8 py-3 text-sm font-medium group-hover:bg-transparent">
            Submit
          </span>
        </button>
      </form>

      <Memos state={state} />
    </>
  );
}

export default AccessData;
