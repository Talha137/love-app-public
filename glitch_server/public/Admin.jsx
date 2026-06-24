import { useState } from "react";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [data, setData] = useState([]);
  const [authorized, setAuthorized] = useState(false);

  const login = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/admin?password=${password}`
      );

      if (!res.ok) {
        alert("Wrong Password ❌");
        return;
      }

      const result = await res.json();

      setData(result);
      setAuthorized(true);
    } catch (error) {
      alert("Server not running");
      console.log(error);
    }
  };

  if (!authorized) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Admin Login</h1>

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={login}>Login</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Panel</h1>

      {data.length === 0 ? (
        <p>No answers yet</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Name</th>
              <th>Answer</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.answer}</td>
                <td>{item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
