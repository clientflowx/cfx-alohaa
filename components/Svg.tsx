import React, { ReactNode } from "react";

interface SvgProps {
  className?: string;
  viewBox: string;
  width: number;
  height: number;
  icon: ReactNode;
  [key: string]: any;
}

const Svg: React.FC<SvgProps> = ({
  className,
  viewBox,
  width,
  height,
  icon,
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={width}
      height={height}
      className={className}
      {...props}
    >
      {icon}
    </svg>
  );
};

export default Svg;
