import { Grid, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <>
      <Grid
        container
        padding={2}
        direction={'column'}
        alignItems={'center'}
        className='footer'
      >
        <Typography>
          &copy; {new Date().getFullYear()} Math App
        </Typography>
      </Grid>
    </>
  );
};

export default Footer;
