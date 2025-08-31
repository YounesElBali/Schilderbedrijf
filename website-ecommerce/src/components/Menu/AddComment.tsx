// 'use client';
// import React, { useState } from 'react';

// interface AddCommentProps {
//   userId: number;
//   onCommentAdded: () => void;
// }

// export function AddComment({ userId, onCommentAdded }: AddCommentProps) {
//   const [formData, setFormData] = useState({
//     rating: 5,
//     title: '',
//     content: '',
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError('');
//     setSuccess('');

//     try {
//       const response = await fetch('/api/comments', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ...formData,
//           userId,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to add comment');
//       }

//       setSuccess('Comment added successfully!');
//       setFormData({ rating: 5, title: '', content: '' });
//       onCommentAdded();
//     } catch (error) {
//       console.log(error);
//       setError('Failed to add comment. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const renderStars = (rating: number) => {
//     const stars = [];
//     for (let i = 0; i < 5; i++) {
//       stars.push(
//         <button
//           key={i}
//           type="button"
//           onClick={() => setFormData(prev => ({ ...prev, rating: i + 1 }))}
//           className={`text-2xl ${i < formData.rating ? 'text-blue-700' : 'text-gray-300'}`}
//         >
//           ★
//         </button>
//       );
//     }
//     return stars;
//   };

//   return (
//     <div className="w-full max-w-2xl mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-4">Share Your Experience</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Rating
//           </label>
//           <div className="flex space-x-1">
//             {renderStars(formData.rating)}
//           </div>
//         </div>

//         <div>
//           <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
//             Title
//           </label>
//           <input
//             type="text"
//             id="title"
//             value={formData.title}
//             onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
//             required
//             className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             placeholder="Give your review a title"
//           />
//         </div>

//         <div>
//           <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
//             Your Review
//           </label>
//           <textarea
//             id="content"
//             value={formData.content}
//             onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
//             required
//             rows={4}
//             className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             placeholder="Tell us about your experience"
//           />
//         </div>

//         {error && (
//           <p className="text-red-500 text-sm">{error}</p>
//         )}

//         {success && (
//           <p className="text-green-500 text-sm">{success}</p>
//         )}

//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
//             isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
//           }`}
//         >
//           {isSubmitting ? 'Submitting...' : 'Submit Review'}
//         </button>
//       </form>
//     </div>
//   );
// } 