import React from 'react';

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  container?: boolean;
  item?: boolean;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  gap?: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  columns?: number;
}
// Helper to map number to Tailwind col-span class
const getColSpan = (prefix: string, value?: number) => {
  if (!value) return '';
  if (prefix === '') return `col-span-${value}`;
  return `${prefix}:col-span-${value}`;
};

// Helper to map gap to Tailwind gap class
const getGap = (gap?: number) => {
  if (!gap) return '';
  return `gap-${gap}`;
};

// Helper to map columns to Tailwind grid-cols class
const getGridCols = (columns?: number) => {
  if (!columns) return '';
  return `grid-cols-${columns}`;
};

const Grid: React.FC<GridProps> = ({
  container,
  item,
  xs,
  sm,
  md,
  lg,
  xl,
  gap,
  className = '',
  style,
  children,
  columns,
  ...rest
}) => {
  let classes = className;

  if (container) {
    classes += ' grid w-full';
    if (columns) {
      classes += ` ${getGridCols(columns)}`;
    } else {
      classes += ' grid-cols-6';
    }
    if (gap) classes += ` ${getGap(gap)}`;
  }
  if (item) {
    classes += ` ${getColSpan('', xs)}`;
    classes += ` ${getColSpan('sm', sm)}`;
    classes += ` ${getColSpan('md', md)}`;
    classes += ` ${getColSpan('lg', lg)}`;
    classes += ` ${getColSpan('xl', xl)}`;
  }

  return (
    <div className={classes.trim()} style={style} {...rest}>
      {children}
    </div>
  );
};

export default Grid; 