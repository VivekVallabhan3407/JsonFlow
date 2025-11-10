import React, { useEffect, useState } from "react";
import "./JsonEditor.css";
import { ToastContainer, toast } from "react-toastify"; // ✅ Import Toastify

const JsonEditor: React.FC = () => {
    const [jsonText, setJsonText] = useState<string>("");
    const [parsedJson, setParsedJson] = useState<object | null>(null);
    const [theme, setTheme] = useState<"light" | "dark">(
        (localStorage.getItem("theme") as "light" | "dark") || "light"
    );
    const [fileName, setFileName] = useState<string>("");
    // 🧠 Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("jsonFlowData");
        if (saved) setJsonText(saved);

        document.body.setAttribute("data-theme", theme);
    }, []);

    // 💾 Save to localStorage on every change
    useEffect(() => {
        localStorage.setItem("jsonFlowData", jsonText);
    }, [jsonText]);

    // 🌗 Toggle theme
    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.body.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme); // ✅ remember theme
        toast.info(`Switched to ${newTheme} mode 🌗`, { autoClose: 1500 });
    };

    // ✅ Format JSON
    const handleParse = () => {
        try {
            const parsed = JSON.parse(jsonText);
            setParsedJson(parsed);
            setJsonText(JSON.stringify(parsed, null, 2));
            toast.success("✅ JSON formatted successfully!", { autoClose: 1500 });
        } catch (e: any) {
            toast.error(`❌ Invalid JSON: ${e.message}`, { autoClose: 2500 });
            setParsedJson(null);
        }
    };

    // 🧹 Clear
    const handleClear = () => {
        setJsonText("");
        setParsedJson(null);
        localStorage.removeItem("jsonFlowData");
        toast.info("🧹 Cleared JSON input.", { autoClose: 1200 });
    };

    // ⬆️ Upload file
    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            setFileName(file.name);
            setJsonText(text);

            try {
                const parsed = JSON.parse(text);
                setParsedJson(parsed);
                setJsonText(JSON.stringify(parsed, null, 2));
                toast.success(`📂 Loaded & formatted: ${file.name}`, { autoClose: 1500 });
            } catch (err) {
                setParsedJson(null);
                toast.error(`⚠️ Invalid JSON in file: ${file.name}`, { autoClose: 2000 });
            }
        };
        reader.readAsText(file);
    };

    // ⬇️ Download file
    const handleDownload = () => {
        if (!parsedJson) {
            toast.warn("⚠️ Nothing to download!", { autoClose: 1500 });
            return;
        }
        const blob = new Blob([JSON.stringify(parsedJson, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "formatted.json";
        a.click();
        URL.revokeObjectURL(url);
        toast.success("💾 Download started!", { autoClose: 1500 });
    };

    // 📋 Copy JSON
    const handleCopy = () => {
        if (!parsedJson) {
            toast.warn("⚠️ Nothing to copy!", { autoClose: 1500 });
            return;
        }
        navigator.clipboard.writeText(JSON.stringify(parsedJson, null, 2));
        toast.success("📋 Copied to clipboard!", { autoClose: 1200 });
    };

    return (
        <div className={`editor-container ${theme}`}>
            <div className="top-bar">
                <h2>JSONFlow — JSON Formatter</h2>
                <button onClick={toggleTheme} className="theme-toggle">
                    {theme === "light" ? "🌙 Dark" : "☀️ Light"}
                </button>
            </div>

            <textarea
                className="json-input"
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                placeholder="Paste or write your JSON here..."
            ></textarea>

            {fileName && (
                <p className="file-info">
                    Loaded file: <strong>{fileName}</strong>{" "}
                    {parsedJson ? (
                        <span className="status success">✅ Auto-formatted</span>
                    ) : (
                        <span className="status error">⚠️ Invalid JSON — please fix and format</span>
                    )}
                </p>
            )}

            <div className="button-group">
                <button onClick={handleParse}>Format</button>
                <button onClick={handleClear} className="clear-btn">Clear</button>
                <button onClick={handleDownload}>Download</button>
                <label className="upload-btn">
                    Upload <input type="file" accept=".json" onChange={handleUpload} hidden />
                </label>
                {fileName && (
                    <button className="delete-btn" onClick={() => {
                        setFileName("");
                        setJsonText("");
                        setParsedJson(null);
                        localStorage.removeItem("jsonFlowData");
                        toast.info(`🗑️ Removed file: ${fileName}`, { autoClose: 1500 });
                    }}>
                        Delete File
                    </button>
                )}

            </div>

            {parsedJson && (
                <div className="output-section">
                    <div className="output-header">
                        <h3>Formatted Output</h3>
                        <button className="copy-btn" onClick={handleCopy}>📋 Copy</button>
                    </div>
                    <pre className="json-output">{JSON.stringify(parsedJson, null, 2)}</pre>
                </div>
            )}

            {/* ✅ Toastify container */}
            <ToastContainer position="top-right" theme={theme} />
        </div>
    );
};

export default JsonEditor;
