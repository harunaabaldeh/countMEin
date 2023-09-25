import { yupResolver } from "@hookform/resolvers/yup";
import { FieldValues, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createSessionSchema } from "./sessionFormSchema";
import { Session, SessionFormValues } from "../../app/models/session";
import agent from "../../app/api/agent";
import { useEffect, useState } from "react";
import AppLoading from "../../app/components/AppLoading";

function GenerateQRCodeForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<Session>();

  const {
    reset,
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(createSessionSchema),
  });

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      const getSession = async () => {
        try {
          setLoading(true);
          const getSession = await agent.Session.getSession(id);
          if (getSession) {
            const {
              sessionName,
              sessionExpiresAt,
              regenerateLinkToken,
              linkExpiryFreequency,
            } = getSession;
            reset({
              sessionName,
              sessionExpiresAt: new Date(sessionExpiresAt)
                .toISOString()
                .slice(0, 16),
              regenerateLinkToken: !regenerateLinkToken,
              linkExpiryFreequency,
            });
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };
      getSession();
    }
  }, [id, reset]);

  const onSubmit = async (data: FieldValues) => {
    const {
      sessionName,
      sessionExpiresAt,
      linkExpiryFreequency,
      regenerateLinkToken,
    } = data as SessionFormValues;

    let formSession: SessionFormValues = {
      sessionName,
      sessionExpiresAt,
      regenerateLinkToken: !regenerateLinkToken,
      linkExpiryFreequency,
    };

    try {
      setLoading(true);
      if (id) {
        const updatedSession = await agent.Session.updateSession(
          id,
          formSession
        );
        setSession(updatedSession);
      } else {
        const newSession = await agent.Session.createSession(formSession);
        setSession(newSession);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      navigate("/user-profile/current-session", { state: { session } });
    }
  };

  if (loading) return <AppLoading />;

  return (
    <div className="w-full p-8 pt-0 lg:w-1/2 mx-auto ">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-2">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Session Name
          </label>
          <input
            className="w-full text-sm  px-4 py-3 bg-gray-200 focus:bg-gray-100 border  border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
            type="text"
            placeholder="title or subject of session"
            {...register("sessionName")}
          />
          {errors.sessionName && (
            <p className="text-red-500 text-xs italic">
              {errors.sessionName.message}
            </p>
          )}
        </div>
        <div className="mt-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Expires at
          </label>
          <input
            className="w-full text-sm  px-4 py-3 bg-gray-200 focus:bg-gray-100 border  border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
            type="datetime-local"
            placeholder="Enter a date and time"
            {...register("sessionExpiresAt")}
            defaultValue={new Date(Date.now() + 2 * 60 * 60 * 1000)
              .toISOString()
              .slice(0, 16)}
          />
          {errors.sessionExpiresAt && (
            <p className="text-red-500 text-xs italic">
              {errors.sessionExpiresAt.message}
            </p>
          )}
        </div>
        {!watch("regenerateLinkToken") && (
          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Regenerate after (seconds){" "}
              <span className="text-gray-400">(optional)</span>
            </label>
            <input
              className="w-full text-sm  px-4 py-3 bg-gray-200 focus:bg-gray-100 border  border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
              type="number"
              placeholder="For every 30 seconds, enter 30"
              {...register("linkExpiryFreequency")}
              defaultValue={30}
            />
            {errors.linkExpiryFreequency && (
              <p className="text-red-500 text-xs italic">
                {errors.linkExpiryFreequency.message}
              </p>
            )}
          </div>
        )}
        <div className="mt-4">
          <label className="inline-flex items-center text-gray-700 text-sm font-bold mb-2 w-full">
            <input
              className="form-checkbox h-5 w-5 text-gray-600"
              type="checkbox"
              {...register("regenerateLinkToken")}
            />
            <span className="ml-2">Do not regenerate QRCode</span>
          </label>
        </div>

        {watch("regenerateLinkToken") && (
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
              <span className="font-medium">We recommend</span> you regenerate
              the QRCode every few seconds to prevent link sharing.
            </div>
          </div>
        )}
        <button
          type="submit"
          className="my-4 bg-slate-500 hover:bg-slate-700 text-white text-base rounded-lg py-2.5 px-5 transition-colors w-full text-[19px]"
        >
          <div className="flex items-center justify-center">
            {isSubmitting && (
              <div className="h-5 w-5 border-t-transparent border-solid animate-spin rounded-full border-white border-4"></div>
            )}{" "}
            <div className="ml-2">{id ? "Update" : "Create"} Session</div>
          </div>
        </button>
      </form>
    </div>
  );
}
export default GenerateQRCodeForm;
