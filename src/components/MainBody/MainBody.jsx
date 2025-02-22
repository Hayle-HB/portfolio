import React from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectTheme } from "../../features/theme/themeSlice";
import World from "../3D/World";
import CrystalField from "../3D/CrystalField";

const MainBody = () => {
  const theme = useSelector(selectTheme);
  const isDark = theme === "dark";

  return (
    <main
      className={`h-screen pt-16 ${
        isDark ? "bg-slate-950" : "bg-gray-50"
      } relative overflow-hidden transition-colors duration-300`}
    >
      {/* Background with theme-aware gradient */}
      <div className="absolute inset-0 z-0">
        <div
          className={`absolute inset-0 bg-gradient-to-b ${
            isDark
              ? "from-slate-950 via-slate-900 to-slate-950"
              : "from-gray-50 via-gray-100 to-gray-50"
          } opacity-90 transition-colors duration-300`}
        />
        <CrystalField />
      </div>

      {/* Main Content - Centered */}
      <div className="relative z-10 h-full container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-7xl w-full">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full lg:w-[600px] text-center lg:text-left"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`text-4xl lg:text-6xl font-semibold mb-4 ${
                  isDark ? "text-white" : "text-gray-900"
                } transition-colors duration-300`}
              >
                Hi, I'm Haylemeskel Haylemariam
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`text-xl lg:text-2xl mb-6 ${
                  isDark ? "text-blue-400" : "text-blue-600"
                } transition-colors duration-300`}
              >
                <TypeAnimation
                  sequence={[
                    "Software Engineer",
                    2000,
                    "Full Stack Developer",
                    2000,
                    "UI/UX Designer",
                    2000,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`text-base lg:text-lg ${
                  isDark ? "text-slate-300" : "text-gray-600"
                } leading-relaxed mb-10 transition-colors duration-300`}
              >
                4th Year Software Engineering Student with a passion for
                creating innovative solutions. Specializing in modern web
                technologies and user-centric design.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap justify-center lg:justify-start gap-6 mb-10"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-8 py-3 ${
                    isDark
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white rounded-lg transition-all duration-200 font-medium text-base shadow-md hover:shadow-lg`}
                >
                  View Projects
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-8 py-3 border ${
                    isDark
                      ? "border-slate-600 hover:border-blue-400 text-slate-300 hover:text-blue-400"
                      : "border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600"
                  } rounded-lg transition-all duration-200 text-base`}
                >
                  Contact Me
                </motion.button>
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex gap-8 justify-center lg:justify-start"
              >
                {[
                  { icon: FaGithub, url: "https://github.com/yourusername" },
                  {
                    icon: FaLinkedin,
                    url: "https://linkedin.com/in/yourusername",
                  },
                  {
                    icon: FaInstagram,
                    url: "https://instagram.com/yourusername",
                  },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2 }}
                    className={`${
                      isDark
                        ? "text-slate-400 hover:text-blue-400"
                        : "text-gray-500 hover:text-blue-600"
                    } transition-colors duration-200`}
                  >
                    <social.icon size={24} />
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Content - 3D World */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="w-[280px] h-[280px] lg:w-[400px] lg:h-[400px]"
            >
              <World />
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainBody;
