"use client";
import React, { useState } from "react";
import { Button, Box, TextField, Typography, Modal, Select, MenuItem, FormControl, InputLabel, Tooltip, Snackbar, Alert, SelectChangeEvent } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { createClient } from '../utils/supabase/client';

interface AddButtonProps {
  userId: string;
  equation: string;
  solution: string;
  steps: any[];
}

const AddButton: React.FC<AddButtonProps> = ({ userId, equation, solution, steps }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [existingTitle, setExistingTitle] = useState('');
  const [studyGuides, setStudyGuides] = useState<string[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const supabase = createClient();

  const handleOpen = async () => {
    setOpen(true);
    const { data, error } = await supabase
      .from('study_guide')
      .select('title')
      .eq('user_id', userId);

    if (data) {
      const uniqueTitles = Array.from(new Set(data.map((item: any) => item.title)));
      setStudyGuides(uniqueTitles);
    }
  };

  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    const selectedTitle = title || existingTitle;
    if (!selectedTitle) {
      setSnackbarMessage('Please provide a title or select an existing one.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    const { error } = await supabase
      .from('study_guide')
      .insert([{ user_id: userId, title: selectedTitle, equation, solution, steps }]);

    if (error) {
      setSnackbarMessage(`Error: ${error.message}`);
      setSnackbarSeverity('error');
    } else {
      setSnackbarMessage('Saved successfully!');
      setSnackbarSeverity('success');
      handleClose();
    }
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleExistingTitleChange = (event: SelectChangeEvent<string>) => {
    setExistingTitle(event.target.value);
  };

  return (
    <div>
      <Tooltip title="Add to Study Guide">
        <Button variant="contained" color="secondary" onClick={handleOpen}>
          <AddIcon />
        </Button>
      </Tooltip>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, bgcolor: 'background.paper', p: 4, borderRadius: 1, mx: 'auto', mt: '10%', maxWidth: 400 }}>
          <Typography variant="h6">Add to Study Guide</Typography>
          <TextField
            label="New Title"
            value={title}
            onChange={handleTitleChange}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel id="existing-title-label">Existing Title</InputLabel>
            <Select
              labelId="existing-title-label"
              value={existingTitle}
              onChange={handleExistingTitleChange}
              fullWidth
            >
              {studyGuides.map((guide, index) => (
                <MenuItem key={index} value={guide}>
                  {guide}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Modal>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddButton;
