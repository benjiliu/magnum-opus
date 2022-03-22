import React from "react";
import styled from "styled-components";

const CircleItem = styled.div`
  background-color: black;
  border-radius: 50%;
  height: ${({ size }: CircleProps) => `${size}px`};
  width: ${({ size }: CircleProps) => `${size}px`};
`;

interface CircleProps {
  size: number;
}

const Circle = ({ size }: CircleProps) => <CircleItem size={size} />;

export default Circle;
