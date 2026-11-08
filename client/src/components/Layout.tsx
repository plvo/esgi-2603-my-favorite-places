import styled from "styled-components";

const Container = styled.div`
  width: 90%;
  max-width: 350px;
  margin: 32px auto;
  border-radius: 8px;
  background-color: white;
  color: #4d4d4d;
  font-family: Ubuntu;

  & > h1 {
    font-family: Helvetica, sans-serif;
    color: #000000;
    margin: 8px 12px;
    padding-top: 16px;
  }
`;

const Content = styled.main`
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
  justify-content: stretch;
`;

export function Layout(props: { title?: string; children: React.ReactNode }) {
  return (
    <Container>
      {props.title && <h1>{props.title}</h1>}
      <Content>{props.children}</Content>
    </Container>
  );
}
