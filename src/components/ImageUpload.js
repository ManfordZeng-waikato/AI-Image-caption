import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const ImageUpload = () => {
  const [files, setFiles] = useState([]);
  const [caption, setCaption] = useState("");
  const [status, setStatus] = useState("");
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const onDrop = (acceptedFiles) => {
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      )
    );
    setCaption("");
    setStatus("");
  };

  const generateCaption = () => {
    if (files.length > 0) {
      const fileName = files[0].name;
      setCaption(`This is an example caption for ${fileName}`);
      setStatus("");
    }
  };

  const approveCaption = () => {
    setStatus("Approved");
    setHistory([...history, { file: files[0], caption, status: "Approved" }]);
  };

  const rejectCaption = () => {
    setStatus("Rejected");
    setHistory([...history, { file: files[0], caption, status: "Rejected" }]);
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

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

      {/* Uploaded Image and Caption Section */}
      {files.length > 0 && (
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            gap: "20px",
            justifyContent: "center",
          }}
        >
          {/* Image Section with Box */}
          <div
            style={{
              flex: "1",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "2px solid #ccc",
              borderRadius: "10px",
              backgroundColor: darkMode ? "#444" : "#f9f9f9",
              padding: "10px",
              height: "300px",
              width: "300px", // Ensure both boxes have the same width
            }}
          >
            <img
              src={files[0].preview}
              alt="preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: "5px",
              }}
            />
          </div>

          {/* Caption Section with Box */}
          <div
            style={{
              flex: "1",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              border: "2px solid #ccc",
              borderRadius: "10px",
              backgroundColor: darkMode ? "#555" : "#f9f9f9",
              padding: "10px",
              height: "300px", // Same height as image box
              width: "300px", // Same width as image box
            }}
          >
            <h3 style={{ color: darkMode ? "#fff" : "#000", textAlign: "center" }}>Caption:</h3>
            <p style={{ color: darkMode ? "#fff" : "#000", textAlign: "center" }}>{caption}</p>
            <div style={{ marginTop: "10px" }}>
              <button
                onClick={approveCaption}
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
                onClick={rejectCaption}
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
          </div>
        </div>
      )}

      {/* Generate Caption Button */}
      {files.length > 0 && !caption && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button
            onClick={generateCaption}
            style={{
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
        </div>
      )}

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

      {/* Download Button */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          onClick={() => {
            const data = history.map(item => ({
              fileName: item.file.name,
              caption: item.caption,
              status: item.status,
            }));
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "captions-history.json";
            link.click();
          }}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Download History
        </button>
      </div>
    </div>
  );
};

export default ImageUpload;
