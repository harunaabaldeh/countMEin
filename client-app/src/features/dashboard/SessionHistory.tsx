import { Link } from "react-router-dom";
import AppPaginations from "../../app/components/AppPaginations";
import AppTableHeader from "../../app/components/AppTableHeader";
import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import { Session } from "../../app/models/session";
import AppLoading from "../../app/components/AppLoading";

function SessionHistory() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSessions();
  }, []);

  const getSessions = async () => {
    try {
      setLoading(true);
      const response: Session[] = await agent.Session.getSessions();
      console.log(response);
      setSessions(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <AppLoading />;

  return (
    <div className="container mx-auto w-full md:w-11/12">
      <AppTableHeader />
      <div className="bg-white shadow-md rounded my-6 overflow-x-auto">
        <table className="min-w-max w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Session</th>
              <th className="py-3 px-6 text-left">Expiration Date</th>
              <th className="py-3 px-6 text-center">Attendees</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {sessions.map((session, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="font-medium">{session.sessionName}</span>
                  </div>
                </td>
                <td className="py-3 px-6 text-left">
                  <div className="flex items-center">
                    <div className="mr-2">
                      <img
                        className="w-6 h-6 rounded-full"
                        src="/images/clock.svg"
                      />
                    </div>
                    <span> {session.sessionExpiresAt} </span>
                  </div>
                </td>
                <td className="py-3 px-6 text-center">
                  <div className="flex items-center justify-center">
                    <img
                      className="w-6 h-6 rounded-full border-gray-200 border transform hover:scale-125"
                      src="https://randomuser.me/api/portraits/men/1.jpg"
                    />
                    <img
                      className="w-6 h-6 rounded-full border-gray-200 border -m-1 transform hover:scale-125"
                      src="https://randomuser.me/api/portraits/women/2.jpg"
                    />
                    <img
                      className="object-cover w-6 h-6 -mx-1 border-2 border-white rounded-full dark:border-gray-700 shrink-0"
                      src="https://randomuser.me/api/portraits/men/3.jpg"
                    />
                    <p className="flex items-center justify-center w-8 h-8 -mx-1 text-xs text-slate-700 bg-gray-200 border-2 border-white rounded-full">
                      {session.attendeesCount > 3
                        ? `+${session.attendeesCount - 3}`
                        : "+0"}
                    </p>
                  </div>
                </td>
                <td className="py-3 px-6 text-center">
                  <span className="bg-purple-200 text-purple-600 py-1 px-3 rounded-full text-xs">
                    {session.status}
                  </span>
                </td>
                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-center">
                    <Link
                      to={`/session-details/${session.sessionId}`}
                      className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </Link>
                    <div className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </div>
                    <div className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 md:flex md:items-center md:justify-between">
        <AppPaginations />
      </div>
    </div>
  );
}
export default SessionHistory;
