import { motion } from "framer-motion";
import { useRouter } from "next/router";

const PageTransition = ({ children }) => {
  const router = useRouter();

  return (
    <motion.div
      key={router.pathname}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 0.2,
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
