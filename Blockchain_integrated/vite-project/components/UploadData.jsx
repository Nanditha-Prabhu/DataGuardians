import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";

function UploadData() {
  const [file, setFile] = useState(null);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };

  const handleFileSubmit = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3001/upload", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        console.log("File uploaded successfully!");
      } else {
        console.error("File upload failed!");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <>
      {/* <form className=" border-4 m-7 p-7">
        <div className=" font-semibold text-2xl">Upload Data</div>
        <div className="col-span-full">
          <label
            htmlFor="cover-photo"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Upload a file
          </label>
          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 mx-10 my-10">
            <div className="text-center">
              <PhotoIcon
                className="mx-auto h-12 w-12 text-gray-300"
                aria-hidden="true"
              />
              <div className="mt-4 flex text-sm leading-6 text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileUpload}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs leading-5 text-gray-600">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
        </div>

        <button
          class="group inline-block rounded bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px] hover:text-white focus:outline-none focus:ring active:text-opacity-75"
          href="#"
          onClick={handleFileSubmit}
        >
          <span class="block rounded-sm bg-white px-8 py-3 text-sm font-medium group-hover:bg-transparent">
            Upload
          </span>
        </button>
      </form> */}

      <div>
        <input type="file" onChange={handleFileUpload} />
        <button onClick={handleFileSubmit}>Upload File</button>
      </div>
    </>
  );
}

export default UploadData;
