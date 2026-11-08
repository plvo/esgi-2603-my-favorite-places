import styled from "styled-components";
import { Link } from "react-router";

export const ButtonLink = styled(Link)`
  display: block;
  flex: 1;
  border-radius: 4px;
  padding: 8px;
  border: 0;
  box-shadow: none;
  background-color: #0e5811;
  color: #ffffff;
  text-decoration: none;

  &:hover {
    opacity: 0.75;
  }
`;
