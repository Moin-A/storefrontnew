import { Address } from '../../app/types/solidus';
import { Button } from '../ui/button';
import { Edit } from 'lucide-react';

interface AddressCardProps {
  address: Address;
  onEdit?: (address: Address) => void;
}

export default function AddressCard({ address, onEdit }: AddressCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-medium text-gray-900">
            {address.firstname} {address.lastname}
          </h3>
          <p className="text-sm text-gray-600">{address.phone}</p>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onEdit?.(address)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="text-sm text-gray-600 space-y-1">
        <p>{address.address1}</p>
        {address.address2 && <p>{address.address2}</p>}
        <p>{address.city}, {address.state_name} {address.zipcode}</p>
        <p>{address.country_name}</p>
      </div>
    </div>
  );
}
