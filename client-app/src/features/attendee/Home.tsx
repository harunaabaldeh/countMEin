import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import { Link, useNavigate } from "react-router-dom";
import { AttendanceLinkToken, Attendee } from "../../app/models/attendance";
import { toast } from "react-toastify";
import AppLoading from "../../app/components/AppLoading";

function Home() {
  const navigate = useNavigate();
  const [sessionInfo, setSessionInfo] = useState({
    sessionName: "",
    sessionId: "",
    host: "",
    expired: false,
    linkToken: "",
  });

  const [loading, setLoading] = useState(false);
  const [attendee, setAttendee] = useState<Attendee>();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const linkToken = queryParams.get("linkToken");
    if (linkToken && linkToken?.split(".").length === 3) {
      localStorage.setItem("linkToken", JSON.stringify(linkToken));
      navigate("/");
    }
  }, [
    window.location.search,
    localStorage,
    agent.Attendance,
    setSessionInfo,
    setAttendee,
    setLoading,
    navigate,
  ]);

  useEffect(() => {
    const linkJwtToken: string = JSON.parse(localStorage.getItem("linkToken")!);
    if (!linkJwtToken || linkJwtToken.split(".").length !== 3) return;

    const decodedLinkToken: AttendanceLinkToken = JSON.parse(
      atob(linkJwtToken.split(".")[1])
    );

    setSessionInfo({
      sessionName: decodedLinkToken.unique_name,
      sessionId: decodedLinkToken.nameid,
      host: decodedLinkToken.given_name,
      expired: decodedLinkToken.exp * 1000 < Date.now(),
      linkToken: JSON.parse(localStorage.getItem("linkToken")!),
    });
  }, [
    localStorage,
    window.location.search,
    navigate,
    agent.Attendance,
    setSessionInfo,
    setAttendee,
    setLoading,
    navigate,
  ]);

  //google login
  useEffect(() => {
    // @ts-ignore
    google.accounts.id.initialize({
      client_id:
        "559758667407-k0a5jbbmsabs5v5e6carbuj4md1tluao.apps.googleusercontent.com",
      callback: createAttendee,
    });

    // @ts-ignore
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      {
        theme: "outline",
        size: "large",
        text: "continue_with",
        type: "standard",
        shape: "rectangular",
        width: "350",
        height: "50",
        longtitle: true,
        onsuccess: createAttendee,
        onfailure: (error: any) => {
          console.log(error);
        },
      } // customization attributes
    );

    // @ts-ignore
    google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed()) {
        console.log("Prompt was not displayed");
      } else if (notification.isSkippedMoment()) {
        console.log("Prompt was skipped");
      } else if (notification.isDismissedMoment()) {
        console.log("Prompt was dismissed");
      }
    });
  }, [
    sessionInfo,
    createAttendee,
    setLoading,
    setAttendee,
    navigate,
    localStorage,
    window.location.search,
    agent.Attendance,
  ]);

  async function createAttendee(response: any) {
    try {
      setLoading(true);
      const newAttendee = await agent.Attendance.createAttendee(
        sessionInfo.sessionId,
        response.credential,
        sessionInfo.linkToken
      );

      setAttendee(newAttendee);
      toast.success("You have successfully registered for this session!");
      setTimeout(() => {
        localStorage.removeItem("linkToken");
        localStorage.removeItem("attendee");
        navigate(-1);
      }, 5000);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function exitPageOnSave() {
    localStorage.removeItem("linkToken");
    window.close();
  }

  if (loading) return <AppLoading />;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-center mb-8">
          <img src="/images/logo.png" alt="Logo" className="w-30 h-20" />
        </div>

        <h1 className="text-2xl font-semibold text-center text-gray-500 mt-8 mb-6">
          Hello there, Welcome!
        </h1>
        {attendee ? (
          <div
            className="flex bg-green-100 rounded-lg p-4 mb-4 text-sm text-green-700"
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
              <span className="font-medium">
                {`${attendee.firstName} ${attendee.lastName} (${attendee.matNumber})`}
                !
              </span>{" "}
              You have successfully registered for the '
              {sessionInfo.sessionName}' session, hosted by {sessionInfo.host}.
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600 text-justify mt-8 mb-6">
            By clicking on countinue with Google, your name, email and MATNumber
            will be sent to the '{sessionInfo.sessionName}' session, hosted by{" "}
            {sessionInfo.host}, for registration purposes only.
          </p>
        )}

        {attendee ? (
          <div className="flex justify-center space-x-4 my-4">
            <button
              onClick={exitPageOnSave}
              className="my-4 bg-slate-500 hover:bg-slate-700 text-white text-base rounded-lg py-2.5 px-5 transition-colors w-full text-[19px]"
            >
              Save To Exit Page
            </button>
          </div>
        ) : (
          <div className="flex justify-center space-x-4 my-4">
            <button
              id="buttonDiv"
              className="my-4 bg-slate-500 hover:bg-slate-700 text-white text-base rounded-lg py-2.5 px-5 transition-colors w-full text-[19px]"
            >
              Continue with Google
            </button>
          </div>
        )}

        {!attendee && sessionInfo.expired && (
          <>
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
                either expired or was not meant for you. Please re scan the QR
                code or contact the session's host.
              </div>
            </div>
            <button className="my-4 bg-slate-500 hover:bg-slate-700 text-white text-base rounded-lg py-2.5 px-5 transition-colors w-full text-[19px]">
              Scan QR Code
            </button>
          </>
        )}
        <p className="text-gray-400">
          Interested in Hosting a Session?{" "}
          <Link
            to="/login"
            className="text-sm text-purple-700 hover:text-purple-700"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
export default Home;
