function CurrentSession() {
  return (
    <>
      <div className="font-medium text-gray-900 text-left px-6">
        This session will expire in 2 hours
      </div>
      <div className="mt-5 w-full flex flex-col items-center overflow-hidden text-sm">
        <div className="w-80 bg-white p-3 border-2 border-black-500">
          <img
            className="w-full h-full object-cover"
            src="../../../src/assets/images/placeholder_qrcode.jpg"
          />
        </div>
        <button className="w-80 my-4 text-gray-200 block rounded-lg text-center leading-6 px-6 py-3 bg-gray-900 hover:bg-black hover:text-white font-medium">
          Copy url to clipboard
        </button>
      </div>
    </>
  );
}
export default CurrentSession;
