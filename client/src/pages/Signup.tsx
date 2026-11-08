import { Button } from "../components/Button";
import { Form } from "../components/Form";
import { Input } from "../components/Input";
import { Layout } from "../components/Layout";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";

export function SignupPage() {
  const navigate = useNavigate();

  async function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.target);
    const json = { email: form.get("email"), password: form.get("password") };
    const { data } = await axios.post<{ item: { id: number } }>(
      "/api/users",
      json,
    );

    if (data?.item?.id) {
      toast.success("User created, you can signin");
      navigate("/", { replace: true });
    } else {
      toast.error("Unable to create user");
    }
  }

  return (
    <Layout title="Home page">
      <p>Signup on the app</p>
      <Form onSubmit={onSubmit}>
        <Input name="email" type="email" placeholder="User email" />
        <Input name="password" type="password" placeholder="Password" />
        <Button type="submit">Signup</Button>
      </Form>
    </Layout>
  );
}
