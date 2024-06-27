import React, { useState } from "react";
import {
  Button,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Box,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function UploadModal({ open, onClose, onUpload }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFiles([...event.target.files]);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  const handleUpload = async () => {
    setLoading(true);
    const uploadedFilesSet = new Set(); // To track already uploaded files

    try {
      for (const file of selectedFiles) {
        const fileId = file.name; // You can use a unique property of the file as its ID
        if (!uploadedFilesSet.has(fileId)) {
          await onUpload(file);
          uploadedFilesSet.add(fileId);
        }
      }
      setLoading(false);
      setSelectedFiles([]);
      onClose();
    } catch (error) {
      console.error("Error uploading files:", error);
      setLoading(false);
    }
  };

  return (
    <Modal open={open}>
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: 24,
          maxWidth: "500px",
          width: "90%",
          margin: "auto",
          padding: "20px",
          textAlign: "center",
          mt: "10vh",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Upload Files</Typography>
        </Box>
        <img src="add_files.png" alt="img" height={180} width={250} />
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          sx={{ mt: 2, mb: 2 }}
        >
          Upload
          <VisuallyHiddenInput
            type="file"
            multiple
            onChange={handleFileChange}
          />
        </Button>
        <TableContainer sx={{ maxHeight: 200, overflowY: "auto", mb: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>File Name</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedFiles.map((file, index) => (
                <TableRow key={index}>
                  <TableCell>{file.name}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleRemoveFile(index)}
                      color="error"
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Submit"
            )}
          </Button>
          <Button
            variant="contained"
            onClick={onClose}
            sx={{ backgroundColor: "rgb(31 91 139)" }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
