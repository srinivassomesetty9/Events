import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  TableSortLabel,
} from '@mui/material';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRecruiter, setSelectedRecruiter] = useState(""); // Default to all recruiters

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    setPage(0);
  }, [selectedRecruiter]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRecruiterChange = (event) => {
    setSelectedRecruiter(event.target.value);
  };

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get(`https://api.jinnhire.in/jinnhire/data/manager_reports/recruiter_performance/`, {
        headers: { Authorization: `Token ${token}` },
      });

      setReports(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch reports');
      setLoading(false);
    }
  };

  const formatRecruiterName = (email) => {
    const name = email.split('@')[0];
    return name.replace('.', ' ');
  };

  const filteredReports = selectedRecruiter
    ? reports.filter((report) => report.recruiter_name === selectedRecruiter)
    : reports;

  const totalProcessedResumes = filteredReports.reduce((total, report) => total + report.total_processed, 0);
  const totalFailed = filteredReports.reduce((total, report) => total + report.processing_failed, 0);
  const totalProcessed = totalProcessedResumes + totalFailed;

  const recruiterNames = [...new Set(reports.map((report) => report.recruiter_name))];

  const flattenedReports = filteredReports.flatMap((report) => 
    report.processed_resumes.map((resume) => ({
      recruiter_name: report.recruiter_name,
      requirement_id: resume.requirement_id,
      candidate_name: resume.candidate_name,
    }))
  );

  const displayReports = flattenedReports.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container>
      <Box mb={2}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <InputLabel>Select Recruiter</InputLabel>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <Select
                value={selectedRecruiter}
                onChange={handleRecruiterChange}
              >
                <MenuItem value="">All Recruiters</MenuItem>
                {recruiterNames.map((name, index) => (
                  <MenuItem key={index} value={name}>{formatRecruiterName(name)}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel>SNO</TableSortLabel>
                </TableCell>
                {selectedRecruiter === '' && (
                  <TableCell>
                    <TableSortLabel>Recruiter Name</TableSortLabel>
                  </TableCell>
                )}
                <TableCell>
                  <TableSortLabel>Requirement ID</TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel>Candidate Name</TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="h6" color="error">
                      {error}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : displayReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="h6" color="textSecondary">
                      No data available
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                displayReports.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    {selectedRecruiter === '' && (
                      <TableCell>{formatRecruiterName(row.recruiter_name)}</TableCell>
                    )}
                    <TableCell>{row.requirement_id}</TableCell>
                    <TableCell>{row.candidate_name}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box p={2} display="flex" justifyContent="space-between">
          <Typography variant="h6">
            Submitted Resumes: {totalProcessedResumes}
          </Typography>
          <Typography variant="h6">
            Process Failed: {totalFailed}
          </Typography>
          <Typography variant="h6">
            Total Processed: {totalProcessed}
          </Typography>
        </Box>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={flattenedReports.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
};

export default Reports;
