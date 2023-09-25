import { Link } from "react-router-dom";
import AppPaginations from "../../app/components/AppPaginations";
import AppTableHeader from "../../app/components/AppTableHeader";
import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import { Session } from "../../app/models/session";
import AppLoading from "../../app/components/AppLoading";
import { MetaData } from "../../app/models/pagination";
import { getAxiosParams } from "../../app/utils";
import { confirmAlert } from "react-confirm-alert";
import { format } from 'date-fns';

function SessionHistory() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(true);
  const [target, setTarget] = useState("");
  const [metaData, setMetaData] = useState<MetaData>();

  useEffect(() => {
    getSessions();
  }, []);

  const getSessions = async () => {
    try {
      setLoading(true);
      const response = await agent.Session.getSessions();
      setSessions(response.items);
      setMetaData(response.metaData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    confirmAlert({
      title: "Confirm to delete",
      message:
        "Are you sure to delete this session? This action cannot be undone.",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              setDeleteLoading(true);
              setTarget(sessionId);
              await agent.Session.deleteSession(sessionId);
              getSessions();
            } catch (error) {
              console.log(error);
            } finally {
              setDeleteLoading(false);
              setTarget("");
            }
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const handlePageChange = async (page: number, pageSize?: number) => {
    const params = getAxiosParams({
      pageNumber: page,
      pageSize: pageSize || metaData!.pageSize,
    });

    try {
      setLoading(true);
      const response = await agent.Session.getSessions(params);
      setSessions(response.items);
      setMetaData(response.metaData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (search: string) => {
    const params = getAxiosParams({
      searchTerm: search,
      pageNumber: 1,
      pageSize: metaData!.pageSize,
    });

    try {
      setLoading(true);
      const response = await agent.Session.getSessions(params);
      setSessions(response.items);
      setMetaData(response.metaData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <AppLoading />;

  return (
    <div className="container mx-auto w-full md:w-11/12">
      {metaData && (
        <AppTableHeader
          onPageSizeChange={(pageSize) => handlePageChange(1, pageSize)}
          onSearch={(search) => handleSearch(search)}
          metaData={metaData!}
        />
      )}
      <div className="bg-white shadow-md rounded my-6 overflow-x-auto">
        <table className="min-w-max w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left w-1/3 ">Session</th>
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
                    <span className="font-medium">
                      {session.sessionName.length > 35 ? (
                        <span>{session.sessionName.slice(0, 35)}...</span>
                      ) : (
                        session.sessionName
                      )}
                    </span>
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
                    <span> {format(new Date(session.sessionExpiresAt), 'MMMM, EEEE do, h:mm a')} </span>
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
                        : session.attendeesCount}
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
                    <Link
                      to={`/user-profile/generate-qr-code/${session.sessionId}`}
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
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </Link>
                    <div
                      onClick={() => {
                        handleDeleteSession(session.sessionId);
                      }}
                      className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110"
                    >
                      {deleteLoading && target == session.sessionId ? (
                        <div className="h-5 w-5 border-t-transparent border-solid animate-spin rounded-full border-slate-500 border-2"></div>
                      ) : (
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
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {metaData && (
        <AppPaginations
          metaData={metaData}
          onPageChange={(page) => handlePageChange(page)}
        />
      )}
    </div>
  );
}
export default SessionHistory;
