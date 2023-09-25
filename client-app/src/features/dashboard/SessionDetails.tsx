import { Link, useParams } from "react-router-dom";
import AppPaginations from "../../app/components/AppPaginations";
import AppTableHeader from "../../app/components/AppTableHeader";
import { useEffect, useState } from "react";
import { SessionAttendees } from "../../app/models/session";
import AppLoading from "../../app/components/AppLoading";
import agent from "../../app/api/agent";
import { MetaData } from "../../app/models/pagination";
import { getAxiosParams } from "../../app/utils";

function SessionDetails() {
  const [sessionDetails, setSessionDetails] = useState<SessionAttendees>();
  const [metaData, setMetaData] = useState<MetaData>();
  const [loading, setLoading] = useState(false);
  const [exportType, setExportType] = useState("Excel");

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const sesstionAttendees = async () => {
      try {
        setLoading(true);
        const response = await agent.Attendance.getAttendees(id!);
        setSessionDetails(response.items as unknown as SessionAttendees);
        setMetaData(response.metaData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    sesstionAttendees();
  }, [id]);

  const handlePageChange = async (page: number, pageSize?: number) => {
    const params = getAxiosParams({
      pageNumber: page,
      pageSize: pageSize || metaData!.pageSize,
    });

    try {
      setLoading(true);
      const response = await agent.Attendance.getAttendees(id!, params);
      setSessionDetails(response.items as unknown as SessionAttendees);
      setMetaData(response.metaData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchTerm: string) => {
    const params = getAxiosParams({
      pageNumber: 1,
      pageSize: metaData!.pageSize,
      searchTerm,
    });

    try {
      setLoading(true);
      const response = await agent.Attendance.getAttendees(id!, params);
      setSessionDetails(response.items as unknown as SessionAttendees);
      setMetaData(response.metaData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (exportType: string) => {
    try {
      setLoading(true);
      if (exportType === "Excel") {
        const response = await agent.Attendance.exportToCSV(id!);
        const url = URL.createObjectURL(new Blob([response]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", sessionDetails?.sessionName! + ".csv");
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        const response = await agent.Attendance.exportToPDF(id!);
        const url = URL.createObjectURL(new Blob([response]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", sessionDetails?.sessionName! + ".pdf");
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <AppLoading />;

  return (
    <div
      className="container mx-auto w-full md:w-11/12 "
      style={{ minHeight: "calc(100vh - 6rem)" }}
    >
      <Link
        to="/user-profile/session-history"
        className="flex items-center justify-center w-10 h-10 text-slate-600 transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-gray-100"
      >
        <svg className="w-8 h-8 text-center fill-current" viewBox="0 0 20 20">
          <path
            d="M10.707 10l4.647 4.646a1 1 0 11-1.414 1.414L9.293 11.414a1 1 0 010-1.414L14.94 4.94a1 1 0 111.414 1.414L10.707 10z"
            clipRule="evenodd"
            fillRule="evenodd"
          ></path>
        </svg>
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-center w-full md:w-11/12 mx-auto my-6 mt-2">
        <div className="flex items-center">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-gray-700">
              {sessionDetails?.sessionName}
            </h1>
            <p className="text-sm font-medium text-gray-400">
              {sessionDetails?.status}
            </p>
          </div>
        </div>
        <div className="flex items-center mt-4 md:mt-0">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-gray-700">
              {sessionDetails?.sessionExpiresAt}
            </h1>
            <p className="text-sm font-medium text-gray-400">
              Expires in 2 hours
            </p>
          </div>
        </div>
      </div>

      <div className="w-full md:w-11/12 mx-auto">
        {metaData && (
          <AppTableHeader
            onPageSizeChange={(pageSize) => handlePageChange(1, pageSize)}
            onSearch={(search) => handleSearch(search)}
            metaData={metaData!}
          />
        )}
      </div>

      <div className="bg-white shadow-md rounded my-6 overflow-x-auto w-full md:w-11/12 mx-auto">
        <table className="min-w-max w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">First Name</th>
              <th className="py-3 px-6 text-left">Last Name</th>
              <th className="py-3 px-6 text-center">Email</th>
              <th className="py-3 px-6 text-center">MATNumber</th>
              <th className="py-3 px-6 text-center">Joined At</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {sessionDetails?.attendees.map((attendee, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="font-medium">{attendee.firstName}</span>
                  </div>
                </td>

                <td className="py-3 px-6 text-left whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="font-medium">{attendee.lastName}</span>
                  </div>
                </td>

                <td className="py-3 px-6 text-center whitespace-nowrap">
                  <span className="py-1 px-3 rounded-full text-md font-medium">
                    {attendee.email}
                  </span>
                </td>

                <td className="py-3 px-6 text-center whitespace-nowrap">
                  <span className="py-1 px-3 rounded-full text-md font-medium">
                    {attendee.matNumber}
                  </span>
                </td>

                <td className="py-3 px-6 mx-auto">
                  <div className="flex place-content-center">
                    <div className="mr-2">
                      <img
                        className="w-6 h-6 rounded-full"
                        src="/images/clock.svg"
                      />
                    </div>
                    <span>{attendee.createdAt}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="w-full md:w-11/12 mx-auto">
        {metaData && (
          <AppPaginations
            metaData={metaData!}
            onPageChange={(page) => handlePageChange(page)}
          />
        )}
        <div className="flex w-full justify-end items-center mt-4 md:mt-0">
          <span className="mr-2 text-gray-700">Export to</span>
          <select
            onChange={(e) => setExportType(e.target.value)}
            value={exportType}
            className="border border-gray-300 rounded-md text-gray-600 h-9 pl-5 pr-10 bg-white hover:border-gray-400 focus:outline-none appearance-none"
          >
            <option value={"Excel"}>Excel</option>
            <option value={"PDF"}>PDF</option>
          </select>
          <button
            onClick={() => handleExport(exportType)}
            className="
                ml-2
                flex
                items-center
                justify-center
                w-10
                h-10
                text-indigo-600
                transition-colors
                duration-150
                rounded-full
                focus:shadow-outline
                hover:bg-indigo-100
                "
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
                fillRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
export default SessionDetails;
