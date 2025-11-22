export function Footer() {
  return (
    <footer className="fixed bottom-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t shadow-sm">
      <div className="container flex h-14 items-center justify-between">
        <p className="mx-6 text-sm text-muted-foreground">
          Built by <a href="https://pythagora.ai" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline">Pythagora</a>
        </p>
      </div>
    </footer>
  )
}