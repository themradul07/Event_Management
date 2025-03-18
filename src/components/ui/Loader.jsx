export default function CircleLoader() {
    return (
      <div className="flex items-center justify-center  bg-purple-800 h-20 w-20 scale-75 rounded-full">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className="absolute w-10 h-10 bg-white animate-spin" style={{ animationDuration: '2s' }}></div>
        </div>
      </div>
    );
  }
  