interface HeaderWrapperProps {
  children: React.ReactNode;
  title: React.ReactNode;
  className?: string;
}

export const HeaderWrapper = ({ children, title, className }: HeaderWrapperProps) => {
  return (
    <div className={`flex flex-col w-full items-center h-screen ${className || ''}`}>
      <h1 className="text-[36px] sm:text-[56px] text-white font-semibold text-center pb-6 sm:pb-16 whitespace-pre-line max-w-3xl mt-48 sm:mt-52">
        {title}
      </h1>
      {children}
    </div>
  );
};
