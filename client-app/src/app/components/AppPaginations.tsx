import { MetaData } from "../models/pagination";

interface Props {
  metaData: MetaData;
  onPageChange: (page: number) => void;
}

function AppPaginations({
  metaData: {
    currentPage,
    pageSize,
    totalCount,
    totalPages,
    hasNext,
    hasPrevious,
  },
  onPageChange,
}: Props) {
  return (
    <>
      <div aria-label="Page navigation">
        <ul
          className="inline-flex space-x-2
           w-full md:w-2/3 flex-wrap items-center justify-start md:justify-start
         "
        >
          {hasPrevious && (
            <li>
              <button
                onClick={() => onPageChange(currentPage - 1)}
                className="
          flex
          items-center
          justify-center
          w-10
          h-10
          text-slate-700
          transition-colors
          duration-150
          rounded-full
          focus:shadow-outline
          hover:bg-slate-200
        "
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </button>
            </li>
          )}
          {pageSize > 0 &&
            Array.from(Array(totalPages).keys()).map((page) => (
              <li key={page}>
                <button
                  onClick={() => onPageChange(page + 1)}
                  className={`${
                    currentPage === page + 1
                      ? "bg-slate-500 text-white"
                      : "bg-white"
                  } flex items-center justify-center w-10 h-10 transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-slate-200`}
                >
                  {page + 1}
                </button>
              </li>
            ))}
          {hasNext && (
            <li>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                className="
          flex
          items-center
          justify-center
          w-10
          h-10
          text-slate-700
          transition-colors
          duration-150
          bg-white
          rounded-full
          focus:shadow-outline
          hover:bg-slate-200
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
            </li>
          )}
        </ul>
      </div>
      <div className="flex items-center justify-center w-full">
        Showing {pageSize * (currentPage - 1) + 1} to {pageSize * currentPage}{" "}
        of {totalCount} {totalCount > 1 ? "entries" : "entry"}
      </div>
    </>
  );
}
export default AppPaginations;
