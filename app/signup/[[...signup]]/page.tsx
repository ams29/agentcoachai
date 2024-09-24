"use client"
import { useState } from 'react';
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  const [newsletter, setNewsletter] = useState(true); 

  const handleNewsletterChange = (event:any) => {
    setNewsletter(event.target.checked); 
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-900">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        
        <div className="flex flex-col items-center mb-4">
          <label className="text-white font-thin">
            <input
              type="checkbox"
              checked={newsletter}
              onChange={handleNewsletterChange}
              className="mr-2"
            />
            Subscribe to our newsletter
          </label>
        </div>
        
        
        <SignUp
          signInUrl={`${process.env.NEXT_PUBLIC_BASE_URL}/signin`}
          unsafeMetadata={{ newsletter }} 
        />
      </div>
    </div>
  );
}
