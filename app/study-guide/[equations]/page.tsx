'use client';

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Button, 
  Card, 
  CardContent, 
  Divider, 
  Modal,
  IconButton,
  Grid
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { createClient } from "../../utils/supabase/client";

// Define types for equation steps
interface EquationStep {
  changeType: string;
  oldEquation: any;
  newEquation: any;
  substeps: EquationStep[];
}

interface Equations {
  id: number;
  title: string;
  equation: string;
  solution: string;
  steps: EquationStep[] | string[] | any; // Support multiple formats
}

// Helper function to format change type to be more readable
const formatChangeType = (changeType: string): string => {
  if (!changeType) return '';
  
  return changeType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Helper function to display equation parts in a readable format
const formatEquationPart = (part: any): string => {
  if (!part) return '';
  
  if (typeof part === 'string') return part;
  
  if (part.value !== undefined) {
    return part.value;
  }
  
  if (part.name !== undefined) {
    return part.name;
  }
  
  if (part.items) {
    return part.items.map((item: any) => formatEquationPart(item)).join(', ');
  }
  
  if (part.implicit !== undefined && part.op) {
    const operator = part.op === '*' ? '×' : part.op;
    
    if (part.args) {
      const formattedArgs = part.args.map((arg: any) => {
        if (arg && arg.content) {
          return `(${formatEquationPart(arg.content)})`;
        }
        return formatEquationPart(arg);
      });
      
      return formattedArgs.join(` ${operator} `);
    }
  }
  
  if (part.leftNode && part.rightNode) {
    const left = formatEquationPart(part.leftNode);
    const right = formatEquationPart(part.rightNode);
    const comparator = part.comparator || '=';
    
    return `${left} ${comparator} ${right}`;
  }
  
  // Fallback if we can't parse it
  try {
    return JSON.stringify(part);
  } catch (e) {
    return '';
  }
};

// Check if a value is a complex step object
const isStepObject = (step: any): boolean => {
  return (
    typeof step === 'object' && 
    step !== null && 
    'changeType' in step && 
    'oldEquation' in step && 
    'newEquation' in step
  );
};

// Render appropriate equation steps
const renderSteps = (steps: any) => {
  // Safely handle undefined or null steps
  if (!steps) return null;
  
  // If steps is an array of strings (old format)
  if (Array.isArray(steps) && steps.length > 0 && typeof steps[0] === 'string') {
    return (
      <Typography variant="body2">
        Steps: {steps.join(", ")}
      </Typography>
    );
  }
  
  // If steps is an array of step objects (new format)
  if (Array.isArray(steps) && steps.length > 0 && isStepObject(steps[0])) {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold">Solution Steps:</Typography>
        {steps.map((step: EquationStep, index: number) => (
          <Box key={index} sx={{ ml: 2, mt: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="subtitle2" fontWeight="bold">
              Step {index + 1}: {formatChangeType(step.changeType)}
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              From: {formatEquationPart(step.oldEquation)}
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              To: {formatEquationPart(step.newEquation)}
            </Typography>
            
            {step.substeps && step.substeps.length > 0 && (
              <Box sx={{ ml: 2, mt: 1 }}>
                <Typography variant="body2" fontWeight="bold">Substeps:</Typography>
                {step.substeps.map((substep, subIndex) => (
                  <Box key={subIndex} sx={{ ml: 1, mt: 0.5 }}>
                    <Typography variant="body2" fontSize="0.9rem">
                      {formatChangeType(substep.changeType)}:
                      {formatEquationPart(substep.oldEquation)} →
                      {formatEquationPart(substep.newEquation)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        ))}
      </Box>
    );
  }
  
  // Fallback for any other format
  try {
    return (
      <Typography variant="body2">
        Steps: {JSON.stringify(steps)}
      </Typography>
    );
  } catch (e) {
    return null;
  }
};

// Modal style
const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: 800,
  maxHeight: '90vh',
  overflow: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const Equations = ({ params }: { params: { equations: string } }) => {
  const studyGuideId = params.equations;
  const [problems, setProblems] = useState<Equations[]>([]);
  const [studyGuideTitle, setStudyGuideTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const supabase = createClient();
  
  // State for modal
  const [open, setOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<Equations | null>(null);

  // Helper function to safely parse steps if they're stored as a string
  const parseSteps = (stepsData: any): any => {
    if (!stepsData) return [];
    
    if (typeof stepsData === 'string') {
      try {
        // Check if the string looks like JSON
        if (stepsData.trim().startsWith('[') || stepsData.trim().startsWith('{')) {
          return JSON.parse(stepsData);
        }
        return stepsData;
      } catch (e) {
        console.error("Error parsing steps JSON:", e);
        return stepsData;
      }
    }
    
    return stepsData;
  };

  const handleOpen = (problem: Equations) => {
    setSelectedProblem(problem);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProblem(null);
  };

  // Memoized fetchEquationsDetails function
  const fetchEquationsDetails = useCallback(async () => {
    if (!studyGuideId) return;
    setLoading(true);
    
    try {
      // First, get information about the selected study guide
      const { data: guideData, error: guideError } = await supabase
        .from("study_guide")
        .select("title")
        .eq("id", studyGuideId)
        .single();
        
      if (guideError) {
        console.error("Error fetching study guide:", guideError.message);
        setLoading(false);
        return;
      }
      
      if (guideData && guideData.title) {
        setStudyGuideTitle(guideData.title);
        
        // Then get all equations with the same title (belonging to this study guide)
        const { data: equationsData, error: eqError } = await supabase
          .from("study_guide")
          .select("id, title, equation, solution, steps")
          .eq("title", guideData.title);
          
        if (eqError) {
          console.error("Error fetching equations:", eqError.message);
        } else if (equationsData) {
          // Process the data to handle different step formats
          const processedData = equationsData.map(item => {
            return {
              ...item,
              steps: parseSteps(item.steps)
            };
          });
          
          setProblems(processedData);
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  }, [studyGuideId, supabase]);

  useEffect(() => {
    fetchEquationsDetails();
  }, [fetchEquationsDetails]);

  // Go back to the list of study guides
  const handleBackClick = () => {
    router.push("/study-guide");
  };

  // Colors to match your app's color scheme
  const colors = {
    background: '#fbf7ef',
    primary: '#f8b84e',
    text: '#2c2e33',
    lightText: '#6c757d',
    cardBg: '#ffffff',
    cardBorder: '#f0e9db'
  };

  return (
    <Box sx={{ p: 4, backgroundColor: colors.background, minHeight: '100vh' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" color={colors.text}>
          {studyGuideTitle || "Study Guide Details"}
        </Typography>
        <Button 
          variant="contained" 
          onClick={handleBackClick}
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
          Back to Study Guides
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress sx={{ color: colors.primary }} />
        </Box>
      ) : problems.length > 0 ? (
        <Grid container spacing={3}>
          {problems.map((problem) => (
            <Grid item xs={12} sm={6} md={4} key={problem.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  bgcolor: colors.cardBg,
                  border: `1px solid ${colors.cardBorder}`,
                  borderRadius: 1,
                  boxShadow: 'none',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.05)'
                  }
                }}
                onClick={() => handleOpen(problem)}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom color={colors.text}>
                    Equation
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2, fontFamily: 'monospace', fontSize: '1.1rem' }}>
                    {problem.equation || "No equation provided"}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="h6" gutterBottom color={colors.text}>
                    Solution
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>
                    {problem.solution || "No solution provided"}
                  </Typography>
                  
                  <Typography 
                    variant="subtitle2" 
                    color={colors.primary}
                    sx={{ 
                      mt: 2, 
                      textAlign: 'center',
                      fontWeight: 'bold',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Click to view steps
                  </Typography>
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
            No equations found for this study guide
          </Typography>
          <Typography variant="body2" color={colors.lightText}>
            This study guide doesn&apos;t have any equations yet
          </Typography>
        </Box>
      )}

      {/* Modal for displaying steps */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{...modalStyle, bgcolor: colors.cardBg}}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography id="modal-title" variant="h5" color={colors.text}>
              Equation Details
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Typography variant="h6" color={colors.text}>Original Equation</Typography>
          <Typography variant="body1" sx={{ mb: 2, fontFamily: 'monospace', fontSize: '1.1rem' }}>
            {selectedProblem?.equation || "No equation provided"}
          </Typography>
          
          <Typography variant="h6" color={colors.text}>Solution</Typography>
          <Typography variant="body1" sx={{ mb: 3, fontFamily: 'monospace', fontSize: '1.1rem' }}>
            {selectedProblem?.solution || "No solution provided"}
          </Typography>
          
          <Typography variant="h6" gutterBottom color={colors.text}>Solution Steps:</Typography>
          {selectedProblem && renderSteps(selectedProblem.steps)}
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="contained" 
              onClick={handleClose}
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
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Equations;