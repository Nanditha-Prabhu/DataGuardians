function AccessData() {
  return (
    <>
      <form className=" border-4 m-7 p-7">
        <div className=" font-semibold text-2xl">Access the Data</div>
        <div className="sm:col-span-3">
          <label
            htmlFor="file-name"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            File name
          </label>
          <div className="mt-2">
            <select
              id="file-name"
              name="file-name"
              autoComplete="file-name"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
            >
              <option>United States</option>
              <option>Canada</option>
              <option>Mexico</option>
            </select>
          </div>
        </div>

        <div className="sm:col-span-3">
          <label
            htmlFor="anonymizable-data"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Data to be anonymized
          </label>
          <div className="mt-2">
            <select
              id="anonymizable-data"
              name="anonymizable-data"
              autoComplete="anonymizable-data"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
            >
              <option>United States</option>
              <option>Canada</option>
              <option>Mexico</option>
            </select>
          </div>
        </div>

        <a
          class="group inline-block rounded bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px] hover:text-white focus:outline-none focus:ring active:text-opacity-75"
          href="#"
        >
          <span class="block rounded-sm bg-white px-8 py-3 text-sm font-medium group-hover:bg-transparent">
            Submit
          </span>
        </a>
      </form>
    </>
  );
}

export default AccessData;
