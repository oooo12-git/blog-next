import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Footer() {
  return (
    <footer
      className={`flex justify-between text-neutral-500 mt-10 font-thin text-xs ${inter.className}`}
    >
      <p>KIM JAE HYUN</p>
      <div>Total Visitors</div>
      <div>Today Visitors</div>
      <a href="https://github.com/oooo12-git/blog-next" target="_blank">
        source
      </a>
    </footer>
  );
}
