import { Button } from '../ui/button';
import { Star, Edit } from 'lucide-react';

interface Review {
  id: number;
  productName: string;
  rating: number;
  comment: string;
  date: string;
  productImage: string;
}

interface ReviewCardProps {
  review: Review;
  onEdit?: (review: Review) => void;
}

export default function ReviewCard({ review, onEdit }: ReviewCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start gap-4">
        <img 
          src={review.productImage} 
          alt={review.productName}
          className="w-16 h-16 object-cover rounded-lg"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900">{review.productName}</h3>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${
                    i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`} 
                />
              ))}
            </div>
          </div>
          <p className="text-gray-600 mb-2">{review.comment}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{review.date}</span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onEdit?.(review)}
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
