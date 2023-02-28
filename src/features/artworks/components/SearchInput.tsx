export default function SearchInput() {
  return (
    <div className="relative">
      <input
        type="search"
        className="bg-purple-white shadow rounded border-0 p-3 w-full"
        placeholder="Search something..."
      />
      <button
        aria-label="search"
        className="absolute top-[50%] right-3 md:right-7 -translate-y-2/4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </button>
    </div>
  );
}
