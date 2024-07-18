"use client";
import React, { useState } from "react";
import { Box, Card, CardActionArea, CardContent, Grid, Typography } from "@mui/material";
import Calcbar from "./Calcbar";

const exampleEquations = [
    "x + 1 = 2",
    "2x - 3 = 7",
    "x^2 - 4 = 0",
    "3x + 2 = 11",
    "5x - 15 = 0",
];

const ExampleEquations: React.FC = () => {
    const [selectedEquation, setSelectedEquation] = useState<string>("");

    return (
        <div>
            <Calcbar exampleInput={selectedEquation} />
            <Box sx={{ padding: 2 }}>
                <Typography variant="h5" gutterBottom>
                    Select an Example Equation
                </Typography>
                <Grid container spacing={2}>
                    {exampleEquations.map((equation, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
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

            </Box>
        </div>

    );
};

export default ExampleEquations;
