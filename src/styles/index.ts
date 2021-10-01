import styled from "styled-components";

export const StyledButton = styled.button`
  cursor: pointer;
  margin: 30px;
  font-size: 20px;
  padding: 10px;
  width: calc(100% - 60px);
  border: 1px solid #c5d3e8;
  background: #2b2ecf;
  color: #ffffff;
  border-radius: 8px;
  &:hover {
    background: #131598;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  margin: 30px;
  min-width: 400px;
  label {
    margin-bottom: 8px;
    padding-right: 10px;
    color: #7f8a9c;
  }
  input,
  select {
    font-size: 18px;
    border: 1px solid #c5d3e8;
    border-radius: 6px;
    padding: 8px;
  }
`;
