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
    <div className="container-fluid">
      <h3 style={{ textAlign: "center", marginTop: "20px" }}>History</h3>
      <table>
        <tbody>
          {memos.map((memo) => {
            return (
              <tr>
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
                  {memo.column_name}
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
export default Memos;
