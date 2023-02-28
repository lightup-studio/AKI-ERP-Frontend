function Title({ className, children }: any) {
  return <p className={`text-2xl font-bold  ${className}`}>{children}</p>;
}

export default Title;
