import { useState } from "react";
import { Upload, X, File } from "lucide-react";

const FileUpload = ({ 
  label = "Upload File", 
  accept = "image/*",
  onChange,
  maxSize = 5,
  showPreview = true 
}) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError("");

    if (selectedFile) {
      const fileSizeMB = selectedFile.size / 1024 / 1024;
      if (fileSizeMB > maxSize) {
        setError(`Ukuran file maksimal ${maxSize}MB`);
        return;
      }

      setFile(selectedFile);
      
      // Preview
      if (selectedFile.type.startsWith('image/') && showPreview) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      }

      if (onChange) {
        onChange(selectedFile);
      }
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setError("");
    if (onChange) {
      onChange(null);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-typo text-sm font-medium">{label}</label>
      
      {!file ? (
        <label className="bg-typo-white2 rounded-md px-4 py-8 border-2 border-dashed border-typo-outline hover:border-primary cursor-pointer transition-colors">
          <div className="flex flex-col items-center justify-center space-y-2">
            <Upload className="text-typo-icon" size={32} />
            <p className="text-sm text-typo-secondary">
              Klik untuk upload atau drag & drop
            </p>
            <p className="text-xs text-typo-icon">
              Maksimal {maxSize}MB
            </p>
          </div>
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      ) : (
        <div className="bg-typo-white2 rounded-md p-4 border border-typo-outline">
          {preview ? (
            // Preview
            <div className="relative">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full h-48 object-cover rounded-md"
              />
              <button
                onClick={handleRemove}
                className="absolute top-2 right-2 bg-critical text-typo-white rounded-full p-1 hover:bg-critical-70"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <File className="text-typo-icon" size={24} />
                <div>
                  <p className="text-sm font-medium text-typo">{file.name}</p>
                  <p className="text-xs text-typo-icon">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemove}
                className="text-critical hover:text-critical-70"
              >
                <X size={20} />
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-critical">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;