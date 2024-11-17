import { Signup } from "./Auth/sign-up";
import { HeaderWrapper } from "@/components/header-wrapper";

export const Home = () => {
  return (
    <HeaderWrapper
      title={`Stay on top of your
schedule with Runam`}
    >
      <Signup />
    </HeaderWrapper>
  );
};
