"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, Button } from "@mui/material";
import { createClient } from "../../utils/supabase/client"; // Adjust the path as needed

interface Equations {
    id: number;
    title: string;
    equation: string;
    solution: string;
    steps: string[];
}

const Equations = ( { params }: { params: { equations: string } } ) => {
    const studyGuide = params.equations
    const [problems, setProblems] = useState<Equations[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    const supabase = createClient();

    // Fetch the specific study guide's equations and details
    const fetchEquationsDetails = async () => {
        if (!studyGuide) return; 
        setLoading(true);
        const { data, error } = await supabase
            .from("study_guide")
            .select("id, title, equation, solution, steps")

        if (error) {
            console.error("Error fetching study guide details:", error.message);
        } else {
            setProblems(data);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchEquationsDetails();
    }, [studyGuide]);

    // Go back to the list of study guides
    const handleBackClick = () => {
        router.push("/study-guide");
    };

    return (
        <Box sx={{ p: 4 }}>
            <h1>
                The study guide ID is <b>{studyGuide}</b>
            </h1>
            <Typography variant="h4" gutterBottom>
                Study Guide Details
            </Typography>
            <Button variant="contained" onClick={handleBackClick} sx={{ mb: 2 }}>
                Back to Study Guides
            </Button>

            {loading ? (
                <CircularProgress />
            ) : problems.length > 0 ? (
                <List>
                    {problems.map((problem) => (
                        <ListItem key={problem.id} sx={{ mb: 2, border: "1px solid #ccc", borderRadius: 1, p: 2 }}>
                            <ListItemText
                                primary={`Title: ${problem.title}`}
                                secondary={
                                    <>
                                        <Typography variant="body2">Equation: {problem.equation}</Typography>
                                        <Typography variant="body2">Solution: {problem.solution}</Typography>
                                        <Typography variant="body2">Steps: {problem.steps.join(", ")}</Typography>
                                    </>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography>No equations found for this study guide.</Typography>
            )}
        </Box>
    );
};

export default Equations;
