import { Button } from "../components/Button";
import { Layout } from "../components/Layout";
import { Row } from "../components/Row";

export function DashboardPage() {
  function onSignout() {
    sessionStorage.clear();
    localStorage.clear();
    location.href = "/";
  }
  return (
    <Layout title="Dashboard page">
      <p>Welcome on your dashboard</p>
      <Row>
        <Button onClick={onSignout}>Signout</Button>
      </Row>
    </Layout>
  );
}
