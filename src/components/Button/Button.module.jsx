import styled from 'styled-components';

export const ButtonLoad = styled.button`
  width: 120px;
  height: 48px;

  line-height: 100%;
  text-align: center;
  color: #ffffff;

  border-radius: 12px;

  background: linear-gradient(180deg, #40df9f 0%, #3ed598 100%);
  box-shadow: 0px 2px 4px rgba(15, 218, 137, 0.3);

  transition: background 250ms cubic-bezier(0.4, 0, 0.2, 1);

  :hover,
  :focus {
    background: #286053;
  }


`;
