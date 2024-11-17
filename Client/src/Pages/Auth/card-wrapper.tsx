import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import AuthHeader from "./auth-header";
import BackButton from "./back-button";

interface CardWrapperProps {
  title: string;
  children: React.ReactNode;
  backLabel: string;
  backHref: string;
}
const CardWrapper = ({
  title,
  children,
  backLabel,
  backHref,
}: CardWrapperProps) => {
  return (
    <div className="w-full flex flex-col items-center ">
      <div className="w-full max-w-[60%] space-y-2 ">
        <Card className="w-full shadow-md bg-baseform/30 p-2 px-8 border border-2px border-authborder">
          <CardHeader className="w-full pb-8 ">
            <AuthHeader title={title} />
          </CardHeader>
          <CardContent className="w-full px-6">{children}</CardContent>
        </Card>
        <div className="w-full flex justify-start">
          <BackButton label={backLabel} href={backHref} />
        </div>
      </div>
    </div>
  );
};

export default CardWrapper;
