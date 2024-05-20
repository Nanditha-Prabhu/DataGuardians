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
    <div className="mx-auto max-w-screen-xl text-center">
      <h3 className="text-xl  font-bold sm:text-2xl py-8" >History</h3>
      <table className=" bg-gray-700 w-full border-collapse">
        <thead>
          <th className=" border-2 text-white px-3  py-10">Filename</th>
          <th className=" border-2 text-white px-3  py-10">Timestamp</th>
          <th className=" border-2 text-white px-3  py-10">Column name</th>
          <th className=" border-2 text-white px-3  py-10">User ID</th>
        </thead>
        <tbody>
          {memos.map((memo) => {
            return (
              <tr>
                <td
                  className=" border-2 px-3 text-slate-100 py-10 text-left"
                >
                  {memo.name}
                </td>
                <td
                  className=" border-2 px-3 text-slate-100 py-10 text-left"
                >
                  {new Date(memo.timestamp * 1000).toLocaleString()}
                </td>
                <td
                  className=" border-2 px-3 text-slate-100 py-10 text-left"
                >
                  {memo.column_name}
                </td>
                <td
                  className=" border-2 px-3 text-slate-100 py-10 text-left"
                >
                  {memo.from}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Memos;
