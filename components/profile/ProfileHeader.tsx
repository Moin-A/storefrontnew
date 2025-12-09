import { User } from '../../app/types/solidus';
import { Badge } from '../ui/badge';
import { User as UserIcon } from 'lucide-react';

interface ProfileHeaderProps {
  user: User | null;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
          <UserIcon className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {user?.first_name} {user?.last_name}
          </h1>
          <p className="text-gray-600">{user?.email}</p>
          <Badge variant="secondary" className="mt-1">
            {user?.role || 'Customer'}
          </Badge>
        </div>
      </div>
    </div>
  );
}
