import { useState, useEffect } from "react";

const Memos = ({ state }) => {
  const [memos, setMemos] = useState([]);
  const { contract } = state;
  useEffect(() => {
    const memosMessage = async () => {
      const memos = await contract.getMemos();
      setMemos(memos);
      //console.log(memos)
    };
    contract && memosMessage();
  }, [contract]);

  return (
    <>
      <div className=" text-center">
        <h3 className="text-xl  font-bold sm:text-2xl py-8">Transaction History</h3>
        <div className=" max-w-64 md:max-w-80  lg:max-w-5xl max-h-96 overflow-x-scroll rounded-lg border border-gray-200 dark:border-gray-700">
          <table className=" divide-y-2 divide-gray-200 bg-white text-sm dark:divide-gray-700 dark:bg-gray-700">
            <thead>
              <th className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">Filename</th>
              <th className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">Timestamp</th>
              <th className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">Column name</th>
              <th className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">User ID</th>
            </thead>
            <tbody>
              {memos.map((memo, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">
                    {memo.user_name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">
                    {memo.file_name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">
                    {memo.column_names.join(", ")}
                    {/* If you need more complex formatting, you can use something like:
                {memo.column_name.map((name, idx) => (
                  <span key={idx}>{name}</span>
                ))} */}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">
                    {new Date(memo.timestamp * 1000).toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">
                    {memo.from}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Memos;
