import { Button } from "@/components/ui/button";

import { Link } from "react-router-dom";

interface BackButtonProps {
  label: string;
  href: string;
}
const BackButton = ({ label, href }: BackButtonProps) => {
  return (
    <Button className="text-white underline" variant="link" asChild>
      <Link to={href}>{label}</Link>
    </Button>
  );
};

export default BackButton;
