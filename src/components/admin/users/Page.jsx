import UsersTable from "./Table";
import { usersData } from "../../../data/dummyData";

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Users</h1>

        <button className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm">
          Add User
        </button>
      </div>

      <UsersTable users={usersData} />
    </div>
  );
}
