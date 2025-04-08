'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Avatar, 
  Divider,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material';
import ExampleEquations from 'app/components/ExampleEquations';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CalculateIcon from '@mui/icons-material/Calculate';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HistoryIcon from '@mui/icons-material/History';
import { createClient } from 'app/utils/supabase/client';

interface UserData {
  id: string;
  email: string;
  fullName: string;
  lastName: string;
}

interface DashboardClientProps {
  userData: UserData;
}

const DashboardClient: React.FC<DashboardClientProps> = ({ userData }) => {
  // Add a safety check for userData and provide default values
  const firstName = userData?.fullName || 'User';
  const userId = userData?.id || '';
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [studyGuideCount, setStudyGuideCount] = useState<number | null>(null);
  const [equationCount, setEquationCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  
  // Colors to match your app's color scheme
  const colors = {
    background: '#fbf7ef',
    primary: '#f8b84e',
    text: '#2c2e33',
    lightText: '#6c757d',
    cardBg: '#ffffff',
    cardBorder: '#f0e9db'
  };

  // Fetch study guide count from Supabase
  const fetchStudyGuideCount = useCallback(async () => {
    try {
      // Skip if no valid user ID
      if (!userId) {
        setIsLoading(false);
        return;
      }
      
      // Get all study guides for this user
      const { data: studyGuides, error: studyError } = await supabase
        .from('study_guide')
        .select('title')
        .eq('user_id', userId);

      if (studyError) {
        console.error('Error fetching study guides:', studyError.message);
      } else if (studyGuides) {
        // Count unique titles
        const uniqueTitles = new Set<string>();
        studyGuides.forEach((guide: any) => {
          if (guide.title) {
            uniqueTitles.add(guide.title);
          }
        });
        
        setStudyGuideCount(uniqueTitles.size);
      }
      
      // Get count of equations
      const { count: eqCount, error: eqError } = await supabase
        .from("study_guide")
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .not('equation', 'eq', ''); // Count only records with non-empty equations

      if (eqError) {
        console.error('Error fetching equation count:', eqError.message);
      } else {
        setEquationCount(eqCount || 0);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Unexpected error fetching data:', error);
      setIsLoading(false);
    }
  }, [supabase, userId]);

  useEffect(() => {
    fetchStudyGuideCount();
  }, [fetchStudyGuideCount]);

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Function to render count with loading state
  const renderCount = (count: number | null, loadingState: boolean) => {
    if (loadingState) {
      return <CircularProgress size={30} sx={{ color: colors.primary }} />;
    }
    return count;
  };

  // Get the first character of firstName safely
  const getInitial = (name: string) => {
    return name && typeof name === 'string' && name.length > 0 ? name.charAt(0) : 'U';
  };

  return (
    <Box sx={{ 
      backgroundColor: colors.background, 
      minHeight: '100vh',
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* Welcome Section */}
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 3, md: 4 }, 
            mb: 4, 
            borderRadius: 2,
            background: 'linear-gradient(45deg, #ffffff 0%, #f9f5ec 100%)',
            border: `1px solid ${colors.cardBorder}`
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  bgcolor: colors.primary,
                  fontSize: '2rem'
                }}
              >
                {getInitial(firstName)}
              </Avatar>
            </Grid>
            <Grid item xs={12} md={10}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography 
                  variant="h5" 
                  color={colors.lightText}
                  sx={{ fontWeight: 400 }}
                >
                  {getTimeOfDay()},
                </Typography>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 700, 
                    color: colors.text,
                    mt: 0.5,
                    fontSize: { xs: '2rem', md: '2.5rem' }
                  }}
                >
                  {firstName}!
                </Typography>
                <Typography 
                  variant="body1" 
                  color={colors.lightText} 
                  sx={{ mt: 1 }}
                >
                  Welcome to your math workspace. What would you like to solve today?
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Quick Stats Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card 
              sx={{ 
                height: '100%',
                borderRadius: 2,
                border: `1px solid ${colors.cardBorder}`,
                boxShadow: 'none'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'rgba(248, 184, 78, 0.2)', color: colors.primary, mr: 2 }}>
                    <CalculateIcon />
                  </Avatar>
                  <Typography variant="h6" color={colors.text}>Equations Solved</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60px' }}>
                  <Typography variant="h3" align="center" sx={{ fontWeight: 700, color: colors.primary }}>
                    {renderCount(equationCount, isLoading)}
                  </Typography>
                </Box>
                <Typography variant="body2" color={colors.lightText} align="center">
                  {equationCount === 0 ? 'Start solving equations to see your progress' : 'Equations you have solved so far'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card 
              sx={{ 
                height: '100%',
                borderRadius: 2,
                border: `1px solid ${colors.cardBorder}`,
                boxShadow: 'none'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'rgba(248, 184, 78, 0.2)', color: colors.primary, mr: 2 }}>
                    <MenuBookIcon />
                  </Avatar>
                  <Typography variant="h6" color={colors.text}>Study Guides</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60px' }}>
                  <Typography variant="h3" align="center" sx={{ fontWeight: 700, color: colors.primary }}>
                    {renderCount(studyGuideCount, isLoading)}
                  </Typography>
                </Box>
                <Typography variant="body2" color={colors.lightText} align="center">
                  {studyGuideCount === 0 ? 'Create study guides to organize your equations' : 'Unique study guides you have created'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card 
              sx={{ 
                height: '100%',
                borderRadius: 2,
                border: `1px solid ${colors.cardBorder}`,
                boxShadow: 'none'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'rgba(248, 184, 78, 0.2)', color: colors.primary, mr: 2 }}>
                    <HistoryIcon />
                  </Avatar>
                  <Typography variant="h6" color={colors.text}>Recent Activity</Typography>
                </Box>
                <Typography variant="body1" color={colors.lightText} align="center" sx={{ my: 3 }}>
                  No recent activity yet
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Solver Section */}
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 2, md: 4 }, 
            borderRadius: 2,
            background: '#ffffff',
            border: `1px solid ${colors.cardBorder}`
          }}
        >
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography 
              variant="h5" 
              color={colors.text}
              sx={{ 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
              }}
            >
              <CalculateIcon sx={{ color: colors.primary }} /> Math Solver
            </Typography>
            <Divider sx={{ my: 2 }} />
          </Box>
          
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            {userId ? (
              <ExampleEquations userId={userId} />
            ) : (
              <Typography color={colors.lightText}>
                Please log in to access the equation solver
              </Typography>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default DashboardClient;