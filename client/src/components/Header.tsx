import { Sparkles, Link2 } from "lucide-react"
import { ThemeToggle } from "./ui/theme-toggle"
import { Button } from "./ui/button"
import { useNavigate } from "react-router-dom"

export function Header() {
  const navigate = useNavigate()

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate("/")}
        >
          <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            CineCite
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/url-info")}
            className="flex items-center gap-2 border-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950 font-semibold"
          >
            <Link2 className="h-4 w-4" />
            <span>URL Info</span>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
