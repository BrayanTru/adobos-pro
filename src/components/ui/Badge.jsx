const VARIANTS = {
  green: "badge-green",
  red: "badge-red",
  yellow: "badge-yellow",
  blue: "badge-blue",
  gray: "badge-gray",
};

export default function Badge({ children, variant = "gray" }) {
  return <span className={`badge ${VARIANTS[variant]}`}>{children}</span>;
}
