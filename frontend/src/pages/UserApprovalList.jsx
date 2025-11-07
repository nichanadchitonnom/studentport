import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserApprovalList.css";

export default function UserApprovalList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // ดึง token จาก localStorage

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/user/pending", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("ไม่สามารถโหลดรายชื่อผู้ใช้ได้");
        }

        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingUsers();
  }, [token]);

  if (loading) return <div className="loading">⏳ กำลังโหลด...</div>;
  if (error)
    return <div className="error">⚠️ เกิดข้อผิดพลาด: {error}</div>;

  return (
    <div className="approval-list-container">
      <h2>Pending Account Approvals</h2>
      {users.length === 0 ? (
        <p className="no-users">🎉 ไม่มีผู้ใช้ที่รอการอนุมัติ</p>
      ) : (
        <table className="approval-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="user-row"
                onClick={() => navigate(`/user-approval/${user._id}`)} // กดเพื่อไปหน้า detail
              >
                <td>{user.displayName || "ไม่ระบุชื่อ"}</td>
                <td>{user.role}</td>
                <td>{user.email}</td>
                <td>
                  <span className="status pending">Pending</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
