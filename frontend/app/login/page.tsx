'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function LoginPage() {
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-[#1b1c1d] text-white relative px-6 py-8 overflow-hidden">
      {/* Top-Left Logo */}
      <div className="absolute top-6 left-6">
        <h1 className="text-3xl font-bold text-[#A9DFD8]">GenCRM</h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-20 max-w-7xl mx-auto mt-20">
        {/* Left: Illustration + Text */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-xl mr-25">
          <h2 className="text-2xl lg:text-4xl font-semibold leading-tight mb-6">
            Drive Engagement with <br className="hidden lg:block" />
            <span className="text-[#A9DFD8]">Intelligence and Ease.</span>
          </h2>

          {/* Image with Zoom-out and Shadow */}
          <div className="relative w-[400px] h-[300px] md:w-[500px] md:h-[400px] mt-4 rounded-2xl overflow-hidden ">
            <Image
              src="/chart-illustration.png"
              alt="Analytics Chart"
              fill
              className="object-contain scale-[0.85] transition-transform duration-300"
            />
          </div>
        </div>

        {/* Right: Login Card */}
        <Card className="bg-[#121212] shadow-2xl shadow-black/60 w-full max-w-sm rounded-2xl border border-gray-700 mt-20" >
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-[#A9DFD8] mb-6 text-center">
              Login to Xeno CRM
            </h3>
            <Button
              onClick={handleGoogleLogin}
              className="w-full bg-[#A9DFD8] hover:bg-[#9dd3ca] text-black font-medium flex items-center justify-center gap-3 py-6 text-lg rounded-md"
            >
              <Image
                src="/google-logo.svg"
                alt="Google Logo"
                width={24}
                height={24}
              />
              Login with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
