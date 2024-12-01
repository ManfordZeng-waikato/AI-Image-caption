import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const MultiImageUpload = () => {
  const [files, setFiles] = useState([]);
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const onDrop = (acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, { preview: URL.createObjectURL(file), caption: "", status: "" })
    );
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const generateCaption = (index) => {
    const updatedFiles = [...files];
    updatedFiles[index].caption = `This is an example caption for ${updatedFiles[index].name}`;
    setFiles(updatedFiles);
  };

  const updateStatus = (index, status) => {
    const updatedFiles = [...files];
    updatedFiles[index].status = status;
    setFiles(updatedFiles);

    // Add to history
    setHistory((prevHistory) => [
      ...prevHistory,
      {
        file: updatedFiles[index],
        caption: updatedFiles[index].caption,
        status,
      },
    ]);
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const downloadJSON = () => {
    const jsonContent = JSON.stringify(files, null, 2); // Pretty print JSON
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "imageDetails.json"; // File name for download
    a.click();

    URL.revokeObjectURL(url); // Clean up the URL object
  };

  return (
    <div
      style={{
        backgroundColor: darkMode ? "#333" : "#fff",
        color: darkMode ? "#fff" : "#000",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      {/* Toggle Dark/Light Mode */}
      <button
        onClick={toggleTheme}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          cursor: "pointer",
          backgroundColor: darkMode ? "#555" : "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
        }}
      >
        {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </button>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        style={{
          padding: "20px",
          border: `2px dashed ${isDragActive ? "#007BFF" : "#ccc"}`,
          borderRadius: "10px",
          backgroundColor: isDragActive ? "#f0f8ff" : darkMode ? "#444" : "#fff",
          textAlign: "center",
          cursor: "pointer",
          transition: "0.2s",
        }}
      >
        <input {...getInputProps()} />
        <p
          style={{
            color: darkMode ? "#fff" : "#000",
          }}
        >
          Drag and drop files here, or click to select files
        </p>
      </div>

      {/* Uploaded Images */}
      <div
        style={{
          marginTop: "20px",
          display: "grid",
          gap: "20px",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        }}
      >
        {files.map((file, index) => (
          <div
            key={index}
            style={{
              border: "2px solid #ccc",
              borderRadius: "10px",
              backgroundColor: darkMode ? "#444" : "#f9f9f9",
              padding: "10px",
            }}
          >
            {/* Image Preview */}
            <img
              src={file.preview}
              alt={`preview-${index}`}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "contain",
                borderRadius: "5px",
              }}
            />
            <div style={{ marginTop: "10px" }}>
              <h4 style={{ color: darkMode ? "#fff" : "#000" }}>Caption:</h4>
              <p>{file.caption || "No caption generated yet."}</p>
            </div>
            {!file.caption && (
              <button
                onClick={() => generateCaption(index)}
                style={{
                  marginTop: "10px",
                  padding: "10px 20px",
                  cursor: "pointer",
                  backgroundColor: "#007BFF",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                Generate Caption
              </button>
            )}
            {file.caption && !file.status && (
              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={() => updateStatus(index, "Approved")}
                  style={{
                    marginRight: "10px",
                    padding: "10px 20px",
                    cursor: "pointer",
                    backgroundColor: "#28a745",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                  }}
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus(index, "Rejected")}
                  style={{
                    padding: "10px 20px",
                    cursor: "pointer",
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                  }}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* History Section */}
      <div style={{ marginTop: "40px" }}>
        <h2>History</h2>
        {history.length === 0 ? (
          <p style={{ color: darkMode ? "#ccc" : "#666" }}>No history available yet.</p>
        ) : (
          <div>
            {history.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: "10px",
                  marginBottom: "10px",
                  alignItems: "center",
                }}
              >
                <img
                  src={item.file.preview}
                  alt="history-preview"
                  style={{ width: "80px", borderRadius: "5px" }}
                />
                <div>
                  <p><strong>Caption:</strong> {item.caption}</p>
                  <p><strong>Status:</strong> {item.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Download JSON Button */}
      <button
        onClick={downloadJSON}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          cursor: "pointer",
          backgroundColor: darkMode ? "#555" : "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Download JSON
      </button>
    </div>
  );
};

export default MultiImageUpload;
