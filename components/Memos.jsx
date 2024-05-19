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
        <thead>
          <tr>
            <th
              style={{
                backgroundColor: "dodgerblue",
                border: "1px solid white",
                borderCollapse: "collapse",
                padding: "7px",
                width: "100px",
                color: "white",
              }}
            >
              USER NAME
            </th>
            <th
              style={{
                backgroundColor: "dodgerblue",
                border: "1px solid white",
                borderCollapse: "collapse",
                padding: "7px",
                width: "100px",
                color: "white",
              }}
            >
              FILE NAME
            </th>
            <th
              style={{
                backgroundColor: "dodgerblue",
                border: "1px solid white",
                borderCollapse: "collapse",
                padding: "7px",
                width: "100px",
                color: "white",
              }}
            >
              ANONYMIZED COLUMN NAME
            </th>
            <th
              style={{
                backgroundColor: "dodgerblue",
                border: "1px solid white",
                borderCollapse: "collapse",
                padding: "7px",
                width: "100px",
                color: "white",
              }}
            >
              TIME AND DATE
            </th>
            <th
              style={{
                backgroundColor: "dodgerblue",
                border: "1px solid white",
                borderCollapse: "collapse",
                padding: "7px",
                width: "100px",
                color: "white",
              }}
            >
              BLOCKCHAIN HASH
            </th>
          </tr>
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
