import ReactPaginate from 'react-paginate';
import { useState } from 'react';
import { UserInterface } from '../../interfaces/UserInterface';
import { searchUsers } from '../../services/examService';

import {
    FaAngleLeft,
    FaAngleRight,
    FaChevronRight,
    FaEdit,
    FaThumbsDown,
    FaThumbsUp,
    FaTrash,
} from 'react-icons/fa';
interface UserTableProps {
    users: UserInterface[];
    onEdit: (userId: UserInterface) => void;
    onDelete: (userId: number) => void;
    onToggleStatus: (id: number) => void;
}

const UserTable = ({
    users,
    onEdit,
    onDelete,
    onToggleStatus,
}: UserTableProps) => {
    const [currentPage, setCurrentPage] = useState<number>(0);
    const usersPerPage = 10;
    const pageCount = Math.ceil(users.length / usersPerPage);
    const offset = currentPage * usersPerPage;
    const currentUsers = users.slice(offset, offset + usersPerPage);

    const handlePageClick = ({ selected }: { selected: number }) => {
        setCurrentPage(selected);
    };

    return (
        <div className="border-[1px] border-solid border-gray-200 mt-2 rounded-[8px]">
            <div className="flex items-center flex-row gap-1 p-4">
                <h2>User Table</h2>
                <FaChevronRight fontSize={20} />
            </div>
            <div className="max-h-[40rem] overflow-y-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-200 sticky top-0 z-10 h-16">
                        <tr>
                            <th className="py-2">SN</th>
                            <th className="py-2">Full Name</th>
                            <th className="py-2">Email</th>
                            <th className="py-2">Status</th>
                            <th className="py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center">
                                    No Users found
                                </td>
                            </tr>
                        ) : (
                            currentUsers &&
                            currentUsers.reverse()?.map((user, index) => (
                                <tr
                                    key={user.id}
                                    className="text-center border-b-2"
                                >
                                    <td className="py-2">
                                        {offset + index + 1}
                                    </td>
                                    <td className="py-2">{user.fullName}</td>
                                    <td className="py-2">{user.email}</td>
                                    <td className="py-2">{user.status}</td>
                                    <td className="py-2">
                                        <button
                                            className="bg-yellow-500 text-white px-4 py-2 rounded mx-2"
                                            onClick={() => onEdit(user)}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded"
                                            onClick={() => onDelete(user.id)}
                                        >
                                            <FaTrash />
                                        </button>
                                        <button
                                            className={`${user?.status === 'active' ? `bg-red-500` : `bg-blue-400`} text-white ml-2 px-4 py-2 rounded`}
                                            onClick={() =>
                                                onToggleStatus(user.id)
                                            }
                                        >
                                            {user?.status === 'ACTIVE' ? (
                                                <FaThumbsDown />
                                            ) : (
                                                <FaThumbsUp />
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center items-center mt-4">
                <ReactPaginate
                    previousLabel={<FaAngleLeft />}
                    nextLabel={<FaAngleRight />}
                    breakLabel="..."
                    breakClassName="break-me"
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName="pagination"
                    activeClassName="active"
                    forcePage={currentPage}
                />
            </div>
        </div>
    );
};

export default UserTable;
