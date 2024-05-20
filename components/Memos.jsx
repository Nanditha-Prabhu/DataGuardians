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
          {memos.map((memo, index) => (
            <tr key={index}>
              <td
                style={{
                  backgroundColor: "dodgerblue",
                  border: "1px solid white",
                  borderCollapse: "collapse",
                  padding: "7px",
                  width: "100px",
                  color: "white",
                }}
              >
                {memo.user_name}
              </td>
              <td
                style={{
                  backgroundColor: "dodgerblue",
                  border: "1px solid white",
                  borderCollapse: "collapse",
                  padding: "7px",
                  width: "100px",
                  color: "white",
                }}
              >
                {memo.file_name}
              </td>
              <td
                style={{
                  backgroundColor: "dodgerblue",
                  border: "1px solid white",
                  borderCollapse: "collapse",
                  padding: "7px",
                  width: "300px",
                  color: "white",
                }}
              >
                {memo.column_names.join(", ")}
                {/* If you need more complex formatting, you can use something like:
                {memo.column_name.map((name, idx) => (
                  <span key={idx}>{name}</span>
                ))} */}
              </td>
              <td
                style={{
                  backgroundColor: "dodgerblue",
                  border: "1px solid white",
                  borderCollapse: "collapse",
                  padding: "7px",
                  width: "800px",
                  color: "white",
                }}
              >
                {new Date(memo.timestamp * 1000).toLocaleString()}
              </td>
              <td
                className="container-fluid"
                style={{
                  backgroundColor: "dodgerblue",
                  border: "1px solid white",
                  borderCollapse: "collapse",
                  padding: "7px",
                  width: "400px",
                  color: "white",
                }}
              >
                {memo.from}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Memos;
