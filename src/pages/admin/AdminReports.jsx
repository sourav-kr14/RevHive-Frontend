import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminReports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      const res = await api.get("/reports/admin");
      setReports(res.data);
    };

    fetchReports();
  }, []);

  return (
    <div>
      <h1 className="text-3xl mb-6">Reports</h1>

      <table className="w-full">
        <thead>
          <tr>
            <th>User</th>
            <th>Type</th>
            <th>Target</th>
            <th>Reason</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {reports.map((r) => (
            <tr key={r.id}>
              <td>{r.reporterUsername}</td>
              <td>{r.targetType}</td>
              <td>{r.targetId}</td>
              <td>{r.reason}</td>
              <td>{new Date(r.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}