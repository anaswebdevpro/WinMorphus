import React, { useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import Card from "../../../Component/ui/Card";
import Button from "../../../Component/ui/Button";
import { apiRequest } from "../../../Services/Api";
import { UPLOAD_DOCUMENT } from "../../../Api/Api_variables";
import { useAuth } from "../../../Context/UseAuth";
import { enqueueSnackbar } from "notistack";

// API field mapping
const getApiFieldName = (type) => {
  switch (type) {
    case "government_id_front":
      return "add_proof_f";
    case "government_id_back":
      return "add_proof_b";
    case "proof_of_address":
      return "file";
    default:
      return "file";
  }
};

const getApiTypeValue = (type) => {
  switch (type) {
    case "government_id_front":
      return "add_proof_f";
    case "government_id_back":
      return "add_proof_b";
    case "proof_of_address":
      return "add_proof_address";
    default:
      return "add_proof_b";
  }
};

const KYCVerification = ({ profileData }) => {
  const { token } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const kycDocuments = profileData?.kycDocuments || [];

  // Handle file selection
  const handleFileSelect = (e, type) => {
    const file = e.target.files?.[0];
    if (file) {
      const newDocument = {
        file,
        type,
        name: file.name,
      };
      setSelectedFiles((prev) => [
        ...prev.filter((doc) => doc.type !== type),
        newDocument,
      ]);
    }
  };

  // Handle upload button click
  const handleUploadClick = (type) => {
    const input = document.getElementById(type);
    if (input) {
      input.click();
    }
  };

  // Remove selected file
  const removeFile = (type) => {
    setSelectedFiles((prev) => prev.filter((doc) => doc.type !== type));
  };

  // Upload all selected documents at once
  const handleUploadDocuments = async () => {
    if (selectedFiles.length === 0) {
      enqueueSnackbar("Please select at least one document to upload", {
        variant: "warning",
      });
      return;
    }

    if (uploading) {
      enqueueSnackbar("Please wait, upload is in progress", {
        variant: "warning",
      });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();

      // Add type field (required by API) - use the first document's type
      formData.append("type", getApiTypeValue(selectedFiles[0].type));

      // Add all files with their correct API field names
      selectedFiles.forEach((doc) => {
        formData.append(getApiFieldName(doc.type), doc.file);
      });

      const response = await apiRequest({
        endpoint: UPLOAD_DOCUMENT,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: formData,
      });

      console.log("Upload response:", response);

      // Check if response is null (unexpected error)
      if (!response) {
        enqueueSnackbar("Failed to upload documents. Please try again.", {
          variant: "error",
        });
        return;
      }

      // Check if it's a success response
      if (response?.success === true) {
        enqueueSnackbar("All documents uploaded successfully!", {
          variant: "success",
        });
        // Clear all selected files
        setSelectedFiles([]);
        // Reset all file inputs
        const inputs = document.querySelectorAll('input[type="file"]');
        inputs.forEach((input) => (input.value = ""));
      } else {
        // Handle error response - extract the message
        const errorMessage = response?.message || "Upload failed";
        console.log("Error message from API:", errorMessage);
        enqueueSnackbar(errorMessage, { variant: "error" });

        // If it's an "already uploaded" error, clear the files
        if (errorMessage.includes("already uploaded")) {
          setSelectedFiles([]);
          const inputs = document.querySelectorAll('input[type="file"]');
          inputs.forEach((input) => (input.value = ""));
        }
      }
    } catch (error) {
      console.error("Document upload failed:", error);

      // Handle different types of errors
      if (error && typeof error === "object" && "response" in error) {
        const errorMessage =
          error.response?.data?.message ||
          "Failed to upload documents. Please try again.";
        console.log("API Error:", error.response?.data);
        console.log("Error response data:", error.response?.data);
        console.log("Error message:", errorMessage);
        enqueueSnackbar(errorMessage, { variant: "error" });

        // If it's an "already uploaded" error, clear the files
        if (errorMessage.includes("already uploaded")) {
          setSelectedFiles([]);
          const inputs = document.querySelectorAll('input[type="file"]');
          inputs.forEach((input) => (input.value = ""));
        }
      } else {
        // Handle other types of errors
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to upload documents. Please try again.";
        enqueueSnackbar(errorMessage, { variant: "error" });
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Required Documents */}
      <Card
        title="Required Documents"
        subtitle="Upload the following documents for verification"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Government ID */}
            <div className="border border-slate-700 bg-slate-800/50 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">Government ID</h4>
              <p className="text-sm text-gray-400 mb-4">
                Driver's license, passport, or national ID card
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Front side</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      id="government_id_front"
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={(e) =>
                        handleFileSelect(e, "government_id_front")
                      }
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        onClick={() => handleUploadClick("government_id_front")}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Select File
                      </Button>
                      {selectedFiles.find(
                        (f) => f.type === "government_id_front"
                      ) && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-400 bg-slate-700 px-2 py-1 rounded">
                            {
                              selectedFiles.find(
                                (f) => f.type === "government_id_front"
                              )?.name
                            }
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFile("government_id_front")}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Back side</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      id="government_id_back"
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={(e) =>
                        handleFileSelect(e, "government_id_back")
                      }
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        onClick={() => handleUploadClick("government_id_back")}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Select File
                      </Button>
                      {selectedFiles.find(
                        (f) => f.type === "government_id_back"
                      ) && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-400 bg-slate-700 px-2 py-1 rounded">
                            {
                              selectedFiles.find(
                                (f) => f.type === "government_id_back"
                              )?.name
                            }
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFile("government_id_back")}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Proof of Address */}
            <div className="border border-slate-700 bg-slate-800/50 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">Proof of Address</h4>
              <p className="text-sm text-gray-400 mb-4">
                Utility bill, bank statement, or government document (less than
                3 months old)
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Document</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      id="proof_of_address"
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileSelect(e, "proof_of_address")}
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        onClick={() => handleUploadClick("proof_of_address")}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Select File
                      </Button>
                      {selectedFiles.find(
                        (f) => f.type === "proof_of_address"
                      ) && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-400 bg-slate-700 px-2 py-1 rounded">
                            {
                              selectedFiles.find(
                                (f) => f.type === "proof_of_address"
                              )?.name
                            }
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFile("proof_of_address")}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Document Guidelines */}
          <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-lg p-4">
            <h4 className="font-medium text-emerald-300 mb-2">
              Document Guidelines
            </h4>
            <ul className="text-sm text-emerald-200/80 space-y-1">
              <li>• All documents must be clear and readable</li>
              <li>• Documents must be in color (not black and white)</li>
              <li>• File formats: JPG, PNG, or PDF</li>
              <li>• Maximum file size: 10MB per document</li>
              <li>• Documents must be valid and not expired</li>
            </ul>
          </div>

          {/* Uploaded Documents */}
          {kycDocuments.length > 0 && (
            <div>
              <h4 className="font-medium text-white mb-3">
                Uploaded Documents
              </h4>
              <div className="space-y-2">
                {kycDocuments.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-800/50 border border-slate-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-white">
                          {doc.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Uploaded{" "}
                          {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              variant="primary"
              size="lg"
              onClick={handleUploadDocuments}
              disabled={uploading || selectedFiles.length === 0}
              loading={uploading}
            >
              {uploading ? "Uploading Documents..." : "Submit for Verification"}
            </Button>
          </div>
          {selectedFiles.length > 0 && (
            <div className="text-center text-sm text-emerald-300 bg-emerald-900/30 border border-emerald-700/50 p-3 rounded-lg">
              Ready to upload {selectedFiles.length} document(s). Click "Submit
              for Verification" to upload all documents at once.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default KYCVerification;
