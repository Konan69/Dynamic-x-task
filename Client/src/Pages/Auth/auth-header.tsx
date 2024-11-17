interface AuthHeaderProps {
  title: string;
}
const AuthHeader = ({ title }: AuthHeaderProps) => {
  return (
    <div className="flex flex-col w-full items-center justify-center">
      <h1 className="text-[36px] text-white font-semibold">{title}</h1>
    </div>
  );
};

export default AuthHeader;
