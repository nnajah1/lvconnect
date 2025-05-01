import { useState } from 'react';
import { IoMdCloudUpload } from 'react-icons/io';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsFileEarmarkPdf } from 'react-icons/bs';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    document.getElementById('fileInput').value = '';
  };

  const handleUpload = () => {
    if (selectedFile) {
      console.log('Uploading:', selectedFile.name);
      // Dynamic logic goes here
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="p-6 max-w-xl w-full bg-white rounded-md shadow border border-gray-300">
        <h2 className="text-lg font-medium mb-4">Upload Files</h2>

        <label
          htmlFor="fileInput"
          className="w-full mt-5 h-32 border-2 border-dashed border-[#1E77CC] rounded-md flex flex-col items-center justify-center cursor-pointer mb-4"
        >
          <IoMdCloudUpload className="text-3xl" style={{ color: '#1E77CC' }} />
          <span className="mt-2 text-sm font-medium">Browse Files to upload</span>
          <span className="text-xs text-gray-400">PDF formats</span>
          <input
            id="fileInput"
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        <div className="flex items-center justify-between border rounded px-3 py-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <BsFileEarmarkPdf className="text-blue-500 text-lg" />
            <span className="truncate">
              {selectedFile ? selectedFile.name : 'No selected File -'}
            </span>
          </div>
          {selectedFile && (
            <button onClick={handleRemoveFile}>
              <AiOutlineDelete className="text-red-500 text-lg" />
            </button>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={handleUpload}
            className="px-4 py-1 rounded bg-[#2CA4DD] text-white hover:bg-[#2396c7]"
          >
            Upload
          </button>
          <button className="px-4 py-1 rounded border border-gray-300 hover:bg-gray-100">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
