export default function LayoutPrimary({ children, className }) {
  return (
    <div
      id="Primary"
      className={`overflow-y-scroll ${className ? className : ""}`}
    >
      <div className="w-full h-full overflow-hidden">{children}</div>
    </div>
  );
}
