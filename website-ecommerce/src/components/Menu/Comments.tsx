'use client';
import React, { useState, useEffect } from 'react';

interface Comment {
  id: number;
  rating: number;
  title: string;
  content: string;
  createdAt: string;
  user: {
    firstname: string;
    lastname: string;
  };
}

export function TestimonialCarousel() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch('/api/comments');
        const data = await response.json();
        
        // Ensure data is an array
        if (Array.isArray(data)) {
          setComments(data);
        } else {
          console.error('Received non-array response:', data);
          setError('Failed to load comments');
          setComments([]);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
        setError('Failed to load comments');
        setComments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === comments.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? comments.length - 1 : prevIndex - 1
    );
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={`text-xl ${i < rating ? 'text-blue-700' : 'text-gray-300'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4 text-center">
        <p>Loading testimonials...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!Array.isArray(comments) || comments.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4 text-center">
        <p>No testimonials yet. Be the first to share your experience!</p>
      </div>
    );
  }

  // Calculate average rating
  const averageRating = comments.reduce((acc, comment) => acc + comment.rating, 0) / comments.length;

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Onze klanten vertellen het beter dan wij het doen!</h1>
        <div className="flex items-center justify-center gap-2">
          <span className="text-xl font-semibold">Uitstekend {averageRating.toFixed(1)} / 5</span>
          <div className="flex">{renderStars(Math.round(averageRating))}</div>
        </div>
      </div>

      <div className="relative">
        <div className="flex overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {comments.map((comment) => (
              <div key={comment.id} className="min-w-full p-4">
                <div className="flex justify-between">
                  <div 
                    className="bg-white rounded-lg shadow-md p-8 mx-2 flex-1 flex flex-col items-center"
                  >
                    <div className="flex mb-2">
                      {renderStars(comment.rating)}
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{comment.title}</h3>
                    <p className="text-center mb-6">{comment.content}</p>
                    <p className="font-semibold">
                      {comment.user.firstname} {comment.user.lastname}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
          aria-label="Previous testimonial"
        >
          ←
        </button>
        
        <button 
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
          aria-label="Next testimonial"
        >
          →
        </button>
      </div>
    </div>
  );
}

