import Button from '../common/Button';
import UserModal from './UserModal';
import UserTable from './UsersTable';
import useDebounce from '../hooks/useDebounce';
import { useEffect, useState } from 'react';
import { FaUserPlus } from 'react-icons/fa';
import { UserInterface } from '../../interfaces/UserInterface';
import { searchUsers } from '../../services/examService';
import { getUsers } from '../../services/userServices';

const ManageUsers = () => {
    const [users, setUsers] = useState<UserInterface[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<UserInterface | null>(null);

    const handleAddUser = (user: UserInterface) => {
        setUsers([...users, { ...user }]);
        setIsModalOpen(false);
    };
    const handleToggleStatus = (userId: number) => {
        setUsers(
            users.map((user) =>
                user.id === userId
                    ? {
                          ...user,
                          status:
                              user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
                      }
                    : user
            )
        );
    };
    const getUserData = async () => {
        const response = await getUsers();
        console.log('this is response', response);
        if (response) {
            setUsers(response);
        }
    };

    useEffect(() => {
        getUserData();
    }, []);

    const handleEditUser = (updatedUser: UserInterface) => {
        setUsers(
            users.map((user) =>
                user.id === updatedUser.id ? updatedUser : user
            )
        );
        setIsModalOpen(false);
    };

    const handleDeleteUser = (userId: number) => {
        setUsers(users.filter((user) => user.id !== userId));
    };

    const [search, setSearch] = useState<string>('');

    const debouncedSearch = useDebounce(search, 300);
    const searchusers = async () => {
        console.log(debouncedSearch, 'this is seach debounced text');
        const response = await searchUsers({ searchText: debouncedSearch });
        if (response) {
            setUsers(response);
        }
    };

    useEffect(() => {
        console.log('called');
        searchusers();
    }, [debouncedSearch]);

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between">
                <div className="flex flex-row gap-2">
                    <input
                        type="text"
                        name="search"
                        value={search}
                        placeholder="Search Users"
                        onChange={(e) => setSearch(e.target.value)}
                        id="search"
                        className="border border-gray-300 p-2 rounded"
                    />
                    <Button
                        variant="secondary"
                        handleBtnClick={() => setSearch('')}
                    >
                        Reset
                    </Button>
                </div>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => {
                        setCurrentUser(null);
                        setIsModalOpen(true);
                    }}
                >
                    <div className="flex justify-center items-center gap-2">
                        Add User <FaUserPlus />
                    </div>
                </button>
            </div>
            <UserTable
                users={users}
                onEdit={(user) => {
                    setCurrentUser(user);
                    setIsModalOpen(true);
                }}
                onDelete={handleDeleteUser}
                onToggleStatus={handleToggleStatus}
            />
            {isModalOpen && (
                <div>
                    <UserModal
                        user={currentUser}
                        onUpdated={getUserData}
                        onClose={() => setIsModalOpen(false)}
                        onSave={currentUser ? handleEditUser : handleAddUser}
                    />
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
