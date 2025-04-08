'use client';

import React, { useEffect, useState, useCallback } from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  CircularProgress, 
  Container,
  TextField,
  Modal,
  Snackbar,
  Alert,
  IconButton
} from "@mui/material";
import { createClient } from "../utils/supabase/client";
import { useRouter } from 'next/navigation';
import AddIcon from '@mui/icons-material/Add';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FunctionsIcon from '@mui/icons-material/Functions';
import CloseIcon from '@mui/icons-material/Close';

interface StudyGuide {
  id: number;
  title: string;
}

const StudyGuide: React.FC = () => {
  const [studyGuides, setStudyGuides] = useState<StudyGuide[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const supabase = createClient();
  const router = useRouter();
  
  // State for create modal
  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Colors to match login page
  const colors = {
    background: '#fbf7ef',
    primary: '#f8b84e', // amber/yellow for buttons
    text: '#2c2e33',    // dark text
    lightText: '#6c757d',
    cardBg: '#ffffff',
    cardBorder: '#f0e9db'
  };

  // Modal style
  const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: colors.cardBg,
    border: `1px solid ${colors.cardBorder}`,
    borderRadius: 1,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    p: 4,
  };

  // Memoized fetchStudyGuides function
  const fetchStudyGuides = useCallback(async () => {
    const { data, error } = await supabase
      .from("study_guide")
      .select("id, title")
      .order("id", { ascending: false });

    if (error) {
      console.error("Error fetching study guides:", error.message);
    } else {
      // Remove duplicate titles if necessary
      const uniqueStudyGuides = data.reduce((acc: StudyGuide[], current: StudyGuide) => {
        if (!acc.some((guide) => guide.title === current.title)) {
          acc.push(current);
        }
        return acc;
      }, []);
      setStudyGuides(uniqueStudyGuides);
    }

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchStudyGuides();
  }, [fetchStudyGuides]);

  // Handler for clicking on a study guide
  const handleStudyGuideClick = (id: number) => {
    router.push(`/study-guide/${id}`);
  };
  
  // Handler for creating a new study guide
  const handleCreateNew = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setNewTitle('');
  };

  const handleCreateStudyGuide = async () => {
    if (!newTitle.trim()) {
      setSnackbarMessage('Please enter a title for your study guide.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setSnackbarMessage('You must be logged in to create a study guide.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }

      // Create the new study guide
      const { data, error } = await supabase
        .from('study_guide')
        .insert([{ 
          title: newTitle, 
          user_id: user.id,
          equation: '',  // Empty initially
          solution: '',  // Empty initially
          steps: []      // Empty initially
        }])
        .select();

      if (error) {
        throw error;
      }

      // Show success message
      setSnackbarMessage('Study guide created successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      // Close modal and refresh the list
      handleCloseModal();
      fetchStudyGuides();
      
      // Navigate to the new study guide if created successfully
      if (data && data.length > 0) {
        router.push(`/study-guide/${data[0].id}`);
      }
    } catch (error: any) {
      console.error('Error creating study guide:', error.message);
      setSnackbarMessage(`Error creating study guide: ${error.message}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ 
      backgroundColor: colors.background, 
      minHeight: '100vh',
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* Header with title and actions */}
        <Box
          sx={{ 
            mb: 4, 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Box display="flex" alignItems="center">
            <MenuBookIcon sx={{ mr: 2, fontSize: 36, color: colors.primary }} />
            <Typography variant="h4" fontWeight="500" color={colors.text}>
              My Study Guides
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateNew}
            sx={{
              bgcolor: colors.primary,
              '&:hover': {
                bgcolor: '#e0a542', // slightly darker on hover
              },
              border: 'none',
              borderRadius: 1,
              px: 3,
              color: '#fff',
              textTransform: 'uppercase',
              fontWeight: 'bold',
              boxShadow: 'none'
            }}
          >
            Create New
          </Button>
        </Box>

        {/* Content area */}
        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress sx={{ color: colors.primary }} />
          </Box>
        ) : studyGuides.length > 0 ? (
          <Grid container spacing={3}>
            {studyGuides.map((guide) => (
              <Grid item xs={12} sm={6} md={4} key={guide.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    borderRadius: 1,
                    border: `1px solid ${colors.cardBorder}`,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer',
                    bgcolor: colors.cardBg,
                    boxShadow: 'none',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.05)'
                    }
                  }}
                  onClick={() => handleStudyGuideClick(guide.id)}
                >
                  <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ 
                      p: 2, 
                      borderBottom: `1px solid ${colors.cardBorder}`,
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <FunctionsIcon sx={{ mr: 1, color: colors.primary }} />
                      <Typography variant="h6" color={colors.text}>
                        {guide.title}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ p: 2, flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="body2" color={colors.lightText} textAlign="center">
                        Click to view equations and solutions
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box 
            sx={{ 
              p: 4, 
              borderRadius: 1, 
              textAlign: 'center', 
              bgcolor: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`
            }}
          >
            <Typography variant="h6" color={colors.text} gutterBottom>
              No study guides found
            </Typography>
            <Typography variant="body2" color={colors.lightText}>
              Create your first study guide to get started
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleCreateNew}
              sx={{ 
                mt: 2,
                color: colors.primary,
                borderColor: colors.primary,
                '&:hover': {
                  borderColor: '#e0a542',
                  bgcolor: 'rgba(248, 184, 78, 0.05)'
                }
              }}
            >
              Create New Study Guide
            </Button>
          </Box>
        )}

        {/* Create Study Guide Modal */}
        <Modal
          open={modalOpen}
          onClose={handleCloseModal}
          aria-labelledby="create-study-guide-modal"
        >
          <Box sx={modalStyle}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" color={colors.text}>
                Create New Study Guide
              </Typography>
              <IconButton onClick={handleCloseModal} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
            
            <TextField
              label="Study Guide Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              placeholder="e.g., SAT Prep, Calculus Formulas, etc."
              autoFocus
            />
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                onClick={handleCloseModal} 
                sx={{ mr: 1, color: colors.lightText }}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                onClick={handleCreateStudyGuide}
                sx={{
                  bgcolor: colors.primary,
                  '&:hover': {
                    bgcolor: '#e0a542',
                  },
                  color: '#fff',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  boxShadow: 'none'
                }}
              >
                Create
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleSnackbarClose} 
            severity={snackbarSeverity} 
            sx={{ width: '100%' }}
            variant="filled"
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default StudyGuide;