import React from 'react';
import Grid from './Grid';

interface FormLayoutProps {
  children: React.ReactNode;
  gap?: number;
}

const FormLayout: React.FC<FormLayoutProps> = ({ children, gap = 4 }) => {
  return (
    <Grid container columns={2} gap={gap} className="w-full">
      {React.Children.map(children, (child, idx) => (
        <Grid item xs={2} md={1} key={idx}>
          {child}
        </Grid>
      ))}
    </Grid>
  );
};

export default FormLayout; 