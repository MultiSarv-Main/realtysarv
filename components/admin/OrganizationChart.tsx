
import React from 'react';
import { User } from '../../types';
import UserNode from './UserNode';

interface OrganizationChartProps {
  users: User[];
}

const OrganizationChart: React.FC<OrganizationChartProps> = ({ users }) => {
  const safeUsers = React.useMemo(() => users || [], [users]);

  const childrenByParentId = React.useMemo(() => {
    const map = new Map<string, User[]>();
    for (const user of safeUsers) {
      if (user.reportsTo) {
        if (!map.has(user.reportsTo)) {
          map.set(user.reportsTo, []);
        }
        map.get(user.reportsTo)!.push(user);
      }
    }
    return map;
  }, [safeUsers]);

  const rootUsers = React.useMemo(() => (safeUsers || []).filter(u => !u.reportsTo), [safeUsers]);

  if(rootUsers.length === 0 && safeUsers.length > 0) {
      return (
          <div className="text-center text-yellow-400 bg-yellow-900/50 p-6 rounded-lg border border-yellow-700">
              <i className="fas fa-exclamation-triangle text-3xl mb-3"></i>
              <h4 className="font-bold">Potential Loop Detected or No Top-Level Manager</h4>
              <p className="text-sm mt-1">No users are set as top-level managers (i.e., they don't report to anyone). Please set a top-level manager in the 'User List' tab to build the organization chart.</p>
          </div>
      )
  }

  return (
    <div className="org-chart">
      {rootUsers.length > 0 ? (
        <ul className="org-tree">
          {rootUsers.map(user => (
            <UserNode 
              key={user.id} 
              user={user} 
              childrenByParentId={childrenByParentId}
            />
          ))}
        </ul>
      ) : (
        <p className="text-center text-[var(--text-secondary)]">No users in the system to display.</p>
      )}
    </div>
  );
};

export default OrganizationChart;
