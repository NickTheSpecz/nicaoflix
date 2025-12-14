import React from 'react';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

export default function DetailsLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Backdrop Skeleton */}
      <div className="relative w-full h-[50vh] md:h-[70vh]">
        <LoadingSkeleton className="w-full h-full" animation="pulse" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      {/* Content Skeleton */}
      <div className="relative -mt-32 md:-mt-48 z-10 px-4 md:px-8 lg:px-16 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster Skeleton */}
            <div className="flex-shrink-0">
              <LoadingSkeleton
                className="w-48 md:w-64 aspect-[2/3] rounded-lg"
                animation="pulse"
              />
            </div>

            {/* Details Skeleton */}
            <div className="flex-1 space-y-4">
              {/* Title */}
              <LoadingSkeleton height="48px" width="70%" animation="pulse" />

              {/* Tagline */}
              <LoadingSkeleton height="24px" width="50%" animation="pulse" />

              {/* Metadata */}
              <div className="flex gap-4">
                <LoadingSkeleton height="24px" width="80px" animation="pulse" />
                <LoadingSkeleton height="24px" width="80px" animation="pulse" />
                <LoadingSkeleton height="24px" width="80px" animation="pulse" />
              </div>

              {/* Genres */}
              <div className="flex gap-2">
                <LoadingSkeleton height="32px" width="100px" animation="pulse" />
                <LoadingSkeleton height="32px" width="100px" animation="pulse" />
                <LoadingSkeleton height="32px" width="100px" animation="pulse" />
              </div>

              {/* Button */}
              <LoadingSkeleton height="56px" width="200px" animation="pulse" />

              {/* Overview */}
              <div className="space-y-2 pt-4">
                <LoadingSkeleton height="32px" width="150px" animation="pulse" />
                <LoadingSkeleton height="20px" width="100%" animation="pulse" />
                <LoadingSkeleton height="20px" width="100%" animation="pulse" />
                <LoadingSkeleton height="20px" width="80%" animation="pulse" />
              </div>

              {/* Cast */}
              <div className="space-y-2 pt-4">
                <LoadingSkeleton height="32px" width="120px" animation="pulse" />
                <div className="flex gap-4">
                  <LoadingSkeleton height="40px" width="120px" animation="pulse" />
                  <LoadingSkeleton height="40px" width="120px" animation="pulse" />
                  <LoadingSkeleton height="40px" width="120px" animation="pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
