type SearchProps = {
  interClass: string;
};

export default function Search({ interClass }: SearchProps) {
  return (
    <div className="flex items-center w-[160px]">
      <form className="flex items-center justify-center rounded-[10px] bg-[#ECEAEA] dark:bg-gray-800 border border-black border-opacity-50 h-[23px] w-full">
        <button type="submit" className="h-full flex items-center px-1">
          <svg
            className="w-3 h-3 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
        <input
          type="search"
          placeholder="Search"
          className={`h-full w-auto bg-transparent focus:outline-none text-xs text-center font-light dark:text-gray-300 ${interClass}`}
        />
      </form>
    </div>
  );
}
