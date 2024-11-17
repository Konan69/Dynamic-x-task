interface HeaderWrapperProps {
  children: React.ReactNode;
  title: React.ReactNode;
}

export const HeaderWrapper = ({ children, title }: HeaderWrapperProps) => {
  return (
    <div className="flex flex-col w-full items-center justify-center h-screen">
      <h1 className="text-[56px] text-white font-semibold text-center pb-12 whitespace-pre-line max-w-3xl">
        {title}
      </h1>
      {children}
    </div>
  );
};
