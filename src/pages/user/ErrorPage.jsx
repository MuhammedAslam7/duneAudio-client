import { Home, RefreshCcw, ArrowLeft, Search } from 'lucide-react';

export function ErrorPage() {
  const goBack = () => window.history.back();
  const goHome = () => window.location.href = '/home';
  const refresh = () => window.location.reload();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        {/* Main Content Container */}
        <div className="bg-white backdrop-blur-lg bg-opacity-90 rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Column - Content */}
            <div className="space-y-6 text-center md:text-left">
              {/* Error Code with Enhanced Animation */}
              <div className="relative">
                <h1 className="text-8xl md:text-9xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-gradient">
                  404
                </h1>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-100 rounded-full opacity-50 animate-pulse"></div>
              </div>

              {/* Error Message */}
              <div className="space-y-4 relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Page Not Found
                </h2>
                <p className="text-lg text-gray-600">
                  The page you're looking for doesn't exist or has been moved.
                </p>
              </div>

              {/* Action Buttons with Enhanced Styling */}
              <div className="flex flex-col md:flex-row gap-4">
                <button
                  onClick={goHome}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Home size={20} />
                  Return Home
                </button>
                
                <button
                  onClick={goBack}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-xl border-2 border-gray-200 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  <ArrowLeft size={20} />
                  Go Back
                </button>
              </div>
            </div>

            {/* Right Column - Illustration */}
            <div className="hidden md:block relative">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-100 rounded-full opacity-50"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-100 rounded-full opacity-50"></div>
              <img 
                src="https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=800&q=80"
                alt="404 Illustration"
                className="relative z-10 rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-500 object-cover h-[400px] w-full"
              />
            </div>
          </div>

    
     
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
}

// Add custom styles to index.css
const style = document.createElement('style');
style.textContent = `
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .animate-blob {
    animation: blob 7s infinite;
  }
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  .animation-delay-4000 {
    animation-delay: 4s;
  }
  .animate-gradient {
    background-size: 200% 200%;
    animation: gradient 8s ease infinite;
  }
`;
document.head.appendChild(style);
