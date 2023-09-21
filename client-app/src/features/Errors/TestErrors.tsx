import axios from "axios";
import { useState } from "react";
import ValidationError from "./ValidationError";

function TestErrors() {
  const baseUrl = import.meta.env.VITE_API_URL;
  const [errors, setErrors] = useState<[] | undefined>(undefined);

  function handleNotFound() {
    axios
      .get(baseUrl + "/buggy/not-found")
      .catch((err) => console.log(err.response));
  }

  function handleBadRequest() {
    axios
      .get(baseUrl + "/buggy/bad-request")
      .catch((err) => console.log(err.response));
  }

  function handleServerError() {
    axios
      .get(baseUrl + "/buggy/server-error")
      .catch((err) => console.log(err.response));
  }

  function handleUnauthorised() {
    axios.get(baseUrl + "/buggy/unauthorised").catch((err) => console.log(err));
  }

  function handleValidationError() {
    axios
      .post(baseUrl + "/buggy/validation-error", {})
      .catch((err) => setErrors(err));
  }

  return (
    <div className="w-screen flex flex-col items-center justify-cente">
      <div className="w-full mx-auto py-16">
        <h1 className="text-3xl text-center font-bold mb-6">Error testing</h1>
        <div
          className="
          bg-white
          px-6
          py-4
          my-3
          w-3/4
          mx-auto
          shadow
          rounded-md
          flex
          items-center
        "
        >
          <div className="w-full text-center mx-auto">
            <button
              onClick={handleNotFound}
              type="button"
              className="
              border border-indigo-500
              bg-indigo-500
              text-white
              rounded-md
              px-4
              py-2
              m-2
              transition
              duration-500
              ease
              select-none
              hover:bg-indigo-600
              focus:outline-none focus:shadow-outline
            "
            >
              Not Found
            </button>
            <button
              onClick={handleBadRequest}
              type="button"
              className="
              border border-teal-500
              bg-teal-500
              text-white
              rounded-md
              px-4
              py-2
              m-2
              transition
              duration-500
              ease
              select-none
              hover:bg-teal-600
              focus:outline-none focus:shadow-outline
            "
            >
              Bad request
            </button>
            <button
              onClick={handleServerError}
              type="button"
              className="
              border border-red-500
              bg-red-500
              text-white
              rounded-md
              px-4
              py-2
              m-2
              transition
              duration-500
              ease
              select-none
              hover:bg-red-600
              focus:outline-none focus:shadow-outline
            "
            >
              Server error
            </button>
            <button
              onClick={handleUnauthorised}
              type="button"
              className="
              border border-yellow-500
              bg-yellow-500
              text-white
              rounded-md
              px-4
              py-2
              m-2
              transition
              duration-500
              ease
              select-none
              hover:bg-yellow-600
              focus:outline-none focus:shadow-outline
            "
            >
              Not authorized
            </button>
            <button
              onClick={handleValidationError}
              type="button"
              className="
              border border-gray-500
              bg-gray-500
              text-white
              rounded-md
              px-4
              py-2
              m-2
              transition`
              duration-500
              ease
              select-none
              hover:bg-gray-600
              focus:outline-none focus:shadow-outline
            "
            >
              Validation Error
            </button>
          </div>
        </div>
      </div>
      {errors && <ValidationError errors={errors} />}
    </div>
  );
}

export default TestErrors;
