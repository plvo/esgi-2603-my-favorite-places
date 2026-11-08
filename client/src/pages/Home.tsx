import { ButtonLink } from "../components/ButtonLink";
import { Layout } from "../components/Layout";
import { Row } from "../components/Row";

export function HomePage() {
  return (
    <Layout title="Home page">
      <p>Welcome on My Favorite Places</p>
      <Row>
        <ButtonLink to="/signin">Signin</ButtonLink>
        <ButtonLink to="/signup">Signup</ButtonLink>
      </Row>
    </Layout>
  );
}
