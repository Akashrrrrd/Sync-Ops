"use client"

import { useState } from "react"
import { marked } from "marked"
import DOMPurify from "dompurify"
import "./DataInsights.css"

const DataInsights = () => {
  const [dataFile, setDataFile] = useState(null)
  const [fileContent, setFileContent] = useState(null)
  const [filePreview, setFilePreview] = useState(null)
  const [insights, setInsights] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const API_KEY = "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"

  const ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "text/plain",
    "text/csv",
    "application/pdf",
  ]

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        setError(`Unsupported file type: ${file.type}. Please upload an image, PDF, or text file.`)
        return
      }
      setDataFile(file)
      processFile(file)
      setError(null)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files[0]
    if (file) {
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        setError(`Unsupported file type: ${file.type}. Please upload an image, PDF, or text file.`)
        return
      }
      setDataFile(file)
      processFile(file)
      setError(null)
    }
  }

  const processFile = async (file) => {
    // For text files, read the content directly
    if (file.type.startsWith("text/")) {
      const text = await readFileAsText(file)
      setFileContent(text)
      setFilePreview(null)
    }
    // For images, create a preview URL and describe the image
    else if (file.type.startsWith("image/")) {
      const previewUrl = URL.createObjectURL(file)
      setFilePreview(previewUrl)
      setFileContent(`[This is an image file: ${file.name}, type: ${file.type}, size: ${formatFileSize(file.size)}]`)
    }
    // For PDFs, just note it's a PDF (we can't easily extract text without additional libraries)
    else if (file.type === "application/pdf") {
      setFilePreview(null)
      setFileContent(`[This is a PDF file: ${file.name}, size: ${formatFileSize(file.size)}]`)
    }
  }

  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => resolve(event.target.result)
      reader.onerror = (error) => reject(error)
      reader.readAsText(file)
    })
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  const analyzeFileWithPerplexity = async () => {
    if (!dataFile) {
      setError("Please upload a file to analyze.")
      return
    }

    if (!API_KEY) {
      setError("Perplexity API key is missing. Please provide a valid key.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Create a description of the file for the API
      const fileDescription = `File name: ${dataFile.name}
File type: ${dataFile.type}
File size: ${formatFileSize(dataFile.size)}
${fileContent ? `\nFile content: ${fileContent.substring(0, 15000)}` : ""}`

      const response = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "sonar",
          messages: [
            {
              role: "system",
              content:
                "You are an expert data analyst that provides comprehensive analysis of files. Use clear, structured Markdown formatting in your responses.",
            },
            {
              role: "user",
              content: `Provide a comprehensive and detailed analysis of this file. Use clear, structured Markdown formatting.\n\n${fileDescription}`,
            },
          ],
          temperature: 0.4,
          max_tokens: 2048,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API request failed: ${errorText}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error.message || "API request failed")
      }

      const perplexityResponse = data.choices[0].message.content

      const sanitizedHTML = DOMPurify.sanitize(marked(perplexityResponse))
      setInsights({ markdown: sanitizedHTML })
      setIsLoading(false)
    } catch (error) {
      console.error("Analysis error:", error)
      setError(`Failed to analyze file: ${error.message}`)
      setIsLoading(false)
    }
  }

  return (
    <div className="data-data-insights">
      <div className="data-header">
        <h1>AI-Powered File Analysis</h1>
        <p>Upload images, PDFs, or text files for comprehensive AI analysis</p>
      </div>

      <div
        className="data-upload-area"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-upload").click()}
      >
        <svg
          className="data-upload-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p>{dataFile ? dataFile.name : "Drag and drop supported files here or click to browse"}</p>
        <input
          id="file-upload"
          type="file"
          onChange={handleFileUpload}
          className="data-hidden"
          accept=".jpg,.jpeg,.png,.gif,.webp,.txt,.csv,.pdf"
        />
      </div>

      {filePreview && (
        <div className="data-file-preview">
          <img src={filePreview || "/placeholder.svg"} alt="File preview" className="data-preview-image" />
        </div>
      )}

      <button
        className={`data-generate-button ${isLoading ? "loading" : ""} ${!dataFile ? "disabled" : ""}`}
        onClick={analyzeFileWithPerplexity}
        disabled={isLoading || !dataFile}
      >
        {isLoading ? "Analyzing File..." : "Analyze File"}
      </button>

      {error && <div className="data-error">{error}</div>}

      {insights && (
        <div className="data-insights-container">
          <div className="data-markdown-output">
            <h2>Analysis Result</h2>
            <div dangerouslySetInnerHTML={{ __html: insights.markdown }}></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataInsights
