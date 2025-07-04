
import React, { useState } from 'react';
import type { PlanParticipant } from '../../types/travelPlan.type';

export interface TravelPlanParticipantsFormProps {
    participants: Partial<PlanParticipant>[];
    setParticipants: React.Dispatch<React.SetStateAction<Partial<PlanParticipant>[]>>;
}

const TravelPlanParticipantsForm: React.FC<TravelPlanParticipantsFormProps> = ({ participants, setParticipants }) => {
    const [newUserId, setNewUserId] = useState('');
    const [newRole, setNewRole] = useState('Editor');
    const [error, setError] = useState<string | null>(null);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUserId) {
            setError('User ID is required.');
            return;
        }
        // if (!newRole) {
        //     setError('Role is required.');
        //     return;
        // }
        setError(null);
        setParticipants(prev => [...prev, { user_id: Number(newUserId)}]);
        setNewUserId('');
        setNewRole('Editor');
    };

    const handleRemove = (idx: number) => {
        setParticipants(prev => prev.filter((_, i) => i !== idx));
    };

    return (
        <div className="mt-4 bg-gray-50 p-4 rounded">
            <h3 className="font-bold mb-2">Participants</h3>
            <div className="flex gap-2 mb-2">
                <input
                    placeholder="User ID"
                    value={newUserId}
                    onChange={e => setNewUserId(e.target.value)}
                    className="border rounded px-2 py-1"
                    required
                />
                <select
                    value={newRole}
                    onChange={e => setNewRole(e.target.value)}
                    className="border rounded px-2 py-1"
                >
                    <option value="Owner">Owner</option>
                    <option value="Editor">Editor</option>
                    <option value="Viewer">Viewer</option>
                </select>
                <button type="button" className="bg-purple-600 text-white px-3 py-1 rounded" onClick={handleAdd}>Add</button>
            </div>
            {error && <div className="text-red-600 mb-2">{error}</div>}
            <ul className="space-y-1">
                {participants.map((participant, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                        <span className="font-mono">{participant.user_id}</span>
                        <span className="text-xs text-gray-500">{participant.role_permission}</span>
                        <button type="button" className="text-red-500 ml-2" onClick={() => handleRemove(idx)}>Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TravelPlanParticipantsForm;
