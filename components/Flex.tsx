import { Group, GroupProps } from "@mantine/core";
import React from "react";
import styled from "styled-components";

interface IFlexProps extends GroupProps {
  justify?: React.CSSProperties["alignItems"];
}

const Flex = ({ justify, ...rest }: IFlexProps) => {
  return <StyledGroup {...rest} justify={justify} />;
};

interface IStyledGroupProps {
  justify?: IFlexProps["justify"];
}

const StyledGroup = styled(Group)<IStyledGroupProps>`
  /* justify */
  justify-content: ${(props) => props.justify && props.justify};

  /* grow */
  flex-grow: ${(props) => props.grow && 1};
`;

export default Flex;
