import QRCode from "react-qr-code";
import agent from "../../app/api/agent";
import { useEffect, useState } from "react";
import { Session } from "../../app/models/session";
import { useLocation } from "react-router-dom";
import AppLoading from "../../app/components/AppLoading";
import { format } from "date-fns";

function CurrentSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const { state } = useLocation();
  let refreshTokenTimeout: any;

  const [hostURL, setHostURL] = useState("");

  useEffect(() => {
    const baseUrl = window.location.origin;
    setHostURL(baseUrl);
  }, [window.location.search, window.location.origin, setHostURL, state]);

  const copyToClipboard = () => {
    if (session?.linkToken) {
      navigator.clipboard.writeText(
        // import.meta.env.VITE_CLIENT_URL + "?linkToken=" + session?.linkToken
        hostURL + "?linkToken=" + session?.linkToken
      );
    } else {
      navigator.clipboard.writeText(hostURL);
    }
    setIsCopied(true);
  };

  useEffect(() => {
    if (session && session.regenerateLinkToken) {
      refreshLinkTokenTimer(session);
    }

    return () => {
      stopRefreshTokenTimer();
    };
  }, [session]);

  const refreshLinkToken = async () => {
    stopRefreshTokenTimer();
    try {
      const result = await agent.Session.refreshLinkToken(session?.sessionId!);
      if (result) {
        setSession(result);
        refreshLinkTokenTimer(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const refreshLinkTokenTimer = (session: Session) => {
    refreshTokenTimeout = setTimeout(
      refreshLinkToken,
      session.linkExpiryFreequency * 1000 - 2000
    );
  };

  const stopRefreshTokenTimer = () => {
    clearTimeout(refreshTokenTimeout);
  };

  useEffect(() => {
    if (isCopied) {
      const timeout = setTimeout(() => {
        setIsCopied(false);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [isCopied]);

  useEffect(() => {
    const getCurrentSession = async () => {
      try {
        setLoading(true);
        const currentSession = await agent.Session.getCurrentSession();
        setSession(currentSession);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (state && state.session) {
      setSession(state.session);
    } else {
      getCurrentSession();
    }
  }, []);

  if (loading) {
    return <AppLoading />;
  }

  return (
    <>
      <div className="font-medium text-gray-900 text-left px-6">
        {session ? (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{session.sessionName}</h2>
              <span className="text-sm text-gray-400">
                Expires at{" "}
                {format(
                  new Date(session.sessionExpiresAt),
                  "MMMM, EEEE do, h:mm a"
                )}
              </span>
            </div>
          </>
        ) : (
          <h2 className="text-lg font-semibold">
            No active session yet, create one!
          </h2>
        )}
      </div>
      <div className="mt-5 w-full flex flex-col items-center overflow-hidden text-sm">
        <div className="w-80 bg-white p-3 border-2 border-black-500">
          <QRCode
            className="w-full h-full object-cover"
            value={
              hostURL +
              (session?.linkToken ? "?linkToken=" + session?.linkToken : " ")
            }
          />
        </div>
        <button
          onClick={copyToClipboard}
          className="w-80 my-4 text-gray-200 block rounded-lg text-center leading-6 px-6 py-3 bg-slate-600 hover:bg-slate-700 hover:text-white font-medium transition-colors"
        >
          {isCopied ? "Copied!" : "Copy to clipboard"}
        </button>
      </div>
    </>
  );
}
export default CurrentSession;
