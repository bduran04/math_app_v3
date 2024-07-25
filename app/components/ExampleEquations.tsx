"use client";
import React, { useState, useEffect } from "react";
import { Box, Card, CardActionArea, CardContent, Grid, Typography } from "@mui/material";
import Calcbar from "./Calcbar";
import mathsteps from "mathsteps";
import AddButton from "./AddButton";

const exampleEquations = [
    "x + 1 = 2",
    "2x - 3 = 7",
    "x^2 - 4 = 0",
    "3x + 2 = 11",
    "5x - 15 = 0",
];

interface ExampleEquationsProps {
    userId: string;
}

const ExampleEquations: React.FC<ExampleEquationsProps> = ({ userId }) => {
    const [selectedEquation, setSelectedEquation] = useState<string>("");
    const [solution, setSolution] = useState<string>("");
    const [steps, setSteps] = useState<any[]>([]);

    useEffect(() => {
        if (selectedEquation) {
            const steps = mathsteps.solveEquation(selectedEquation);
            const solutionSteps = steps.map((step: any) => step.newEquation.ascii());
            setSolution(solutionSteps.length ? solutionSteps[solutionSteps.length - 1] : "No solution found");
            setSteps(steps);
        }
    }, [selectedEquation]);

    return (
        <div>
            <Calcbar exampleInput={selectedEquation} />
            <Typography variant="h5" gutterBottom>
                Select an Example
            </Typography>
            <Grid container spacing={2}>
                {exampleEquations.map((equation, index) => (
                    <Grid item xs={12} key={index}>
                        <Card>
                            <CardActionArea onClick={() => setSelectedEquation(equation)}>
                                <CardContent>
                                    <Typography variant="body1">{equation}</Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {selectedEquation && (
                <Box mt={2}>
                    <Typography variant="h6">Selected Equation: {selectedEquation}</Typography>
                    <AddButton userId={userId} equation={selectedEquation} solution={solution} steps={steps} />
                </Box>
            )}
        </div >

    );
};

export default ExampleEquations;

