
import React from 'react';
import { User } from '../../types';
import Avatar from '../Avatar';

interface UserNodeProps {
  user: User;
  childrenByParentId: Map<string, User[]>;
}

const UserNode: React.FC<UserNodeProps> = ({ user, childrenByParentId }) => {
  const children = childrenByParentId.get(user.id) || [];
  const initials = (user.name[0] || '') + (user.name.split(' ').pop()?.[0] || '');

  return (
    <li>
      <div className="node-content" data-role={user.role}>
        <Avatar initials={initials.toUpperCase()} size="lg" />
        <div className="node-details">
          <p className="node-name">{user.name}</p>
          <p className="node-role">{user.role}</p>
        </div>
      </div>
      {children.length > 0 && (
        <ul>
          {children.map(child => (
            <UserNode
              key={child.id}
              user={child}
              childrenByParentId={childrenByParentId}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default UserNode;
