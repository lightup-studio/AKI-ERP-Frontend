function Subtitle({ styleClass, children }: any) {
  return (
    <div className={`text-xl font-semibold ${styleClass}`}>{children}</div>
  );
}

export default Subtitle;
