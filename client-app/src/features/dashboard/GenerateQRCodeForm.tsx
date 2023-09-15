function GenerateQRCodeForm() {
  return (
    <div className="w-full p-8 pt-0 lg:w-1/2 mx-auto ">
      <div className="mt-2">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Session Name
        </label>
        <input
          className="w-full text-sm  px-4 py-3 bg-gray-200 focus:bg-gray-100 border  border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
          type="text"
          placeholder="title or subject of session"
        />
      </div>
      <div className="mt-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Expires at
        </label>
        <input
          className="w-full text-sm  px-4 py-3 bg-gray-200 focus:bg-gray-100 border  border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
          type="datetime-local"
        />
      </div>
      <div className="mt-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Regenerate after (seconds){" "}
          <span className="text-gray-400">(optional)</span>
        </label>
        <input
          className="w-full text-sm  px-4 py-3 bg-gray-200 focus:bg-gray-100 border  border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
          type="number"
          placeholder="For every 30 seconds, enter 30"
          min={20}
        />
      </div>
      <div className="mt-4">
        <label className="inline-flex items-center text-gray-700 text-sm font-bold mb-2 w-full">
          <input
            className="form-checkbox h-5 w-5 text-gray-600"
            type="checkbox"
          />
          <span className="ml-2">Do not regenerate QRCode</span>
        </label>
      </div>
      <div
        className="flex bg-blue-100 rounded-lg p-4 mb-4 text-sm text-blue-700"
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
          <span className="font-medium">We recommend</span> you regenerate the
          QRCode every few seconds to prevent link sharing.
        </div>
      </div>
      <button className="my-4 bg-slate-500 hover:bg-slate-700 text-white text-base rounded-lg py-2.5 px-5 transition-colors w-full text-[19px]">
        Create Session
      </button>
    </div>
  );
}
export default GenerateQRCodeForm;
