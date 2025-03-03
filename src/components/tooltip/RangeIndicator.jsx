import React from 'react';
import styled from 'styled-components';

// Other styled components here...

// Styled component for the Range indicator container
const RangeIndicatorContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 12px;
`;

// Styled component for individual range segment
const RangeSegment = styled.div`
  width: 20px; // Adjust the width as needed
  height: 6px; // Adjust the height as needed
  background-color: ${props => props.active ? '#007bff' : '#333'};
  margin-right: 4px;
  transition: background-color 0.3s;

  &:last-child {
    margin-right: 0;
  }
`;

// The RangeIndicator component
const RangeIndicator = ({ range, maxRange }) => {
  return (
    <RangeIndicatorContainer>
      {Array.from({ length: maxRange }, (_, index) => (
        <RangeSegment key={index} active={index < range} />
      ))}
    </RangeIndicatorContainer>
  );
};

export default RangeIndicator;