"use client";
import React, { useState } from "react";
import { Button, Box, TextField, Typography, Modal, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { createClient } from '../utils/supabase/client'

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
   const supabase = createClient();

  const handleOpen = async () => {
    setOpen(true);
    const { data, error } = await supabase
      .from('study_guide')
      .select('title')
      .eq('user_id', userId);

    if (data) {
      setStudyGuides(data.map((item: any) => item.title));
    }
  };

  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    const selectedTitle = title || existingTitle;
    if (!selectedTitle) {
      alert('Please provide a title or select an existing one.');
      return;
    }

    const { error } = await supabase
      .from('study_guide')
      .insert([{ user_id: userId, title: selectedTitle, equation, solution, steps }]);

    if (error) {
      console.error(error.message);
    } else {
      handleClose();
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add to Study Guide
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, bgcolor: 'background.paper', p: 4, borderRadius: 1, mx: 'auto', mt: '10%', maxWidth: 400 }}>
          <Typography variant="h6">Add to Study Guide</Typography>
          <TextField
            label="New Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel id="existing-title-label">Existing Title</InputLabel>
            <Select
              labelId="existing-title-label"
              value={existingTitle}
              onChange={(e) => setExistingTitle(e.target.value)}
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
    </div>
  );
};

export default AddButton;
