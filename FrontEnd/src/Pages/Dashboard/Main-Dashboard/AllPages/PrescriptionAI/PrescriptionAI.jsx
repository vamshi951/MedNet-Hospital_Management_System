import React, { useState } from "react";
import Sidebar from "../../GlobalFiles/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./PrescriptionAI.css";

const notify = (text) => toast(text);

const PrescriptionAI = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    const type = selected.type;
    if (!type.startsWith("image/") && type !== "application/pdf") {
      return notify("Please upload an image or PDF file only.");
    }
    setFile(selected);
    setFileType(type);
    setResult(null);
    if (type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selected);
    } else {
      setPreview(null);
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleAnalyze = async () => {
    if (!file) return notify("Please upload a prescription first.");
    setLoading(true);
    setResult(null);
    try {
      const base64 = await toBase64(file);
      const isImage = fileType.startsWith("image/");

      let promptText = `You are a medical assistant. Analyze this prescription and provide:

1. **Prescription Summary**: List all medications, dosages, and frequency mentioned.
2. **Conditions/Diagnosis**: What condition(s) is this prescription treating?
3. **Health Suggestions**: Provide practical lifestyle and dietary suggestions to help cure or manage the condition.
4. **Precautions**: Important things the patient should avoid or be careful about.
5. **Follow-up**: When should the patient follow up with their doctor?

Please be clear, concise, and easy to understand for a general patient.`;

      let messages;

      if (isImage) {
        messages = [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:${fileType};base64,${base64}`
                }
              },
              {
                type: "text",
                text: promptText
              }
            ]
          }
        ];
      } else {
        messages = [
          {
            role: "user",
            content: `${promptText}\n\nNote: A PDF prescription was uploaded but I cannot read it directly. Please note that PDF analysis requires text extraction. Ask the user to upload an image of the prescription instead for best results.`
          }
        ];
      }

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.REACT_APP_GROQ_KEY}`
        },
        body: JSON.stringify({
          model: "meta-llama/llama-4-scout-17b-16e-instruct",
          max_tokens: 1000,
          messages: messages
        }),
      });

      const data = await response.json();
      console.log("Groq response:", data);
      const text = data.choices?.[0]?.message?.content;
      if (text) {
        setResult(text);
      } else {
        console.error("API Error:", data);
        notify("Could not analyze prescription. Please try again.");
      }
    } catch (err) {
      console.error(err);
      notify("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const formatResult = (text) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**"))
        return <h3 key={i} className="ai-heading">{line.replace(/\*\*/g, "")}</h3>;
      if (line.startsWith("**"))
        return <p key={i} className="ai-bold">{line.replace(/\*\*/g, "")}</p>;
      if (line.startsWith("- ") || line.startsWith("• "))
        return <li key={i} className="ai-list-item">{line.substring(2)}</li>;
      if (line.trim() === "") return <br key={i} />;
      return <p key={i} className="ai-text">{line}</p>;
    });
  };

  return (
    <div className="container">
      <ToastContainer />
      <Sidebar />
      <div className="AfterSideBar">
        <h1 className="ai-title">AI Prescription Analyzer</h1>
        <p className="ai-subtitle">Upload a prescription image to get a summary and health suggestions.</p>
        <div className="ai-upload-card">
          <div className="ai-upload-area" onClick={() => document.getElementById("fileInput").click()}>
            {preview ? (
              <img src={preview} alt="Preview" className="ai-preview-img" />
            ) : (
              <div className="ai-upload-placeholder">
                <span className="ai-upload-icon">📄</span>
                <p>{file ? `✅ ${file.name}` : "Click to upload prescription"}</p>
                <p className="ai-upload-hint">Supports JPG, PNG (PDF supported but image recommended)</p>
              </div>
            )}
          </div>
          <input id="fileInput" type="file" accept="image/*,application/pdf" style={{ display: "none" }} onChange={handleFileChange} />
          {file && (
            <div className="ai-file-info">
              <span>📎 {file.name}</span>
              <button className="ai-clear-btn" onClick={() => { setFile(null); setPreview(null); setResult(null); }}>✕ Remove</button>
            </div>
          )}
          <button className="ai-analyze-btn" onClick={handleAnalyze} disabled={!file || loading}>
            {loading ? "🔍 Analyzing..." : "🔍 Analyze Prescription"}
          </button>
        </div>
        {loading && (
          <div className="ai-loading">
            <div className="ai-spinner"></div>
            <p>AI is analyzing your prescription...</p>
          </div>
        )}
        {result && (
          <div className="ai-result-card">
            <h2>📋 Analysis Result</h2>
            <div className="ai-result-content">{formatResult(result)}</div>
            <button className="ai-print-btn" onClick={() => window.print()}>🖨️ Print Result</button>
          </div>
        )}
        <div className="ai-disclaimer">
          ⚠️ <strong>Disclaimer:</strong> This AI analysis is for informational purposes only and does not replace professional medical advice. Always consult your doctor.
        </div>
      </div>
    </div>
  );
};

export default PrescriptionAI;
