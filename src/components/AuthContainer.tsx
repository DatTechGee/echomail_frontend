import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Users, Zap, TrendingUp } from "lucide-react";
import { brand } from "@/constants/brand";
import { ThemeToggle } from "@/components/ThemeToggle";

const typewriterTexts = [
  "Connect with talented freelancers",
  "Join a thriving creative community",
  "Learn and grow together",
  "Elevate your skills with experts",
];

interface AuthContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const AuthContainer = ({
  children,
  title = "Welcome to",
  subtitle = "Levelup Xperience",
}: AuthContainerProps) => {
  const [currentText, setCurrentText] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const text = typewriterTexts[currentText];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < text.length) {
            setDisplayText(text.slice(0, displayText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(displayText.slice(0, -1));
          } else {
            setIsDeleting(false);
            setCurrentText((prev) => (prev + 1) % typewriterTexts.length);
          }
        }
      },
      isDeleting ? 50 : 100
    );

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentText]);

  return (
    <div className="min-h-screen flex overflow-hidden bg-slate-50 dark:bg-slate-900">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/assets/bg-image.jpg')`,
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${brand.colors.primary}80, ${brand.colors.primary}80, ${brand.colors.secondary}80)`,
          }}
        />

        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 6 + Math.random() * 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col justify-center items-start p-12 text-white">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="flex items-center space-x-4">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <img
                    src={brand.logo}
                    alt={brand.projectName}
                    className="w-64 object-contain"
                  />
                </div>
              </motion.div>
            </div>

            <div className="space-y-4">
              <h2 className="text-5xl font-light leading-tight">
                {title}
                <br />
                <span className="font-bold">{subtitle}</span>
              </h2>

              <div className="h-16 flex items-center">
                <span className="text-xl text-white/90">
                  {displayText}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block w-0.5 h-6 ml-1 bg-white"
                  />
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: Users,
                  title: "Vibrant Community",
                  desc: "Connect with like-minded creators",
                },
                {
                  icon: Zap,
                  title: "Skill Development",
                  desc: "Learn from industry experts",
                },
                {
                  icon: TrendingUp,
                  title: "Grow Together",
                  desc: "Collaborate and elevate your career",
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.2, duration: 0.6 }}
                  className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                >
                  <div className="p-2 rounded-lg bg-white/20">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-white/80 text-sm">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 lg:p-12 relative overflow-hidden">
        <div className="absolute top-4 right-4 z-20">
          <ThemeToggle />
        </div>

        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 right-20 w-40 h-40 rounded-full filter blur-3xl opacity-10"
            style={{ backgroundColor: brand.colors.primary }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 left-20 w-32 h-32 rounded-full filter blur-3xl opacity-10"
            style={{ backgroundColor: brand.colors.accent }}
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md relative z-10"
        >
          <div className="lg:hidden text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <img src={brand.logo} alt={brand.projectName} className="w-40" />
            </div>
          </div>

          {children}
        </motion.div>
      </div>
    </div>
  );
};
