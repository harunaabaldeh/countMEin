function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-center mb-8">
          <img
            src="../../src/assets/images/logo.png"
            alt="Logo"
            className="w-30 h-20"
          />
        </div>

        <h1 className="text-2xl font-semibold text-center text-gray-500 mt-8 mb-6">
          Hello there, Welcome!
        </h1>
        <p className="text-sm text-gray-600 text-justify mt-8 mb-6">
          By clicking on count me in, your name, email and MATNumber will be
          sent to the event organizer, (event owner's name), for registration
          purposes only.
        </p>
        <div className="flex justify-center space-x-4 my-4">
          <button className="my-4 bg-slate-500 hover:bg-slate-700 text-white text-base rounded-lg py-2.5 px-5 transition-colors w-full text-[19px]">
            Count me in
          </button>
        </div>

        <div
          className="flex bg-yellow-100 rounded-lg p-4 mb-4 text-sm text-yellow-700"
          role="alert"
        >
          <svg
            className="w-5 h-5 inline mr-3"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            ></path>
          </svg>
          <div>
            <span className="font-medium">Invalid Link!</span> This link is
            either expired or was not meant for you. Please re scan the QR code
            or contact the event organizer.
          </div>
        </div>
        <button className="my-4 bg-slate-500 hover:bg-slate-700 text-white text-base rounded-lg py-2.5 px-5 transition-colors w-full text-[19px]">
          Scan QR Code
        </button>
      </div>
    </div>
  );
}
export default Home;
