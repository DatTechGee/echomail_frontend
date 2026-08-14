import { Mail } from "lucide-react";
import { brand } from "@/constants/brand";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export const Logo = ({ size = "md", showText = true, className }: LogoProps) => {
  const sizeMap = { sm: 24, md: 36, lg: 48 };
  const width = sizeMap[size];
  const height = sizeMap[size];

  return (
    <div
      className={`flex items-center justify-center rounded-xl ${className}`}
      style={{ width, height, background: `linear-gradient(135deg, ${brand.colors.primary}, ${brand.colors.secondary})` }}
    >
      <Mail
        className="w-5 h-5 text-white"
        style={{ rotate: -15, marginBottom: "-2px" }}
      />
      {showText && (
        <span
          className="ml-2 text-xl font-extrabold tracking-tight capitalize"
          style={{ backgroundImage: `linear-gradient(135deg, ${brand.colors.primary}, ${brand.colors.accent})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          EchoMail
        </span>
      )}
    </div>
  );
};
