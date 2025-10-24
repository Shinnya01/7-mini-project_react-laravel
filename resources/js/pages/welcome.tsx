import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { CheckSquare, Rss, User, StickyNote } from 'lucide-react';
import { useState } from 'react';

// 💬 Guest Welcome Page with Dark Humor Cards
export default function Welcome() {
  return (
    <>
      <Head title="Welcome" />

      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-br from-gray-900 via-[#111] to-gray-800 text-white select-none">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Animated title */}
          <motion.h1
            animate={{ rotate: [0, 2, -2, 0], scale: [1, 1.05, 0.98, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl font-extrabold mb-2 drop-shadow-lg"
          >
            <span className="text-amber-400">Bossing!</span>
          </motion.h1>

          {/* Cards with random dark jokes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-10">
            <WeirdCard
              href="/to-do-list"
              icon={<CheckSquare className="h-12 w-12 text-blue-400" />}
              title="To-Do List"
              jokes={[
                "joke 1",
                "joke 2",
                "joke 3",
              ]}
              color="from-blue-500/20 to-blue-800/10"
            />
            <WeirdCard
              href="/blog-post"
              icon={<Rss className="h-12 w-12 text-orange-400" />}
              title="Blog Post"
              jokes={[
                "joke 1",
                "joke 2",
                "joke 3",
              ]}
              color="from-orange-500/20 to-orange-800/10"
            />
            <WeirdCard
              href="/contact-manager"
              icon={<User className="h-12 w-12 text-green-400" />}
              title="Contacts"
              jokes={[
                "joke 1",
                "joke 2",
                "joke 3",
              ]}
              color="from-green-500/20 to-green-800/10"
            />
            <WeirdCard
              href="/note"
              icon={<StickyNote className="h-12 w-12 text-yellow-400" />}
              title="Notes"
              jokes={[
                "joke 1",
                "joke 2",
                "joke 3",
              ]}
              color="from-yellow-500/20 to-yellow-800/10"
            />
          </div>

          {/* Login/Register buttons */}
          <div className="mt-12 flex justify-center gap-4">
            <Link
              href="/login"
              className="bg-amber-500/20 border border-amber-500/30 hover:bg-amber-500/30 px-6 py-2 rounded-lg text-amber-300 font-semibold transition-all"
            >
              Mag-Login
            </Link>
            <Link
              href="/register"
              className="bg-pink-500/20 border border-pink-500/30 hover:bg-pink-500/30 px-6 py-2 rounded-lg text-pink-300 font-semibold transition-all"
            >
              Mag-Sign Up
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}

// 🎭 Weird Card with Random Hover Jokes
function WeirdCard({
  href,
  icon,
  title,
  jokes,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  jokes: string[];
  color: string;
}) {
  const [hovered, setHovered] = useState(false);

  // Pick a random joke
  const joke = jokes[Math.floor(Math.random() * jokes.length)];

  return (
    <motion.div
      whileHover={{
        rotate: [0, 3, -3, 0],
        scale: 1.05,
        transition: { duration: 0.3 },
      }}
      whileTap={{ scale: 0.95, rotate: 2 }}
    >
      <Link
        href={href}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`relative bg-gradient-to-br ${color} hover:scale-105 transition-all p-6 rounded-2xl shadow-lg flex flex-col items-center text-center group`}
      >
        <motion.div
          animate={{ y: [0, -4, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-3"
        >
          {icon}
        </motion.div>
        <span className="font-bold text-white text-lg">{title}</span>
        <p className="text-xs text-gray-400 mt-2">
          {hovered ? joke : "Hover mo "}
        </p>

        <motion.div
          className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none"
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.02, 1],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </Link>
    </motion.div>
  );
}
