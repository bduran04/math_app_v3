"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, Button, CircularProgress } from "@mui/material";
import { createClient } from "../utils/supabase/client"; // Adjust the path as needed
import { useRouter } from 'next/navigation';

interface StudyGuide {
  id: number;
  title: string;
}

const StudyGuide: React.FC = () => {
  const [studyGuides, setStudyGuides] = useState<StudyGuide[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const supabase = createClient();
  const router = useRouter();

  // Fetch study guide titles from Supabase
  const fetchStudyGuides = async () => {
    const { data, error } = await supabase
      .from("study_guide")
      .select("id, title")
      .order("id", { ascending: false }); // Fetch data in descending order by id

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
  };

  useEffect(() => {
    fetchStudyGuides();
  }, []);

  // Handler for clicking on a study guide title
  const handleStudyGuideClick = (id: number) => {
    router.push(`/study-guide/${id}`);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Study Guides
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          {studyGuides.map((guide) => (
            <ListItem key={guide.id} sx={{ mb: 2 }}>
              <Button 
                variant="outlined" 
                fullWidth 
                onClick={() => handleStudyGuideClick(guide.id)}
              >
                {guide.title}
              </Button>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default StudyGuide;

