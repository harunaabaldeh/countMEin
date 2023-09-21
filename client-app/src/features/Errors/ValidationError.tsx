interface Props {
  errors: string[];
}

function ValidationError({ errors }: Props) {
  return (
    <div className="bg-red-50 border-l-8 border-red-900 mb-2">
      <div className="flex items-center">
        <div className="p-2">
          <div className="flex items-center">
            <div className="ml-2">
              <svg
                className="h-8 w-8 text-red-900 mr-2 cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="px-6 py-4 text-red-900 font-semibold text-lg">
              Please fix the following errors.
            </p>
          </div>
          <div className="px-16 mb-4">
            <ul className="list-disc list-inside">
              {errors.map((error) => (
                <li className="text-red-900 text-sm">{error}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ValidationError;
