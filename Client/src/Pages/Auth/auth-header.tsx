interface AuthHeaderProps {
  title: string;
}
const AuthHeader = ({ title }: AuthHeaderProps) => {
  return (
    <div className="flex flex-col w-full items-center justify-center">
      <h1 className="text-xl sm:text-2xl md:text-[36px] text-white font-semibold text-center px-2">
        {title}
      </h1>
    </div>
  );
};

export default AuthHeader;
