"use client";
import React, { useState, useEffect } from "react";
import { Box, Button, Grid, TextField, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import mathsteps from "mathsteps";
import AddButton from "./AddButton";

interface CalcbarProps {
  exampleInput?: string;
  userId: string;
}

const Calcbar: React.FC<CalcbarProps> = ({ exampleInput, userId }) => {
  const [input, setInput] = useState<string>(exampleInput || "");
  const [solution, setSolution] = useState<string>("");
  const [steps, setSteps] = useState<any[]>([]);

  useEffect(() => {
    if (exampleInput) {
      setInput(exampleInput);
      handleSolve(exampleInput);
    }
  }, [exampleInput]);

  const handleSolve = (inputValue: string) => {
    try {
      const steps = mathsteps.solveEquation(inputValue);
      const solutionSteps = steps.map((step: any) => step.newEquation.ascii());
      setSolution(solutionSteps.length ? solutionSteps[solutionSteps.length - 1] : "No solution found");
      setSteps(steps);
    } catch (error) {
      setSolution("Invalid equation");
      setSteps([]);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Enter an algebraic equation"
            variant="outlined"
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            sx={{ mt: 1 }}
          />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" color="primary" onClick={() => handleSolve(input)}>
              Solve
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ border: '1px solid', borderColor: 'grey.400', borderRadius: 1, padding: 2, marginTop: 2, backgroundColor: '#fbf7ef' }}>
            <Typography variant="h6">Solution: {solution}</Typography>
            {steps.length > 0 && (
              <Accordion sx={{ marginTop: 2, backgroundColor: 'primary.main' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ color: '#2c2e33' }}>Steps</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {steps.map((step, index) => (
                    <Accordion key={index} sx={{ marginTop: 2, backgroundColor: '#fff' }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>{`Step ${index + 1}`}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>{step.newEquation.ascii()}</Typography>
                        <Typography variant="body2">{step.changeType.replace(/_/g, ' ').toLowerCase()}</Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </AccordionDetails>
              </Accordion>
            )}
            {solution && (
              <Box mt={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <AddButton userId={userId} equation={input} solution={solution} steps={steps} />
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Calcbar;
