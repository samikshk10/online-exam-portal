import React, { useState, useEffect } from 'react';
import { addUsers } from '../../services/userServices';
import { Toast } from '../../helper/toast';
import { UserInterface } from '../../interfaces/UserInterface';
interface UserModalProps {
    user: UserInterface;
    onClose: () => void;
    onSave: (user: any) => void;
    onUpdated: () => void;
}

const UserModal = ({ user, onClose, onSave, onUpdated }: UserModalProps) => {
    const [fullName, setfullName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    useEffect(() => {
        if (user) {
            setfullName(user?.fullName);
            setEmail(user.email);
        } else {
            setfullName('');
            setEmail('');
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await addUsers({ fullName, email })
            .then((_) => {
                onSave({ fullName, email });
                onUpdated();

                Toast.Success('User Added Successfully');
            })
            .catch((_) => {
                Toast.Error('Add User Error');
            });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30 ">
            <div className="bg-white p-10 rounded-lg">
                <h2 className="text-2xl mb-4">
                    {user ? 'Edit User' : 'Add User'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-1">fullName</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setfullName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserModal;
